import { Skeleton } from "@/components/ui/skeleton";

/** 현재 날씨와 예보가 도착하기 전의 자리 표시입니다. */
export const WeatherSkeleton = () => {
  return (
    <div className="flex flex-col gap-4" aria-busy="true" aria-live="polite">
      <span className="sr-only">날씨 정보를 불러오는 중입니다.</span>
      <Skeleton className="h-72 w-full rounded-xl bg-white/70 dark:bg-slate-800/70" />
      <Skeleton className="h-36 w-full rounded-xl bg-white/70 dark:bg-slate-800/70" />
      <Skeleton className="h-48 w-full rounded-xl bg-white/70 dark:bg-slate-800/70" />
    </div>
  );
};
