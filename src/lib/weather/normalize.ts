import type {
  AirQualityStatus,
  WeatherCondition,
  WeatherData,
  WeatherPlace,
} from "@/types/weather";
import {
  WEATHER_REQUEST_FAILED_MESSAGE,
  WeatherRequestError,
} from "@/lib/weather/errors";
import type {
  AirPollutionResponse,
  CurrentWeatherResponse,
  ForecastResponse,
} from "@/lib/weather/schema";

const HOURLY_SLOT_LIMIT = 8;
const DAILY_LIMIT = 5;
const SEOUL_TIME_ZONE = "Asia/Seoul";

/** OpenWeather weather.main 값을 화면 계약의 하늘 상태로 바꿉니다. */
export const toWeatherCondition = (main: string): WeatherCondition => {
  if (main === "Clear") return "Clear";
  if (main === "Clouds") return "Clouds";
  if (main === "Rain" || main === "Drizzle") return "Rain";
  if (main === "Snow") return "Snow";
  if (main === "Thunderstorm") return "Thunderstorm";

  console.error("알 수 없는 날씨 상태입니다.", { main });
  return "Clouds";
};

/** OpenWeather 대기질 지수 1~5를 좋음, 보통, 나쁨으로 나눕니다. */
export const toAirQualityStatus = (aqi: number): AirQualityStatus => {
  if (aqi <= 1) return "Good";
  if (aqi <= 3) return "Moderate";
  return "Unhealthy";
};

const roundTo = (value: number, digits: number) => {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
};

const formatSeoulParts = (unixSeconds: number) => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: SEOUL_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(unixSeconds * 1000));

  const read = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return {
    date: `${read("year")}-${read("month")}-${read("day")}`,
    hour: read("hour"),
    minute: read("minute"),
  };
};

const formatHour = (unixSeconds: number) => {
  const { hour, minute } = formatSeoulParts(unixSeconds);
  return `${hour}:${minute}`;
};

const formatDay = (dateKey: string) => {
  const date = new Date(`${dateKey}T00:00:00+09:00`);
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: SEOUL_TIME_ZONE,
    month: "numeric",
    day: "numeric",
    weekday: "short",
  }).format(date);
};

const seoulHour = (unixSeconds: number) =>
  Number(formatSeoulParts(unixSeconds).hour);

/**
 * 현재 날씨, 3시간 예보, 대기질을 화면 데이터로 맞춥니다.
 * 무료 예보 구간은 3시간 간격 8칸과 최대 5일입니다. 자외선 지수는 이 응답에 없습니다.
 */
export const normalizeWeather = (
  place: WeatherPlace,
  current: CurrentWeatherResponse,
  forecast: ForecastResponse,
  airPollution: AirPollutionResponse,
): WeatherData => {
  const upcoming = forecast.list.filter(
    (item) => item.dt >= current.dt - 30 * 60,
  );
  const slots = (upcoming.length > 0 ? upcoming : forecast.list).slice(
    0,
    HOURLY_SLOT_LIMIT,
  );
  const currentSlot = slots[0];
  const air = airPollution.list[0];

  if (!currentSlot || !air) {
    console.error("예보 또는 대기질 항목이 비어 있습니다.");
    throw new WeatherRequestError(WEATHER_REQUEST_FAILED_MESSAGE);
  }

  const currentMain = current.weather[0]?.main;
  if (!currentMain) {
    console.error("현재 날씨 상태가 비어 있습니다.");
    throw new WeatherRequestError(WEATHER_REQUEST_FAILED_MESSAGE);
  }

  const byDate = new Map<string, ForecastResponse["list"]>();
  for (const item of forecast.list) {
    const dateKey = formatSeoulParts(item.dt).date;
    const items = byDate.get(dateKey) ?? [];
    items.push(item);
    byDate.set(dateKey, items);
  }

  const todayKey = formatSeoulParts(current.dt).date;
  const todayItems = byDate.get(todayKey);
  const todayMin = todayItems
    ? Math.min(...todayItems.map((item) => item.main.temp_min))
    : current.main.temp_min;
  const todayMax = todayItems
    ? Math.max(...todayItems.map((item) => item.main.temp_max))
    : current.main.temp_max;

  const weekly = [...byDate.entries()]
    .slice(0, DAILY_LIMIT)
    .map(([dateKey, items]) => {
      const midday = items.reduce((closest, item) => {
        const closestGap = Math.abs(seoulHour(closest.dt) - 12);
        const itemGap = Math.abs(seoulHour(item.dt) - 12);
        return itemGap < closestGap ? item : closest;
      });
      const middayMain = midday.weather[0]?.main ?? "Clouds";

      return {
        day: formatDay(dateKey),
        tempMin: roundTo(
          Math.min(...items.map((item) => item.main.temp_min)),
          1,
        ),
        tempMax: roundTo(
          Math.max(...items.map((item) => item.main.temp_max)),
          1,
        ),
        condition: toWeatherCondition(middayMain),
      };
    });

  const observed = formatSeoulParts(current.dt);

  return {
    city: place.city,
    country: place.country,
    temp: roundTo(current.main.temp, 1),
    feelsLike: roundTo(current.main.feels_like, 1),
    tempMin: roundTo(todayMin, 1),
    tempMax: roundTo(todayMax, 1),
    condition: toWeatherCondition(currentMain),
    humidity: Math.round(current.main.humidity),
    windSpeed: roundTo(current.wind.speed, 1),
    uvIndex: null,
    aqi: {
      status: toAirQualityStatus(air.main.aqi),
      pm10: Math.round(air.components.pm10),
      pm25: Math.round(air.components.pm2_5),
    },
    hourly: slots.map((item) => ({
      time: formatHour(item.dt),
      temp: roundTo(item.main.temp, 1),
      pop: Math.round(item.pop * 100),
      condition: toWeatherCondition(item.weather[0]?.main ?? "Clouds"),
    })),
    weekly,
    observedAt: `${observed.date}T${observed.hour}:${observed.minute}`,
  };
};
