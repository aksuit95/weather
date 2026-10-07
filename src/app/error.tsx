"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ErrorPageProps {
  error: Error & { digest?: string };
  retry: () => void;
}

/** 본문 렌더 오류를 잡고 다시 시도할 수 있게 합니다. */
const ErrorPage = ({ error, retry }: ErrorPageProps) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Card className="border-white/40 bg-white/75 text-slate-900 shadow-xl backdrop-blur-md dark:border-white/10 dark:bg-slate-900/75 dark:text-slate-50">
      <CardHeader>
        <CardTitle className="text-xl">
          <h1>화면을 불러오지 못했습니다</h1>
        </CardTitle>
        <CardDescription className="text-base text-slate-600 dark:text-slate-300">
          잠시 후 다시 시도해 주세요.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button type="button" onClick={() => retry()}>
          다시 시도
        </Button>
      </CardContent>
    </Card>
  );
};

export default ErrorPage;
