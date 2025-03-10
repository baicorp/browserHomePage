interface Measurement {
  Value: number;
  Unit: string;
  UnitType: number;
}

interface MeasurementWithPhrase extends Measurement {
  Phrase?: string;
}

interface UnitSystem {
  Metric: Measurement;
  Imperial: Measurement;
}

interface UnitSystemWithPhrase {
  Metric: MeasurementWithPhrase;
  Imperial: MeasurementWithPhrase;
}

interface Direction {
  Degrees: number;
  Localized: string;
  English: string;
}

interface Wind {
  Speed: Measurement | Speed;
  Direction: Direction;
}

interface WindGust {
  Speed: Measurement | Speed;
}

interface Speed {
  Metric: Measurement;
  Imperial: Measurement;
}

interface TemperatureRange {
  Minimum: UnitSystem;
  Maximum: UnitSystem;
}

// Current conditions response
export type CurrentConditionsResponseType = {
  LocalObservationDateTime: string;
  EpochTime: number;
  WeatherText: string;
  WeatherIcon: number;
  HasPrecipitation: boolean;
  PrecipitationType: string;
  IsDayTime: boolean;
  Temperature: UnitSystem;
  RealFeelTemperature: UnitSystemWithPhrase;
  RealFeelTemperatureShade: UnitSystemWithPhrase;
  ApparentTemperature: UnitSystem;
  WindChillTemperature: UnitSystem;
  WetBulbTemperature: UnitSystem;
  WetBulbGlobeTemperature: UnitSystem;
  Past24HourTemperatureDeparture: UnitSystem;
  RelativeHumidity: number;
  IndoorRelativeHumidity: number;
  DewPoint: UnitSystem;
  Wind: Wind;
  WindGust: WindGust;
  UVIndex: number;
  UVIndexText: string;
  Visibility: UnitSystem;
  ObstructionsToVisibility: string;
  CloudCover: number;
  Ceiling: UnitSystem;
  Pressure: UnitSystem;
  PressureTendency: {
    LocalizedText: string;
  };
  Precip1hr: UnitSystem;
  PrecipitationSummary: {
    Precipitation: UnitSystem;
    Past3Hours: UnitSystem;
    Past6Hours: UnitSystem;
    Past9Hours: UnitSystem;
    Past12Hours: UnitSystem;
    Past18Hours: UnitSystem;
    Past24Hours: UnitSystem;
  };
  TemperatureSummary: {
    Past6HourRange: TemperatureRange;
    Past12HourRange: TemperatureRange;
    Past24HourRange: TemperatureRange;
  };
  MobileLink: string;
  Link: string;
};

// Forecast response
export type Next12HoursForecastResponseType = {
  DateTime: Date;
  EpochDateTime: number;
  WeatherIcon: number;
  IconPhrase: string;
  HasPrecipitation: boolean;
  IsDaylight: boolean;
  Temperature: Measurement;
  RealFeelTemperature: MeasurementWithPhrase;
  RealFeelTemperatureShade: MeasurementWithPhrase;
  WetBulbTemperature: Measurement;
  WetBulbGlobeTemperature: Measurement;
  DewPoint: Measurement;
  Wind: Wind;
  WindGust: WindGust;
  RelativeHumidity: number;
  IndoorRelativeHumidity: number;
  Visibility: Measurement;
  Ceiling: Measurement;
  UVIndex: number;
  UVIndexText: string;
  PrecipitationProbability: number;
  ThunderstormProbability: number;
  RainProbability: number;
  IceProbability: number;

  // Precipitation amounts
  TotalLiquid: Measurement;
  Rain: Measurement;
  Snow: Measurement;
  Ice: Measurement;

  CloudCover: number;
  Evapotranspiration: Measurement;
  SolarIrradiance: Measurement;
  AccuLumenBrightnessIndex: number;
  MobileLink: string;
  Link: string;
}[];
