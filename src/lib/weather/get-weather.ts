import "server-only";

import { cacheLife } from "next/cache";
import { DEFAULT_PLACE, weatherConfig } from "@/lib/weather/config";
import { WEATHER_REQUEST_FAILED_MESSAGE, WeatherRequestError } from "@/lib/weather/errors";
import { normalizeWeather } from "@/lib/weather/normalize";
import { fetchOpenWeather } from "@/lib/weather/openweather-client";
import {
  airPollutionResponseSchema,
  currentWeatherSchema,
  forecastResponseSchema,
} from "@/lib/weather/schema";
import type { WeatherData, WeatherPlace } from "@/types/weather";

const buildWeatherUrl = (baseUrl: string, place: WeatherPlace) => {
  const url = new URL(baseUrl);
  url.searchParams.set("lat", String(place.latitude));
  url.searchParams.set("lon", String(place.longitude));
  url.searchParams.set("appid", weatherConfig.apiKey);
  url.searchParams.set("units", "metric");
  return url;
};

const loadWeather = async (place: WeatherPlace): Promise<WeatherData> => {
  const [currentJson, forecastJson, airJson] = await Promise.all([
    fetchOpenWeather(buildWeatherUrl(weatherConfig.currentUrl, place)),
    fetchOpenWeather(buildWeatherUrl(weatherConfig.forecastUrl, place)),
    fetchOpenWeather(buildWeatherUrl(weatherConfig.airPollutionUrl, place)),
  ]);

  const current = currentWeatherSchema.safeParse(currentJson);
  const forecast = forecastResponseSchema.safeParse(forecastJson);
  const airPollution = airPollutionResponseSchema.safeParse(airJson);

  if (!current.success || !forecast.success || !airPollution.success) {
    console.error("날씨 API 응답 형식이 예상과 다릅니다.", {
      current: current.success ? undefined : current.error.issues,
      forecast: forecast.success ? undefined : forecast.error.issues,
      airPollution: airPollution.success ? undefined : airPollution.error.issues,
    });
    throw new WeatherRequestError(WEATHER_REQUEST_FAILED_MESSAGE);
  }

  return normalizeWeather(place, current.data, forecast.data, airPollution.data);
};

/**
 * 좌표의 현재 날씨, 3시간 예보, 대기질을 OpenWeather에서 조회합니다.
 * 같은 좌표는 한 시간 동안 재사용합니다.
 */
export const getWeather = async (
  place: WeatherPlace = DEFAULT_PLACE,
): Promise<WeatherData> => {
  "use cache";
  cacheLife("hours");
  return loadWeather(place);
};
