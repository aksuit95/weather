import { createLoader } from "nuqs/server";
import { DEFAULT_PLACE } from "@/lib/weather/config";
import { placeParsers } from "@/lib/weather/place-params";
import type { WeatherPlace } from "@/types/weather";

/** 페이지 주소의 위치 쿼리를 읽습니다. */
export const loadPlaceParams = createLoader(placeParsers);

const isValidCoordinate = (
  latitude: number,
  longitude: number,
) =>
  latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180;

/**
 * 주소에 위치가 없으면 서울을 사용합니다.
 * 좌표나 이름이 빠지면 기본 위치로 되돌립니다.
 */
export const resolvePlace = (params: {
  lat: number | null;
  lon: number | null;
  city: string | null;
  country: string | null;
}): WeatherPlace => {
  const city = params.city?.trim() ?? "";
  const country = params.country?.trim() ?? "";

  if (
    params.lat === null ||
    params.lon === null ||
    city === "" ||
    country === "" ||
    !isValidCoordinate(params.lat, params.lon)
  ) {
    return DEFAULT_PLACE;
  }

  return {
    city,
    country,
    latitude: params.lat,
    longitude: params.lon,
  };
};
