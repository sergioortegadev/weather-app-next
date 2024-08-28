import React from "react";
import { LuEye, LuDroplet, LuWind, LuSunrise, LuSunset } from "react-icons/lu";
import { ImMeter } from "react-icons/im";

export interface WeatherDetailsProps {
  visibiliti?: string;
  humidity?: string;
  windSpeed?: string;
  windDirection?: string;
  airPressure?: string;
  sunrise?: string;
  sunset?: string;
}

export interface SingleWeatherDetailProps {
  information: string;
  icon: React.ReactNode;
  value: string;
}

function SingleWeatherDetail(props: SingleWeatherDetailProps) {
  return (
    <div className="flex flex-col justify-between gap-2 items-center text-xs font-semibold">
      <p className="whitespace-nowrap">{props.information}</p>
      <div className="text-3xl">{props.icon}</div>
      <p className="">{props.value}</p>
    </div>
  );
}

export default function WeatherDetails(props: WeatherDetailsProps) {
  const {
    visibiliti = "No Data",
    humidity = "No Data",
    windSpeed = "No Data",
    windDirection = "",
    airPressure = "No Data",
    sunrise = "No Data",
    sunset = "No Data",
  } = props;
  return (
    <>
      <SingleWeatherDetail icon={<LuEye />} information="Visibility" value={visibiliti} />
      <SingleWeatherDetail icon={<LuDroplet />} information="Humidity" value={humidity} />
      <SingleWeatherDetail icon={<LuWind />} information="Wind Speed" value={windSpeed + windDirection} />
      <SingleWeatherDetail icon={<ImMeter />} information="Air Pressure" value={airPressure} />
      <SingleWeatherDetail icon={<LuSunrise />} information="Sunrise" value={sunrise} />
      <SingleWeatherDetail icon={<LuSunset />} information="Sunset" value={sunset} />
    </>
  );
}
