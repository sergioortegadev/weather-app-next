import { useAtom } from "jotai";
import { placeAtom } from "@/app/atom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface WeatherData {
  cod: string;
  message: number;
  cnt: number;
  list: WeatherDetail[];
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

interface WeatherDetail {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  visibility: number;
  pop: number;
  rain?: {
    "3h": number;
  };
  sys: {
    pod: string;
  };
  dt_txt: string;
}

export default function useGetData() {
  const [place, setPlace] = useAtom(placeAtom);

  const { isPending, error, data, refetch } = useQuery<WeatherData>({
    queryKey: ["weatherData"],
    queryFn: async () => {
      const response = await axios.get<WeatherData>(
        `https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56`
      );

      return response.data;
    },
  });

  return { isPending, error, data, refetch };
}
