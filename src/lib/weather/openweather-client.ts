import "server-only";

import {
  WEATHER_AUTH_FAILED_MESSAGE,
  WEATHER_REQUEST_FAILED_MESSAGE,
  WeatherRequestError,
} from "@/lib/weather/errors";

const REQUEST_TIMEOUT_MS = 8000;

/** OpenWeather를 호출합니다. 주소의 키는 로그에 남기지 않습니다. */
export const fetchOpenWeather = async (url: URL): Promise<unknown> => {
  const safeUrl = url.origin + url.pathname;

  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (response.status === 401 || response.status === 403) {
      console.error("OpenWeather 인증에 실패했습니다.", {
        url: safeUrl,
        status: response.status,
      });
      throw new WeatherRequestError(WEATHER_AUTH_FAILED_MESSAGE);
    }

    if (!response.ok) {
      console.error("날씨 API가 오류 상태를 반환했습니다.", {
        url: safeUrl,
        status: response.status,
      });
      throw new WeatherRequestError(WEATHER_REQUEST_FAILED_MESSAGE);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof WeatherRequestError) throw error;

    console.error("날씨 API 요청이 실패했습니다.", {
      url: safeUrl,
      error,
    });
    throw new WeatherRequestError(WEATHER_REQUEST_FAILED_MESSAGE);
  }
};
