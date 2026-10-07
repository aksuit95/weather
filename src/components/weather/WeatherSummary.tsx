import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RefreshButton } from "@/components/weather/RefreshButton";
import { WeatherForecast } from "@/components/weather/WeatherForecast";
import { WeatherSkeleton } from "@/components/weather/WeatherSkeleton";
import { isWeatherRequestError } from "@/lib/weather/errors";
import { getWeather } from "@/lib/weather/get-weather";
import { CONDITION_LABEL, glassCardClassName } from "@/lib/weather/labels";
import { loadPlaceParams, resolvePlace } from "@/lib/weather/resolve-place";
import type { AirQualityStatus, WeatherData } from "@/types/weather";

const AIR_QUALITY_LABEL: Record<AirQualityStatus, string> = {
  Good: "좋음",
  Moderate: "보통",
  Unhealthy: "나쁨",
};

const formatObservedAt = (isoDateTime: string) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(isoDateTime);
  if (!match) return isoDateTime;

  const [, year, month, day, hour, minute] = match;
  return `${year}년 ${Number(month)}월 ${Number(day)}일 ${hour}:${minute}`;
};

const SummaryCard = ({ weather }: { weather: WeatherData }) => {
  const metrics = [
    { label: "체감", value: `${weather.feelsLike}°` },
    { label: "습도", value: `${weather.humidity}%` },
    { label: "바람", value: `${weather.windSpeed}m/s` },
    { label: "강수확률", value: `${weather.hourly[0]?.pop ?? 0}%` },
    { label: "최저/최고", value: `${weather.tempMin}° / ${weather.tempMax}°` },
    {
      label: "자외선",
      value: weather.uvIndex === null ? "정보 없음" : String(weather.uvIndex),
    },
    {
      label: "대기질",
      value: `${AIR_QUALITY_LABEL[weather.aqi.status]} · PM10 ${weather.aqi.pm10} · PM2.5 ${weather.aqi.pm25}`,
      wide: true,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <Card className={glassCardClassName}>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            <h1>
              {weather.city}, {weather.country}
            </h1>
          </CardTitle>
          <CardDescription className="text-base text-slate-600 dark:text-slate-300">
            현재 날씨 · 기준 시각 {formatObservedAt(weather.observedAt)}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div>
            <p className="text-5xl font-semibold tracking-tight">
              {weather.temp}°
            </p>
            <p className="mt-2 text-lg text-slate-700 dark:text-slate-200">
              {CONDITION_LABEL[weather.condition]}
            </p>
          </div>
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className={`rounded-xl bg-white/60 px-4 py-3 dark:bg-slate-800/70 ${
                  metric.wide ? "sm:col-span-2" : ""
                }`}
              >
                <dt className="text-sm text-slate-600 dark:text-slate-300">
                  {metric.label}
                </dt>
                <dd className="mt-1 text-base font-medium">{metric.value}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>
      <WeatherForecast hourly={weather.hourly} weekly={weather.weekly} />
    </div>
  );
};

const WeatherErrorNotice = ({ message }: { message: string }) => {
  return (
    <Card className={glassCardClassName} role="alert">
      <CardHeader>
        <CardTitle className="text-xl">
          <h1>날씨를 불러오지 못했습니다</h1>
        </CardTitle>
        <CardDescription className="text-base text-slate-600 dark:text-slate-300">
          {message}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RefreshButton />
      </CardContent>
    </Card>
  );
};

const loadWeatherSummary = async (
  searchParams: PageProps<"/">["searchParams"],
) => {
  try {
    const place = resolvePlace(await loadPlaceParams(searchParams));
    const weather = await getWeather(place);
    return { ok: true as const, weather };
  } catch (error) {
    if (isWeatherRequestError(error)) {
      return { ok: false as const, message: error.message };
    }
    throw error;
  }
};

/** 주소에 담긴 위치의 현재 날씨와 예보를 서버에서 읽어 보여줍니다. */
const WeatherSummaryContent = async ({
  searchParams,
}: {
  searchParams: PageProps<"/">["searchParams"];
}) => {
  const result = await loadWeatherSummary(searchParams);
  if (!result.ok) return <WeatherErrorNotice message={result.message} />;
  return <SummaryCard weather={result.weather} />;
};

/** 위치 쿼리를 읽기 전까지 현재 날씨와 예보 자리에 스켈레톤을 둡니다. */
export const WeatherSummary = ({
  searchParams,
}: {
  searchParams: PageProps<"/">["searchParams"];
}) => {
  return (
    <Suspense fallback={<WeatherSkeleton />}>
      <WeatherSummaryContent searchParams={searchParams} />
    </Suspense>
  );
};
