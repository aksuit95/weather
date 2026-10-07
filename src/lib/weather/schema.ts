import { z } from "zod";

const weatherConditionSchema = z.object({
  main: z.string(),
});

/** OpenWeather 현재 날씨 응답에서 화면에 필요한 필드만 확인합니다. */
export const currentWeatherSchema = z.object({
  dt: z.number(),
  main: z.object({
    temp: z.number(),
    feels_like: z.number(),
    temp_min: z.number(),
    temp_max: z.number(),
    humidity: z.number(),
  }),
  weather: z.array(weatherConditionSchema).min(1),
  wind: z.object({
    speed: z.number(),
  }),
});

/** OpenWeather 5일 예보 응답입니다. 항목 간격은 3시간입니다. */
export const forecastResponseSchema = z.object({
  list: z
    .array(
      z.object({
        dt: z.number(),
        main: z.object({
          temp: z.number(),
          temp_min: z.number(),
          temp_max: z.number(),
        }),
        weather: z.array(weatherConditionSchema).min(1),
        pop: z.number(),
      }),
    )
    .min(1),
});

/** OpenWeather 대기질 응답입니다. aqi는 1부터 5까지입니다. */
export const airPollutionResponseSchema = z.object({
  list: z
    .array(
      z.object({
        main: z.object({
          aqi: z.number(),
        }),
        components: z.object({
          pm10: z.number(),
          pm2_5: z.number(),
        }),
      }),
    )
    .min(1),
});

export type CurrentWeatherResponse = z.infer<typeof currentWeatherSchema>;
export type ForecastResponse = z.infer<typeof forecastResponseSchema>;
export type AirPollutionResponse = z.infer<typeof airPollutionResponseSchema>;
