/** 기획 명세서의 하늘 상태 값입니다. */
export type WeatherCondition =
  | "Clear"
  | "Clouds"
  | "Rain"
  | "Snow"
  | "Thunderstorm";

/** 대기질 등급입니다. */
export type AirQualityStatus = "Good" | "Moderate" | "Unhealthy";

/** 미세먼지와 초미세먼지 수치입니다. */
export interface AirQuality {
  status: AirQualityStatus;
  pm10: number;
  pm25: number;
}

/** 한 시간의 예보입니다. */
export interface HourlyForecast {
  time: string;
  temp: number;
  pop: number;
  condition: WeatherCondition;
}

/** 하루의 주간 예보입니다. */
export interface WeeklyForecast {
  day: string;
  tempMin: number;
  tempMax: number;
  condition: WeatherCondition;
}

/** 도시 검색에서 고를 수 있는 위치입니다. */
export interface PlaceSuggestion {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  label: string;
}

/** 날씨를 조회할 위치입니다. */
export interface WeatherPlace {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

/**
 * 화면에 표시할 날씨 데이터 계약입니다.
 * OpenWeather 응답은 이 형태로 정규화합니다.
 */
export interface WeatherData {
  city: string;
  country: string;
  temp: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  condition: WeatherCondition;
  humidity: number;
  windSpeed: number;
  /** 무료 현재 날씨 API에는 자외선이 없어 null일 수 있습니다. */
  uvIndex: number | null;
  aqi: AirQuality;
  hourly: HourlyForecast[];
  weekly: WeeklyForecast[];
  /** 관측 시각. 예: 2026-10-07T19:30 */
  observedAt: string;
}
