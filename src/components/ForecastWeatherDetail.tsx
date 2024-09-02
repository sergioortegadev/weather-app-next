import React from "react";
import Container from "./Container";
import WeatherIcon from "./WeatherIcon";
import WeatherDetails, { WeatherDetailsProps } from "./WeatherDetails";
import { adjustTemp } from "@/util/adjustTemp";

export interface ForecastWeatherDetailProps extends WeatherDetailsProps {
  weatherIcon?: string;
  date: string;
  day: string;
  temp_min?: number;
  temp_max?: number;
  description?: string;
  display: string;
}

export default function ForecastWeatherDetail(props: ForecastWeatherDetailProps) {
  const {
    weatherIcon = "No Data",
    date = "No Data",
    day = "No Data",
    temp_min,
    temp_max,
    description = "No Data",
    display = "mobile",
  } = props;

  return (
    <>
      {display === "mobile" ? (
        <Container className="gap-4 mb-2">
          <section className="flex justify-between gap-2 items-center px-2 w-full">
            <div className="flex flex-col">
              <div className="text-xl">{day}</div>
              <div className="text-lg">{date}</div>
              <p className="capitalize ">{description}</p>
            </div>

            <div className="flex flex-col justify-center items-center px-4 space-x-1 whitespace-nowrap font-semibold">
              <WeatherIcon iconName={weatherIcon} />
              <div className="">
                <span className="text-lg">{adjustTemp(temp_max)}°↑ </span>
                <span className="text-lg">{adjustTemp(temp_min)}°↓</span>
              </div>
            </div>
          </section>
        </Container>
      ) : (
        <section className="flex flex-col justify-between items-center w-full md:">
          <div className="flex flex-col items-center">
            <div className="font-semibold">{day}</div>
            <div className="">{date}</div>
          </div>

          <div className="flex flex-col justify-center items-center space-x-1 whitespace-nowrap font-semibold">
            <p className="capitalize text-xs md:text-base">{description}</p>
            <WeatherIcon iconName={weatherIcon} />
            <div className="max-md:flex flex-col">
              <span className="">{adjustTemp(temp_max)}°↑ </span>
              <span className="">{adjustTemp(temp_min)}°↓</span>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
