import {
  getLocationByAccuWeatherResponseType,
  getLocationByIpAddressResponseType,
} from "../../type/locationType";

export async function getLocationByTextAccuforecast(text: string) {
  try {
    const res = await fetch(
      `https://dataservice.accuweather.com/locations/v1/search?q=${text}&apikey=${process.env.ACCU_WEATHER_API_KEY}`
    );
    if (res.status !== 200) {
      throw new Error();
    }
    const datas = (await res.json()) as getLocationByAccuWeatherResponseType[];

    return datas.map((data) => {
      return {
        key: data.Key,
        name: data.LocalizedName,
        administrativeArea: data.AdministrativeArea.LocalizedName,
        country: data.Country.LocalizedName,
        geoPosition: {
          latitude: data.GeoPosition.Latitude,
          longitude: data.GeoPosition.Longitude,
        },
      };
    });
  } catch (e) {
    console.error(e);
    return { error: e };
  }
}

export async function getLocationBasedOnIp() {
  try {
    const res = await fetch(
      `https://ipinfo.io?token=${process.env.IP_INFO_TOKEN}`
    );
    if (res.status !== 200) throw new Error(res.statusText);
    const data = (await res.json()) as getLocationByIpAddressResponseType;

    if (!data?.loc) {
      throw new Error("Location data is missing");
    }

    const city = data.city;
    const url = `https://dataservice.accuweather.com/locations/v1/search?q=${city}&apikey=${process.env.ACCU_WEATHER_API_KEY}`;
    const res2 = await fetch(url);

    if (res2.status !== 200) {
      throw new Error();
    }

    // get the first index[0] data return from array
    const locationData = (
      await res2.json()
    )[0] as getLocationByAccuWeatherResponseType;

    return {
      key: locationData.Key,
      name: locationData.LocalizedName,
      administrativeArea: locationData.AdministrativeArea.LocalizedName,
      country: locationData.Country.LocalizedName,
      geoPosition: {
        latitude: locationData.GeoPosition.Latitude,
        longitude: locationData.GeoPosition.Longitude,
      },
    };
  } catch (e) {
    return { error: e };
  }
}
