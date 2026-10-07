import { WeatherSummary } from "@/components/weather/WeatherSummary";

/** 주소의 위치에 맞는 현재 날씨를 보여줍니다. */
const Page = ({ searchParams }: PageProps<"/">) => {
  return <WeatherSummary searchParams={searchParams} />;
};

export default Page;
