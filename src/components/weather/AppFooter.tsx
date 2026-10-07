/** 날씨 데이터 출처를 보여줍니다. */
export const AppFooter = () => {
  return (
    <footer className="border-t border-white/40 bg-white/60 backdrop-blur-md dark:border-white/10 dark:bg-slate-950/60">
      <div className="mx-auto w-full max-w-5xl px-4 py-4 pl-16 text-sm text-slate-600 sm:px-6 sm:pl-16 dark:text-slate-300">
        데이터 제공: OpenWeather
      </div>
    </footer>
  );
};
