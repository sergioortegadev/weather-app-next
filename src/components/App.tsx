"use client";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { useAtom } from "jotai";
import { showSearchBoxAtom, loadingCityAtom, placeAtom } from "@/app/atom";
import { format, fromUnixTime, getUnixTime, parseISO } from "date-fns";
import WeatherDetails from "@/components/WeatherDetails";
import Container from "@/components/Container";
import ForecastWeatherDetail from "@/components/ForecastWeatherDetail";
import Navbar from "@/components/Navbar";
import WeatherIcon from "@/components/WeatherIcon";
import { convertKelvinToCelsius } from "@/util/convertKelvinToCelsius";
import { degToCardinalPoint } from "@/util/windDegToCardinalPoints";
import { getDayOrNightIcon } from "@/util/getDayOrNightIcon";
import useGetData from "@/helpers/useGetData";
import useGetGPSLocation from "@/helpers/useGetGPSLocation";
import useInitialLocation from "@/helpers/useInitialLocation";

export default function Main() {
  const [place, setPlace] = useAtom(placeAtom);
  const [loadingCity, setLoadingCity] = useAtom(loadingCityAtom);
  const [showSearchBox, setShowSearchBox] = useAtom(showSearchBoxAtom);

  const { isPending, error, data, refetch } = useGetData();

  const firstData = data?.list[0];
  const cityData = data?.city;

  useEffect(() => {
    refetch();
    (async () => {
      localStorage.setItem("location", await place);
    })();
  }, [place, refetch, cityData]);

  useEffect(() => {
    (async () => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      setPlace(await useInitialLocation());
    })();
  }, []);

  const uniqueDates = [...new Set(data?.list.map((entry) => new Date(entry.dt * 1000).toISOString().split("T")[0]))];

  const firstDataForEachDate = uniqueDates.map((date) => {
    return data?.list.find((entry) => {
      const entryDate = new Date(entry.dt * 1000).toISOString().split("T")[0];
      const entryTime = new Date(entry.dt * 1000).getHours();
      return entryDate === date && entryTime >= 6;
    });
  });
  console.log(firstDataForEachDate);

  if (isPending || !cityData)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Image className="animate-bounce" src="/loading.svg" width={120} height={30} alt="loading animation" priority />
      </div>
    );

  if (error) return "An error has occurred in fetch data [with open weather API]: " + (error as Error).message;

  return (
    <>
      <div className="flex flex-col md:gap-4 bg-gray-100 min-h-screen overflow-x-hidden">
        <Navbar location={`${data?.city.name}, ${data?.city.country}`} />
        <main
          onClick={() => setShowSearchBox(false)}
          className="flex flex-col gap-9 md:px-3 max-w-6xl mx-auto w-full pb-10 md:pt-4 bg-heroday bg-blend-overlay bg-[center_top_-3rem] md:bg-center lg:bg-[center_-20rem] bg-no-repeat bg-cover xl:bg-[length:1280px_1800] bg-fixed "
        >
          {loadingCity ? (
            <WeatherSkeleton />
          ) : (
            <>
              <section className="flex flex-col space-y-4 px-2 lg:px-0">
                {/* Today Data - 1st and 2dn bar */}

                {/*<h2 className="flex gap-1 text-2xl items-end">
                     <p>{format(parseISO(firstData?.dt_txt ?? ""), "EEEE")}</p> 
                     <p className="text-lg"> - {format(parseISO(firstData?.dt_txt ?? ""), "dd.MM.yyyy")}</p>
                     </h2>*/}

                {/* 1nd bar */}
                <div className="space-y-2">
                  <div className="flex justify-end gap-4 mb-36 sm:mb-52 lg:mb-80">
                    <Container className="w-52 md:w-60 lg:w-[22rem] mt-2 md:mr-8  px-4 items-center justify-center text-gray-700 bg-white/40 border-transparent backdrop-blur-[2px] lg:backdrop-blur-md">
                      {/* tempratures: now - min - max */}
                      <div className="flex flex-col items-center px-4">
                        <span className="text-5xl md:text-6xl lg:text-8xl">
                          {convertKelvinToCelsius(firstData?.main.temp ?? 0)}°
                        </span>
                        <p className="text-xs md:text-lg space-x-1 whitespace-nowrap">
                          <span>Feels like</span>
                          <span>{convertKelvinToCelsius(firstData?.main.feels_like ?? 0)}°</span>
                        </p>
                        <p className="text-sm md:text-xl space-x-2">
                          <span>{convertKelvinToCelsius(firstData?.main.temp_min ?? 0)}°↓</span>
                          <span>{convertKelvinToCelsius(firstData?.main.temp_max ?? 0)}°↑</span>
                        </p>
                      </div>
                      {/* description and icon */}
                      <div className="flex flex-col lg:ml-8">
                        <p className="capitalizem text-sm md:text-xl lg:text-3xl text-center p-0 m-[-.5rem]">
                          {firstData?.weather[0].description}
                        </p>
                        <WeatherIcon
                          className="h-28 w-28 mb-[-2rem]"
                          iconName={getDayOrNightIcon(firstData?.weather[0].icon ?? "", firstData?.dt_txt ?? "")}
                        />
                      </div>
                    </Container>
                  </div>
                </div>

                {/* visibiliti hum wind etc - mobile */}
                <Container className="grid grid-cols-2 w-44 md:hidden bg-blue-600/80 px-2 gap-2 overflow-x-auto text-gray-100/90">
                  <WeatherDetails
                    visibiliti={firstData?.visibility ? (firstData?.visibility / 1000).toFixed(0) + " km" : undefined}
                    humidity={`${firstData?.main.humidity} %`}
                    airPressure={`${firstData?.main.pressure} hPa`}
                    windSpeed={firstData?.wind.speed ? (firstData?.wind.speed * 3.6).toFixed(0) + " km/h" : undefined}
                    windDirection={` ${degToCardinalPoint(firstData?.wind.deg)}`}
                    sunrise={format(fromUnixTime(cityData?.sunrise + cityData?.timezone * 1000), "h:mm")}
                    sunset={format(fromUnixTime(cityData?.sunset + cityData?.timezone * 1000), "H:mm")}
                  />
                </Container>

                {/* visibiliti hum wind etc - desktop */}
                <h2 className="max-md:hidden flex text-2xl p-2 m-0 mt-80 border-transparent shadow-md bg-white/60 rounded-lg w-fit">
                  Now
                </h2>
                <Container className="max-md:hidden bg-blue-600/80 px-6 gap-4 justify-between overflow-x-auto text-gray-100 py-6">
                  <WeatherDetails
                    visibiliti={firstData?.visibility ? (firstData?.visibility / 1000).toFixed(0) + " km" : undefined}
                    humidity={`${firstData?.main.humidity} %`}
                    airPressure={`${firstData?.main.pressure} hPa`}
                    windSpeed={firstData?.wind.speed ? (firstData?.wind.speed * 3.6).toFixed(0) + " km/h" : undefined}
                    windDirection={` ${degToCardinalPoint(firstData?.wind.deg)}`}
                    sunrise={format(fromUnixTime(cityData?.sunrise + cityData?.timezone * 1000), "h:mm")}
                    sunset={format(fromUnixTime(cityData?.sunset + cityData?.timezone * 1000), "H:mm")}
                  />
                </Container>

                {/* 2st bar */}
                <Container className="sm:gap-10 px-6 items-center">
                  {/* time and weather icon */}
                  <div className="flex pr-3 gap-6 sm:gap-16 overflow-x-auto w-full justify-between">
                    {data?.list.slice(0, 7).map((info, i) => (
                      <div key={i} className="flex flex-col justify-between gap-1 items-center text-xs font-semibold">
                        <p className="whitespace-nowrap">{format(parseISO(info.dt_txt), "H:mm")}</p>

                        <WeatherIcon iconName={getDayOrNightIcon(info.weather[0].icon, info.dt_txt)} />

                        <p>{convertKelvinToCelsius(info?.main.temp ?? 0)}°</p>
                      </div>
                    ))}
                  </div>
                </Container>
              </section>

              {/* 6 Days Forecast Data */}
              <section className="flex flex-col w-full gap-4 px-2">
                <p className="text-2xl px-4 py-2 border-transparent shadow-md bg-white/60 rounded-lg w-fit">
                  6 Days Forecast
                </p>
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
            </>
          )}
        </main>
      </div>
    </>
  );
}
function WeatherSkeleton() {
  return (
    <main className="flex flex-col gap-9 px-3 max-w-7xl mx-auto w-full pb-10 pt-4 animate-pulse">
      {/* Skeleton para Today Data - 1st and 2nd bar */}
      <section className="space-y-4">
        <div className="space-y-2">
          <div className="h-6 bg-gray-300 rounded w-3/4"></div>
          {/* 1st bar */}
          <div className="flex gap-10 px-6 items-center h-36">
            {/* temprature */}
            <div className="flex flex-col px-4">
              <div className="h-12 bg-gray-300 rounded w-20"></div>
              <div className="h-4 bg-gray-300 rounded mt-2 w-24"></div>
              <div className="h-4 bg-gray-300 rounded mt-2 w-32"></div>
            </div>
            {/* time and weather icon */}
            <div className="flex pr-3 gap-6 overflow-x-auto w-full justify-between">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="flex flex-col justify-between gap-2 items-center text-xs font-semibold">
                    <div className="h-4 bg-gray-300 rounded w-12"></div>
                    <div className="h-8 bg-gray-300 rounded-full w-8"></div>
                    <div className="h-4 bg-gray-300 rounded w-10"></div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* 2nd bar */}
        <div className="flex gap-4">
          {/* left */}
          <div className="flex-col px-4 items-center justify-center w-fit">
            <div className="h-4 bg-gray-300 rounded w-32"></div>
            <div className="h-12 bg-gray-300 rounded-full w-12 mt-4"></div>
          </div>
          {/* right */}
          <div className="bg-gray-300 px-6 gap-4 justify-between overflow-x-auto w-full h-36 rounded-xl"></div>
        </div>
      </section>

      {/* Skeleton para 6 Days Forecast Data */}
      <section className="flex flex-col w-full gap-4">
        <div className="h-6 bg-gray-300 rounded w-48"></div>
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="flex gap-4 items-center h-32">
              <div className="h-12 w-12 bg-gray-300 rounded-full"></div>
              <div className="flex flex-col gap-2 w-full">
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
          ))}
      </section>
    </main>
  );
}
