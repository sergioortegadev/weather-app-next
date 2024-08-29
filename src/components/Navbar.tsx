"use client";
import React, { useState, useRef, useEffect } from "react";
import { MdWbSunny, MdMyLocation, MdOutlineLocationOn } from "react-icons/md";
import SearchBox from "./SearchBox";
import axios from "axios";
import { useAtom } from "jotai";
import { showSearchBoxAtom, loadingCityAtom, placeAtom } from "@/app/atom";
import useGetGPSLocation from "@/helpers/useGetGPSLocation";

type Props = { location?: string };

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_KEY;

export default function Navbar({ location }: Props) {
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [showSearchBox, setShowSearchBox] = useAtom(showSearchBoxAtom);
  const [place, setPlace] = useAtom(placeAtom);
  const [_, setLoadingCity] = useAtom(loadingCityAtom);

  const searchBoxRef = useRef<HTMLInputElement>(null);
  const suggestionRefs = useRef<(HTMLLIElement | null)[]>([]);

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
    } /* else {
      setSuggestions([]);
      setShowSuggestions(false);
    } */
  }

  function handleSuggestionClick(value: string) {
    setCity(value);
    setPlace(value);
    setShowSuggestions(false);
    setShowSearchBox(false);
  }

  function handleSubmitSeach(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoadingCity(true);
    if (suggestions.length === 0) {
      setLoadingCity(false);
      setError("Location not found");
      setTimeout(() => {
        setError("");
        setShowSuggestions(false);
      }, 3000);
    } else {
      setError("");
      setTimeout(() => {
        setPlace(city);
        setLoadingCity(false);
        setShowSuggestions(false);
        setShowSearchBox(false);
      }, 500);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Tab" && showSuggestions && suggestions.length > 0) {
      e.preventDefault();
      suggestionRefs.current[0]?.focus();
    }
  }

  function handleSuggestionKeyDown(e: React.KeyboardEvent<HTMLLIElement>, index: number) {
    if (e.key === "ArrowDown") {
      suggestionRefs.current[index + 1]?.focus();
    } else if (e.key === "ArrowUp") {
      if (index === 0) {
        searchBoxRef.current?.focus();
      } else {
        suggestionRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "Enter") {
      handleSuggestionClick(suggestions[index]);
    }
  }

  async function handleGetGPSLocation() {
    setLoadingCity(true);
    setPlace(await useGetGPSLocation());
    setLoadingCity(false);
    setShowSearchBox(false);
  }

  useEffect(() => {
    setCity(place);
  }, [place]);

  return (
    <>
      <nav className="shadow-sm sticky top-0 left-0 z-50 bg-white">
        <div className="max-[400px]:h-12 max-[500px]:h-16 h-20 w-full flex justify-between items-center max-w-7xl px-3 mx-auto">
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-gray-500 max-[400px]:text-[.8rem] max-[400px]:font-bold text-base min-[500px]:text-xl sm:text-3xl ">
              Weather App
            </h2>
            <MdWbSunny className="text-3xl mt-1 text-yellow-300" />
          </div>
          <section className="flex gap-2 items-center">
            <MdMyLocation
              title="Find me using GPS"
              onClick={handleGetGPSLocation}
              className="text-2xl text-blue-700 hover:opacity-70 cursor-pointer"
            />
            {!showSearchBox && (
              <button onClick={() => setShowSearchBox(true)} className="flex">
                <p className="text-slate-900/80 text-xs sm:text-sm">{location}</p>
                <MdOutlineLocationOn className="text-2xl text-gray-600" />
              </button>
            )}

            {/* Responsive - desktop */}
            {showSearchBox && (
              <div className="relative hidden md:flex">
                <SearchBox
                  ref={searchBoxRef}
                  value={city}
                  onSubmit={handleSubmitSeach}
                  onChange={(e) => handleChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <SuggestionBox
                  {...{
                    showSuggestions,
                    suggestions,
                    handleSuggestionClick,
                    error,
                    suggestionRefs,
                    handleSuggestionKeyDown,
                  }}
                />
              </div>
            )}
          </section>
        </div>
      </nav>

      {/* Responsive - mobile */}
      {showSearchBox && (
        <section className="flex max-w-7xl px-3 md:hidden">
          <div className="relative max-md:mx-auto">
            <SearchBox
              ref={searchBoxRef}
              value={city}
              onSubmit={handleSubmitSeach}
              onChange={(e) => handleChange(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <SuggestionBox
              {...{
                showSuggestions,
                suggestions,
                handleSuggestionClick,
                error,
                suggestionRefs,
                handleSuggestionKeyDown,
              }}
            />
          </div>
        </section>
      )}
    </>
  );
}

function SuggestionBox({
  showSuggestions,
  suggestions,
  handleSuggestionClick,
  error,
  suggestionRefs,
  handleSuggestionKeyDown,
}: {
  showSuggestions: boolean;
  suggestions: string[];
  handleSuggestionClick: (item: string) => void;
  error: string;
  suggestionRefs: React.MutableRefObject<(HTMLLIElement | null)[]>;
  handleSuggestionKeyDown: (e: React.KeyboardEvent<HTMLLIElement>, index: number) => void;
}) {
  return (
    <>
      {((showSuggestions && suggestions.length > 1) || error) && (
        <ul className="absolute z-10 flex flex-col py-2 px-2 gap-1 mb-4 bg-white border top-[44px] left-0 border-gray-300 rounded-md min-w-[200px]">
          {error && suggestions.length < 1 && <li className="text-red-500 p-1">{error}</li>}

          {suggestions.map((location, i) => (
            <li
              key={i}
              ref={(el) => {
                suggestionRefs.current[i] = el;
              }}
              tabIndex={0}
              onClick={() => handleSuggestionClick(location)}
              onKeyDown={(e) => handleSuggestionKeyDown(e, i)}
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
