"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

/** 같은 위치의 날씨를 서버에서 다시 요청합니다. */
export const RefreshButton = () => {
  const router = useRouter();

  return (
    <Button type="button" onClick={() => router.refresh()}>
      다시 시도
    </Button>
  );
};
