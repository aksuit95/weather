"use client";

import { useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { useQueryStates } from "nuqs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { placeParsers } from "@/lib/weather/place-params";
import { searchPlaces } from "@/lib/weather/search-places";
import type { PlaceSuggestion } from "@/types/weather";

/** 도시 검색과 선택 결과를 주소 쿼리에 저장합니다. */
export const LocationSearch = () => {
  const [selectedPlace, setSelectedPlace] = useQueryStates(placeParsers);
  const [query, setQuery] = useState("");
  const [places, setPlaces] = useState<PlaceSuggestion[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const resultButtons = useRef<Array<HTMLButtonElement | null>>([]);
  const hasCustomPlace = selectedPlace.city !== null;

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSearching(true);
    setPlaces([]);

    const result = await searchPlaces(query);
    setIsSearching(false);

    if (!result.ok) {
      setStatusMessage(result.message);
      return;
    }

    setPlaces(result.places);
    setStatusMessage(
      result.places.length === 0 ? "검색 결과가 없습니다." : null,
    );
  };

  const onSelect = async (place: PlaceSuggestion) => {
    await setSelectedPlace(
      {
        lat: place.latitude,
        lon: place.longitude,
        city: place.city,
        country: place.country,
      },
      { history: "replace", shallow: false },
    );
    setQuery("");
    setPlaces([]);
    setStatusMessage(null);
  };

  const onReset = async () => {
    await setSelectedPlace(
      { lat: null, lon: null, city: null, country: null },
      { history: "replace", shallow: false },
    );
    setQuery("");
    setPlaces([]);
    setStatusMessage(null);
  };

  const onResultKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    const nextIndex = event.key === "ArrowDown" ? index + 1 : index - 1;
    resultButtons.current[nextIndex]?.focus();
  };

  return (
    <div className="relative w-full">
      <form className="flex gap-2" onSubmit={onSubmit} aria-busy={isSearching}>
        <label className="sr-only" htmlFor="city-search">
          도시 검색
        </label>
        <Input
          id="city-search"
          value={query}
          placeholder="도시 이름"
          className="h-10 bg-white/80 dark:bg-slate-900/80"
          disabled={isSearching}
          aria-controls="city-search-results"
          aria-expanded={places.length > 0}
          onChange={(event) => setQuery(event.target.value)}
        />
        <Button type="submit" className="h-10 shrink-0" disabled={isSearching}>
          {isSearching ? "검색 중" : "검색"}
        </Button>
        {hasCustomPlace ? (
          <Button
            type="button"
            variant="outline"
            className="h-10 shrink-0 bg-white/80 dark:bg-slate-900/80"
            onClick={onReset}
          >
            서울
          </Button>
        ) : null}
      </form>
      <p className="sr-only" aria-live="polite">
        {isSearching ? "도시를 검색하는 중입니다." : statusMessage}
      </p>
      {statusMessage ? (
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">
          {statusMessage}
        </p>
      ) : null}
      {places.length > 0 ? (
        <ul
          id="city-search-results"
          className="absolute z-20 mt-2 max-h-64 w-full overflow-auto rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900"
        >
          {places.map((place, index) => (
            <li key={`${place.latitude}-${place.longitude}`}>
              <button
                ref={(element) => {
                  resultButtons.current[index] = element;
                }}
                type="button"
                className="w-full px-3 py-2 text-left text-sm hover:bg-sky-50 focus-visible:bg-sky-50 focus-visible:outline-none dark:hover:bg-slate-800 dark:focus-visible:bg-slate-800"
                onClick={() => onSelect(place)}
                onKeyDown={(event) => onResultKeyDown(event, index)}
              >
                {place.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};
