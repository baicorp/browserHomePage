import {
  CurrentConditionsResponseType,
  Next12HoursForecastResponseType,
} from "../../type/weatherType";

export async function getCurrentForecastFromAccuforecast(keyLocation: string) {
  try {
    const res = await fetch(
      `https://dataservice.accuweather.com/currentconditions/v1/${keyLocation}?apikey=${process.env.ACCU_WEATHER_API_KEY}&details=true`
    );
    if (res.status !== 200) {
      throw new Error();
    }
    const weather = (await res.json())[0] as CurrentConditionsResponseType;

    const { date, time } = { ...convertEpochTime(weather.EpochTime) };
    return {
      date,
      time,
      weatherIcon: weather.WeatherIcon,
      weatherText: weather.WeatherText,
      temperature: Math.floor(weather.Temperature.Metric.Value),
      realFeelTemperature: weather.RealFeelTemperature.Metric.Value,
      relativeHumidity: weather.RelativeHumidity,
    };
  } catch (e) {
    console.error(e);
    return { error: e };
  }
}

export async function get12HoursForecastFromAccuforecast(keyLocation: string) {
  try {
    const res = await fetch(
      `https://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${keyLocation}?details=true&metric=true&apikey=${process.env.ACCU_WEATHER_API_KEY}`
    );
    if (res.status !== 200) {
      throw new Error();
    }
    const forecasts = (await res.json()) as Next12HoursForecastResponseType;

    return forecasts.map((forecast) => {
      const { date, time } = { ...convertEpochTime(forecast.EpochDateTime) };
      return {
        date,
        time,
        forecastIcon: forecast.WeatherIcon,
        forecastText: forecast.IconPhrase,
        temperature: forecast.Temperature.Value,
      };
    });
  } catch (e) {
    console.error(e);
    return { error: e };
  }
}

export function getForecastIcon(iconNumber: number) {
  let strIconNumber =
    iconNumber < 10 ? `0${iconNumber}` : iconNumber.toLocaleString();
  return `https://developer.accuweather.com/sites/default/files/${strIconNumber}-s.png`;
}

export function convertEpochTime(epochTime: number) {
  if (isNaN(epochTime)) return { date: "0", time: "0" };
  // convert to seconds by devide 1000
  const date = new Date(epochTime * 1000);
  const time = date.toLocaleTimeString();
  return {
    date: date.toLocaleDateString(),
    time: time.replace(/:\d{2}(?= [APM]+$)/, ""),
  };
}
