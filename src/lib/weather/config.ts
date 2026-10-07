import { z } from "zod";
import type { WeatherPlace } from "@/types/weather";

const apiKeySchema = z.string().trim().min(1);

const parsedApiKey = apiKeySchema.safeParse(process.env.OPENWEATHER_API_KEY);

if (!parsedApiKey.success) {
  throw new Error(
    "OPENWEATHER_API_KEY가 없습니다. .env.local에 키를 넣고 개발 서버를 다시 시작하세요.",
  );
}

/** OpenWeather 조회에 쓰는 서버 설정입니다. 키는 이 모듈 밖으로 로그하지 않습니다. */
export const weatherConfig = {
  apiKey: parsedApiKey.data.replace(/^["']|["']$/g, ""),
  currentUrl: "https://api.openweathermap.org/data/2.5/weather",
  forecastUrl: "https://api.openweathermap.org/data/2.5/forecast",
  airPollutionUrl: "https://api.openweathermap.org/data/2.5/air_pollution",
  geocodingUrl: "https://api.openweathermap.org/geo/1.0/direct",
};

/** 지역을 고르기 전까지 조회하는 기본 위치입니다. */
export const DEFAULT_PLACE: WeatherPlace = {
  city: "서울",
  country: "대한민국",
  latitude: 37.5665,
  longitude: 126.978,
};
