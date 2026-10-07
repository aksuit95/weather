/** 사용자에게 그대로 보여도 되는 날씨 조회 실패입니다. */
export class WeatherRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WeatherRequestError";
  }
}

/** 캐시 경계를 지나도 구분할 수 있게 오류 이름으로 확인합니다. */
export const isWeatherRequestError = (
  error: unknown,
): error is WeatherRequestError =>
  error instanceof Error && error.name === "WeatherRequestError";

export const WEATHER_REQUEST_FAILED_MESSAGE =
  "날씨 정보를 가져오지 못했습니다. 잠시 후 다시 시도해 주세요.";

export const WEATHER_AUTH_FAILED_MESSAGE =
  "OpenWeather 인증에 실패했습니다. .env.local의 키를 확인해 주세요.";
