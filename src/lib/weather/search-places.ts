"use server";

import { z } from "zod";
import { weatherConfig } from "@/lib/weather/config";
import {
  WEATHER_REQUEST_FAILED_MESSAGE,
  WeatherRequestError,
  isWeatherRequestError,
} from "@/lib/weather/errors";
import { fetchOpenWeather } from "@/lib/weather/openweather-client";
import type { PlaceSuggestion } from "@/types/weather";

const querySchema = z.string().trim().min(1).max(80);

const geocodingSchema = z.array(
  z.object({
    name: z.string(),
    lat: z.number(),
    lon: z.number(),
    country: z.string(),
    state: z.string().optional(),
    local_names: z
      .object({
        ko: z.string().optional(),
      })
      .optional(),
  }),
);

export type PlaceSearchResult =
  | { ok: true; places: PlaceSuggestion[] }
  | { ok: false; message: string };

const regionNames = new Intl.DisplayNames(["ko"], { type: "region" });

const toCountryName = (countryCode: string) => {
  try {
    return regionNames.of(countryCode) ?? countryCode;
  } catch {
    return countryCode;
  }
};

const toSuggestion = (
  place: z.infer<typeof geocodingSchema>[number],
): PlaceSuggestion => {
  const city = place.local_names?.ko ?? place.name;
  const country = toCountryName(place.country);
  const label = [city, place.state, country].filter(Boolean).join(", ");

  return {
    city,
    country,
    latitude: place.lat,
    longitude: place.lon,
    label,
  };
};

/** 도시 이름으로 좌표를 찾고, 없으면 빈 목록을 반환합니다. */
export const searchPlaces = async (
  query: string,
): Promise<PlaceSearchResult> => {
  const parsedQuery = querySchema.safeParse(query);
  if (!parsedQuery.success) {
    return {
      ok: false,
      message: "도시 이름을 1자 이상 80자 이하로 입력해 주세요.",
    };
  }

  const url = new URL(weatherConfig.geocodingUrl);
  url.searchParams.set("q", parsedQuery.data);
  url.searchParams.set("limit", "5");
  url.searchParams.set("appid", weatherConfig.apiKey);

  try {
    const json = await fetchOpenWeather(url);
    const parsed = geocodingSchema.safeParse(json);
    if (!parsed.success) {
      console.error("도시 검색 응답 형식이 예상과 다릅니다.", {
        issues: parsed.error.issues,
      });
      return { ok: false, message: WEATHER_REQUEST_FAILED_MESSAGE };
    }

    return { ok: true, places: parsed.data.map(toSuggestion) };
  } catch (error) {
    if (isWeatherRequestError(error) || error instanceof WeatherRequestError) {
      return { ok: false, message: error.message };
    }
    console.error("도시 검색에 실패했습니다.", { error });
    return { ok: false, message: WEATHER_REQUEST_FAILED_MESSAGE };
  }
};
