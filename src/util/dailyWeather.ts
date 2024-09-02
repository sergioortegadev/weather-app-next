import { WeatherDetail } from "@/helpers/useGetData";
import { WeatherData } from "@/helpers/useGetData";

export default function dailyWeather(uniqueDates: string[], data?: WeatherData) {
  return uniqueDates.map((date: string) => {
    // Filter all entries that match the current date
    const entriesForDate = data?.list.filter((entry: WeatherDetail) => {
      const entryDate = new Date(entry.dt * 1000).toISOString().split("T")[0];
      return entryDate === date;
    });

    // If there are no entries for the date, return undefined
    if (!entriesForDate || entriesForDate.length === 0) {
      return undefined;
    }

    // Calculates maximum and minimum temperature values for the date
    const tempMax = Math.max(...entriesForDate.map((entry: WeatherDetail) => entry.main.temp));
    const tempMin = Math.min(...entriesForDate.map((entry: WeatherDetail) => entry.main.temp));

    // Gets the icon and description information from the first record of the day.
    const { icon, description } = entriesForDate[0].weather[0];

    return {
      date,
      tempMax,
      tempMin,
      icon,
      description,
    };
  });
}
