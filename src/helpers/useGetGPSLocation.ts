import axios from "axios";

export default async function useGetGPSLocation(): Promise<string> {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (gpsPosition) => {
          const { latitude, longitude } = gpsPosition.coords;
          try {
            const response = await axios.get(
              `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}`
            );
            resolve(response.data.name);
          } catch (error) {
            console.error(error);
            reject("Error fetching weather data");
          }
        },
        (error) => {
          console.error(error);
          reject("Error getting GPS location");
        }
      );
    } else {
      reject("Geolocation not supported");
    }
  });
}
