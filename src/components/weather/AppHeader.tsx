import { Suspense } from "react";
import { CloudSun } from "lucide-react";
import { LocationSearch } from "@/components/weather/LocationSearch";
import { ThemeToggle } from "@/components/weather/ThemeToggle";

/** 서비스 이름과 도시 검색을 보여주는 상단 영역입니다. */
export const AppHeader = () => {
  return (
    <header className="sticky top-0 z-10 border-b border-white/40 bg-white/75 backdrop-blur-md dark:border-white/10 dark:bg-slate-950/75">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:px-6">
        <div className="flex items-center gap-3">
          <CloudSun className="size-8 shrink-0 text-sky-500" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <p className="text-lg font-semibold tracking-tight">Atmosphere</p>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              지역 기반 날씨
            </p>
          </div>
          <ThemeToggle />
        </div>
        <div className="sm:ml-auto sm:w-full sm:max-w-md">
          <Suspense
            fallback={
              <div className="h-10 rounded-lg bg-white/70" aria-hidden="true" />
            }
          >
            <LocationSearch />
          </Suspense>
        </div>
      </div>
    </header>
  );
};
