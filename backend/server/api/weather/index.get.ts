import { WeatherInfo } from "~/models/weather-response";
export default defineCachedEventHandler(
  async (event) => {
    const apiKey = useRuntimeConfig(event).weatherApiKey;
    const url = new URL("/v1/current.json", "https://api.weatherapi.com");
    url.searchParams.set("key", apiKey);
    const ip = getRequestIP(event, { xForwardedFor: true });
    if (import.meta.dev) {
      const { origin } = await $fetch<{ origin: string }>(
        "http://httpbin.org/ip"
      );
      url.searchParams.set("q", origin);
    } else {
      url.searchParams.set("q", ip);
    }
    const response = await $fetch<WeatherInfo>(url.toString());
    return response;
  },
  { maxAge: 60 * 60 }
);
