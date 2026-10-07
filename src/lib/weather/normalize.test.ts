import { describe, expect, it } from "vitest";
import {
  WEATHER_REQUEST_FAILED_MESSAGE,
  WeatherRequestError,
  isWeatherRequestError,
} from "@/lib/weather/errors";
import {
  normalizeWeather,
  toAirQualityStatus,
  toWeatherCondition,
} from "@/lib/weather/normalize";
import { DEFAULT_PLACE } from "@/lib/weather/config";
import { resolvePlace } from "@/lib/weather/resolve-place";
import type {
  AirPollutionResponse,
  CurrentWeatherResponse,
  ForecastResponse,
} from "@/lib/weather/schema";
import type { WeatherPlace } from "@/types/weather";

const SEOUL_EVENING = Date.parse("2026-10-07T10:00:00Z") / 1000;

const place: WeatherPlace = {
  city: "서울",
  country: "대한민국",
  latitude: 37.5665,
  longitude: 126.978,
};

const current = {
  dt: SEOUL_EVENING,
  main: {
    temp: 17.14,
    feels_like: 16.16,
    temp_min: 16,
    temp_max: 18,
    humidity: 50.4,
  },
  weather: [{ main: "Clear" }],
  wind: { speed: 1.84 },
} satisfies CurrentWeatherResponse;

const forecastItem = (
  hoursLater: number,
  main: string,
  pop: number,
): ForecastResponse["list"][number] => ({
  dt: SEOUL_EVENING + hoursLater * 60 * 60,
  main: { temp: 18.26, temp_min: 17.2, temp_max: 19.8 },
  weather: [{ main }],
  pop,
});

const forecast = {
  list: [
    forecastItem(0, "Clear", 0.2),
    forecastItem(3, "Clouds", 0.4),
    forecastItem(6, "Rain", 0.8),
    forecastItem(24, "Snow", 0.1),
  ],
} satisfies ForecastResponse;

const airPollution = {
  list: [
    {
      main: { aqi: 4 },
      components: { pm10: 17.2, pm2_5: 11.6 },
    },
  ],
} satisfies AirPollutionResponse;

describe("날씨 값 변환", () => {
  it("OpenWeather 하늘 상태를 화면 값으로 바꿉니다", () => {
    expect(toWeatherCondition("Clear")).toBe("Clear");
    expect(toWeatherCondition("Drizzle")).toBe("Rain");
    expect(toWeatherCondition("Mist")).toBe("Clouds");
  });

  it("대기질 지수 1부터 5를 세 단계로 나눕니다", () => {
    expect(toAirQualityStatus(1)).toBe("Good");
    expect(toAirQualityStatus(3)).toBe("Moderate");
    expect(toAirQualityStatus(5)).toBe("Unhealthy");
  });

  it("예보를 한국 시간과 화면 숫자로 맞춥니다", () => {
    const weather = normalizeWeather(place, current, forecast, airPollution);

    expect(weather.temp).toBe(17.1);
    expect(weather.feelsLike).toBe(16.2);
    expect(weather.humidity).toBe(50);
    expect(weather.windSpeed).toBe(1.8);
    expect(weather.observedAt).toBe("2026-10-07T19:00");
    expect(weather.hourly[0]).toMatchObject({
      time: "19:00",
      pop: 20,
      condition: "Clear",
    });
    expect(weather.hourly[2]?.condition).toBe("Rain");
    expect(weather.aqi).toEqual({ status: "Unhealthy", pm10: 17, pm25: 12 });
    expect(weather.uvIndex).toBeNull();
    expect(weather.weekly.length).toBeGreaterThan(0);
  });
});

describe("오류 분기", () => {
  it("빈 예보는 사용자용 오류로 끝냅니다", () => {
    expect(() =>
      normalizeWeather(place, current, { list: [] }, airPollution),
    ).toThrow(WeatherRequestError);

    try {
      normalizeWeather(place, current, { list: [] }, airPollution);
    } catch (error) {
      expect(isWeatherRequestError(error)).toBe(true);
      if (isWeatherRequestError(error)) {
        expect(error.message).toBe(WEATHER_REQUEST_FAILED_MESSAGE);
      }
    }
  });

  it("다른 오류는 날씨 요청 실패로 보지 않습니다", () => {
    expect(isWeatherRequestError(new Error("other"))).toBe(false);
    expect(isWeatherRequestError("WeatherRequestError")).toBe(false);
  });

  it("주소의 위치가 잘못되면 서울을 사용합니다", () => {
    expect(
      resolvePlace({ lat: null, lon: null, city: null, country: null }),
    ).toEqual(DEFAULT_PLACE);
    expect(
      resolvePlace({
        lat: 95,
        lon: 10,
        city: "없는곳",
        country: "없음",
      }),
    ).toEqual(DEFAULT_PLACE);
    expect(
      resolvePlace({
        lat: 35.18,
        lon: 129.08,
        city: "부산광역시",
        country: "대한민국",
      }),
    ).toEqual({
      city: "부산광역시",
      country: "대한민국",
      latitude: 35.18,
      longitude: 129.08,
    });
  });
});
