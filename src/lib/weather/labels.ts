import type { WeatherCondition } from "@/types/weather";

/** 화면 계약의 하늘 상태를 한국어로 바꿉니다. */
export const CONDITION_LABEL: Record<WeatherCondition, string> = {
  Clear: "맑음",
  Clouds: "흐림",
  Rain: "비",
  Snow: "눈",
  Thunderstorm: "뇌우",
};

export const glassCardClassName =
  "border-white/40 bg-white/75 text-slate-900 shadow-xl ring-white/20 backdrop-blur-md dark:border-white/10 dark:bg-slate-900/75 dark:text-slate-50 dark:ring-white/10";
