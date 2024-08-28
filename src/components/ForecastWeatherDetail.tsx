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
      <section className="flex gap-4 items-center px-4">
        <div className="flex flex-col  items-center">
          <WeatherIcon iconName={weatherIcon} />
          <p className="">{date}</p>
          <p className="text-sm">{day}</p>
        </div>

        <div className="flex flex-col px-4">
          <span className="text-5xl">{convertKelvinToCelsius(temp ?? 0)}</span>
          <p className="text-xs space-x-1 whitespace-nowrap">
            <span>Feels like</span>
            <span>{convertKelvinToCelsius(feels_like ?? 0)}°</span>
          </p>
          <p className="capitalize">{description}</p>
        </div>
      </section>

      {/* right */}
      <section className="flex overflow-x-auto justify-between gap-4 px-4 w-full pr-10 text-slate-700/90">
        <WeatherDetails {...props} />
      </section>
    </Container>
  );
}
