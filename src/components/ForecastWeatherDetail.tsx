import React from "react";
import Container from "./Container";
import WeatherIcon from "./WeatherIcon";
import WeatherDetails, { WeatherDetailsProps } from "./WeatherDetails";
import { convertKelvinToCelsius } from "@/util/convertKelvinToCelsius";

export interface ForecastWeatherDetailProps extends WeatherDetailsProps {
  weatherIcon: string;
  date: string;
  day: string;
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  description: string;
}

export default function ForecastWeatherDetail(props: ForecastWeatherDetailProps) {
  const {
    weatherIcon = "No Data",
    date = "No Data",
    day = "No Data",
    temp,
    feels_like,
    temp_min,
    temp_max,
    description = "No Data",
  } = props;

  return (
    <Container className="gap-4">
      {/* left */}
      <section className="flex justify-between gap-4 items-center px-4 w-full">
        <div className="flex items-center">
          <p className="">{date}</p>
          <p className="text-sm">{day}</p>
        </div>
        <p className="capitalize">{description}</p>

        <div className="flex flex-col justify-center px-4">
          <p className="text-xs space-x-1 whitespace-nowrap">
            <WeatherIcon iconName={weatherIcon} />
            <span>{convertKelvinToCelsius(temp_min ?? 0)}°↓</span>
            <span>{convertKelvinToCelsius(temp_max ?? 0)}°↑</span>
          </p>
        </div>
      </section>

      {/* right */}
      {/* <section className="flex overflow-x-auto justify-between gap-4 px-4 w-full pr-10 text-slate-700/90">
        <WeatherDetails {...props} />
      </section> */}
    </Container>
  );
}
