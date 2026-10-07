import { WeatherSkeleton } from "@/components/weather/WeatherSkeleton";

/** 본문이 준비되기 전에 현재 날씨와 예보 자리를 보여줍니다. */
const Loading = () => {
  return <WeatherSkeleton />;
};

export default Loading;
