import React from "react";
import { cn } from "@/util/cn";
import Image from "next/image";

//type Props = {};
interface WeatherIconProps {
  iconName: string;
  altText?: string;
}

export default function WeatherIcon({ iconName, altText = "Weather Icon" }: WeatherIconProps) {
  return (
    <div className={cn("relative h-20 w-20")}>
      <Image
        width={100}
        height={100}
        alt={altText}
        className="absolute w-full h-full"
        src={`https://openweathermap.org/img/wn/${iconName}@4x.png`}
        priority
      />
    </div>
  );
}