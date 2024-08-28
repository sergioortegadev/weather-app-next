"use client";
import React, { useState } from "react";
import { MdWbSunny, MdMyLocation, MdOutlineLocationOn } from "react-icons/md";
import SearchBox from "./SearchBox";
import axios from "axios";
import { placeAtom } from "@/app/atom";
import { useAtom } from "jotai";

type Props = { location?: string };

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_KEY;

export default function Navbar({ location }: Props) {
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [place, setPlace] = useAtom(placeAtom);

  async function handleChange(value: string) {
    setCity(value);
    if (value.length >= 3) {
      try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/find?q=${value}&appid=${API_KEY}`);

        const suggestions = response.data.list.map((item: any) => `${item.name}, ${item.sys.country}`);
        setSuggestions(suggestions);
        setError("");
        setShowSuggestions(true);
      } catch (error) {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }

  function handleSuggestionClick(value: string) {
    setCity(value);
    setShowSuggestions(false);
  }

  function handleSubmitSeach(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (suggestions.length === 0) {
      setError("Location not found");
    } else {
      setError("");
      setPlace(city);
      setShowSuggestions(false);
    }
  }

  return (
    <nav className="shadow-sm sticky top-0 left-0 z-50 bg-white">
      <div className="h-[80px] w-full flex justify-between items-center max-w-7xl px-3 mx-auto">
        <div className="flex items-center justify-center gap-2">
          <h2 className="text-gray-500 text-3xl">Weather</h2>
          <MdWbSunny className="text-3xl mt-1 text-yellow-300" />
        </div>
        <section className="flex gap-2 items-center">
          <MdMyLocation className="text-2xl text-gray-400 hover:opacity-80 cursor-pointer" />
          <MdOutlineLocationOn className="text-2xl" />
          <p className="text-slate-900/80 text-sm">{location}</p>

          <div className="relative">
            <SearchBox value={city} onSubmit={handleSubmitSeach} onChange={(e) => handleChange(e.target.value)} />
            <SuggestionBox {...{ showSuggestions, suggestions, handleSuggestionClick, error }} />
          </div>
        </section>
      </div>
    </nav>
  );
}

function SuggestionBox({
  showSuggestions,
  suggestions,
  handleSuggestionClick,
  error,
}: {
  showSuggestions: boolean;
  suggestions: string[];
  handleSuggestionClick: (item: string) => void;
  error: string;
}) {
  return (
    <>
      {((showSuggestions && suggestions.length > 1) || error) && (
        <ul className="absolute flex flex-col py-2 px-2 gap-1 mb-4 bg-white border top-[44px] left-0 border-gray-300 rounded-md min-w-[200px]">
          {error && suggestions.length < 1 && <li className="text-red-500 p-1">{error}</li>}

          {suggestions.map((location, i) => (
            <li
              key={i}
              onClick={() => handleSuggestionClick(location)}
              className="cursor-pointer p-1 rounded hover:bg-gray-200"
            >
              {location}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
