import { CONDITION_LABEL, glassCardClassName } from "@/lib/weather/labels";
import type { HourlyForecast, WeeklyForecast } from "@/types/weather";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface WeatherForecastProps {
  hourly: HourlyForecast[];
  weekly: WeeklyForecast[];
}

/** 한국 시간 기준의 3시간 예보와 이후 날짜별 예보입니다. */
export const WeatherForecast = ({ hourly, weekly }: WeatherForecastProps) => {
  return (
    <div className="flex flex-col gap-4">
      <Card className={glassCardClassName}>
        <CardHeader>
          <CardTitle className="text-xl">
            <h2>시간별 예보</h2>
          </CardTitle>
          <CardDescription className="text-base text-slate-600 dark:text-slate-300">
            한국 시간, 3시간 간격
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="flex gap-3 overflow-x-auto pb-1">
            {hourly.map((item) => (
              <li
                key={item.time}
                className="min-w-28 rounded-xl bg-white/60 px-3 py-3 dark:bg-slate-800/70"
              >
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  <time dateTime={item.time}>{item.time}</time>
                </p>
                <p className="mt-2 text-lg font-semibold">{item.temp}°</p>
                <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">
                  {CONDITION_LABEL[item.condition]}
                </p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  강수 {item.pop}%
                </p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card className={glassCardClassName}>
        <CardHeader>
          <CardTitle className="text-xl">
            <h2>주간 예보</h2>
          </CardTitle>
          <CardDescription className="text-base text-slate-600 dark:text-slate-300">
            이후 {weekly.length}일, 한국 시간
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col gap-2">
            {weekly.map((day) => (
              <li
                key={day.day}
                className="grid grid-cols-1 gap-1 rounded-xl bg-white/60 px-4 py-3 sm:grid-cols-3 sm:items-center dark:bg-slate-800/70"
              >
                <p className="font-medium">{day.day}</p>
                <p className="text-slate-700 dark:text-slate-200">
                  {CONDITION_LABEL[day.condition]}
                </p>
                <p className="sm:text-right">
                  {day.tempMin}° / {day.tempMax}°
                </p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
