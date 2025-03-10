type Country = {
  LocalizedName: string;
  EnglishName: string;
};

type AdministrativeArea = {
  LocalizedName: string;
  EnglishName: string;
};

type GeoPosition = {
  Latitude: number;
  Longitude: number;
};

type SupplementalAdminArea = {
  Level: number;
  LocalizedName: string;
  EnglishName: string;
};

export type getLocationByAccuWeatherResponseType = {
  Key: string;
  LocalizedName: string;
  EnglishName: string;
  Country: Country;
  AdministrativeArea: AdministrativeArea;
  GeoPosition: GeoPosition;
  SupplementalAdminAreas: SupplementalAdminArea[];
};

export type getLocationByIpAddressResponseType = {
  ip: string;
  city: string;
  region: string;
  country: string;
  loc: string;
  org: string;
  timezone: string;
};
