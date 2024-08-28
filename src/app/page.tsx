"use client";

import { useEffect } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format, fromUnixTime, parseISO } from "date-fns";
import Container from "@/components/Container";
import { convertKelvinToCelsius } from "@/util/convertKelvinToCelsius";
import WeatherIcon from "@/components/WeatherIcon";
import { getDayOrNightIcon } from "@/util/getDayOrNightIcon";
import WeatherDetails from "@/components/WeatherDetails";
import { degToCardinalPoint } from "@/util/windDegToCardinalPoints";
import ForecastWeatherDetail from "@/components/ForecastWeatherDetail";
import { useAtom } from "jotai";
import { placeAtom } from "./atom";

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

export default function Home() {
  const [place, setPlace] = useAtom(placeAtom);

  const { isPending, error, data, refetch } = useQuery<WeatherData>({
    queryKey: ["weatherData"],
    queryFn: async () => {
      const response = await axios.get<WeatherData>(
        `http://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56`
      );
      //console.log(response.data);
      return response.data;
    },
  });

  useEffect(() => {
    refetch();
  }, [place, refetch]);

  const firstData = data?.list[0];
  //firstData.visibility = undefined;

  const uniqueDates = [...new Set(data?.list.map((entry) => new Date(entry.dt * 1000).toISOString().split("T")[0]))];

  const firstDataForEachDate = uniqueDates.map((date) => {
    return data?.list.find((entry) => {
      const entryDate = new Date(entry.dt * 1000).toISOString().split("T")[0];
      const entryTime = new Date(entry.dt * 1000).getHours();
      return entryDate === date && entryTime >= 6;
    });
  });

  if (isPending)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Image className="animate-bounce" src="/loading.svg" width={120} height={30} alt="loading animation" priority />
      </div>
    );

  if (error) return "An error has occurred in fetch data [with open weather API]: " + (error as Error).message;

  return (
    <>
      <div className="flex flex-col gap-4 bg-gray-100 min-h-screen">
        <Navbar location={`${data?.city.name}, ${data?.city.country}`} />
        <main className="flex flex-col gap-9 px-3 max-w-7xl mx-auto w-full pb-10 pt-4">
          {/* Today Data - 1st and 2dn bar */}
          <section className="space-y-4">
            <div className="space-y-2">
              <h2 className="flex gap-1 text-2xl items-end">
                <p>{format(parseISO(firstData?.dt_txt ?? ""), "EEEE")}</p>
                <p className="text-lg"> - {format(parseISO(firstData?.dt_txt ?? ""), "dd.MM.yyyy")}</p>
              </h2>
              {/* 1st bar */}
              <Container className="gap-10 px-6 items-center">
                {/* temprature */}
                <div className="flex flex-col px-4">
                  <span className="text-5xl">{convertKelvinToCelsius(firstData?.main.temp ?? 0)}°</span>
                  <p className="text-xs space-x-1 whitespace-nowrap">
                    <span>Feels like</span>
                    <span>{convertKelvinToCelsius(firstData?.main.feels_like ?? 0)}°</span>
                  </p>
                  <p className="text-xs space-x-2">
                    <span>{convertKelvinToCelsius(firstData?.main.temp_min ?? 0)}°↓</span>
                    <span>{convertKelvinToCelsius(firstData?.main.temp_max ?? 0)}°↑</span>
                  </p>
                </div>
                {/* time and weather icon */}
                <div className="flex pr-3 gap-10 sm:gap-16 overflow-x-auto w-full justify-between">
                  {data?.list.map((info, i) => (
                    <div key={i} className="flex flex-col justify-between gap-2 items-center text-xs font-semibold">
                      <p className="whitespace-nowrap">{format(parseISO(info.dt_txt), "hh:mm")}</p>

                      {/* <WeatherIcon iconName={info.weather[0].icon}/> */}
                      <WeatherIcon iconName={getDayOrNightIcon(info.weather[0].icon, info.dt_txt)} />

                      <p>{convertKelvinToCelsius(info?.main.temp ?? 0)}°</p>
                    </div>
                  ))}
                </div>
              </Container>
            </div>

            {/* 2nd bar */}
            <div className="flex gap-4">
              {/* left */}
              <Container className="flex-col px-4 items-center justify-center w-fit">
                <p className="capitalize text-center">{firstData?.weather[0].description}</p>
                <WeatherIcon iconName={getDayOrNightIcon(firstData?.weather[0].icon ?? "", firstData?.dt_txt ?? "")} />
              </Container>
              {/* right */}
              <Container className="bg-blue-600/90 px-6 gap-4 justify-between overflow-x-auto text-gray-100/90">
                <WeatherDetails
                  visibiliti={firstData?.visibility ? (firstData?.visibility / 1000).toFixed(0) + " km" : undefined}
                  humidity={`${firstData?.main.humidity} %`}
                  airPressure={`${firstData?.main.pressure} hPa`}
                  windSpeed={firstData?.wind.speed ? (firstData?.wind.speed * 3.6).toFixed(0) + " km/h" : undefined}
                  windDirection={` ${degToCardinalPoint(firstData?.wind.deg)}`}
                  sunrise={format(fromUnixTime(data?.city.sunrise + data?.city.timezone * 1000), "h:mm")}
                  sunset={format(fromUnixTime(data?.city.sunset + data?.city.timezone * 1000), "H:mm")}
                />
              </Container>
            </div>
          </section>

          {/* 7 Days Forecast Data */}
          <section className="flex flex-col w-full gap-4">
            <p className="text-2xl">6 Days Forecast</p>
            {firstDataForEachDate.map((d, index) => (
              <ForecastWeatherDetail
                key={index}
                description={d?.weather[0].description ?? ""}
                weatherIcon={d?.weather[0].icon ?? "01d"}
                date={format(parseISO(d?.dt_txt ?? ""), "dd.MM")}
                day={format(parseISO(d?.dt_txt ?? ""), "EEEE")}
                feels_like={d?.main.feels_like ?? 0}
                temp={d?.main.temp ?? 0}
                temp_max={d?.main.temp_max ?? 0}
                temp_min={d?.main.temp_min ?? 0}
                airPressure={`${d?.main.pressure} hPa`}
                humidity={`${d?.main.pressure} %`}
                sunrise={format(fromUnixTime(data?.city.sunrise ?? 1702517657), "H:mm")}
                sunset={format(fromUnixTime(data?.city.sunset ?? 1702517657), "H:mm")}
                visibiliti={firstData?.visibility ? (firstData?.visibility / 1000).toFixed(0) + " km" : undefined}
                windSpeed={firstData?.wind.speed ? (firstData?.wind.speed * 3.6).toFixed(0) + " km/h" : undefined}
              />
            ))}
          </section>
        </main>
      </div>
    </>
  );
}
