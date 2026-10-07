import type { Metadata } from "next";
import { Geist_Mono, Noto_Sans_KR } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { AppFooter } from "@/components/weather/AppFooter";
import { AppHeader } from "@/components/weather/AppHeader";
import { ThemeProvider } from "@/components/weather/ThemeProvider";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Atmosphere",
  description: "지역 기반 실시간 날씨와 생활 기상 정보를 확인하는 웹 서비스",
};

/** 한국어 문서 구조와 날씨 앱의 공통 틀을 제공합니다. */
const Layout = ({ children }: LayoutProps<"/">) => {
  return (
    <html
      lang="ko"
      className={`${notoSansKr.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-svh">
        <ThemeProvider>
          <NuqsAdapter>
            <div className="flex min-h-svh flex-col bg-gradient-to-b from-sky-100 via-white to-indigo-50 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 dark:text-slate-50">
              <AppHeader />
              <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-8 sm:px-6">
                {children}
              </main>
              <AppFooter />
            </div>
          </NuqsAdapter>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default Layout;
