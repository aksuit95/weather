import { parseAsFloat, parseAsString } from "nuqs/server";

/** 선택한 위치를 주소에 남기는 쿼리 파서입니다. */
export const placeParsers = {
  lat: parseAsFloat,
  lon: parseAsFloat,
  city: parseAsString,
  country: parseAsString,
};
