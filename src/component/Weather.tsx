import { useEffect, useRef, useState } from "react";
import { useDebounce } from "../utils/debounce";
import Close from "../assets/svg/Close";
import Location from "../assets/svg/Location";
import {
  get12HoursForecastFromAccuforecast,
  getCurrentForecastFromAccuforecast,
  getForecastIcon,
} from "../utils/api/weatherAPI";
import {
  getLocationBasedOnIp,
  getLocationByTextAccuforecast,
} from "../utils/api/ipLocationAPI";
import { KeyCurrentLocation } from "../utils/localSotrageKey";

type CurrentWeathertype = {
  time: string;
  date: string;
  weatherIcon: number;
  weatherText: string;
  temperature: number;
  realFeelTemperature: number;
  relativeHumidity: number;
};

type Next12Forecasttype = {
  date: string;
  time: string;
  forecastIcon: number;
  forecastText: string;
  temperature: number;
}[];

type Locationtype = {
  key: string;
  name: string;
  administrativeArea: string;
  country: string;
  geoPosition: {
    latitude: number;
    longitude: number;
  };
};

export default function Weather() {
  const [selectedLocation, setSelectedLocation] = useState<
    Locationtype | undefined
  >(undefined);
  const [currentWeather, setCurrentWeather] = useState<
    CurrentWeathertype | undefined
  >(undefined);
  const [next12Forecast, setNext12Forecast] = useState<
    Next12Forecasttype | undefined
  >(undefined);

  // first mount
  useEffect(() => {
    // check if localstorage have saved location before
    async function getInitialLocation() {
      const currentLocation = localStorage.getItem(KeyCurrentLocation);
      if (currentLocation !== null) {
        const savedCurrentLocation = JSON.parse(
          currentLocation
        ) as Locationtype;
        setSelectedLocation(savedCurrentLocation);
      } else {
        //if not get location based on user ip
        try {
          const dataLocByIp = await getLocationBasedOnIp();
          // if data not valid then skip
          if (
            typeof dataLocByIp === "object" &&
            dataLocByIp !== null &&
            "error" in dataLocByIp
          )
            return;
          localStorage.setItem(KeyCurrentLocation, JSON.stringify(dataLocByIp));
          setSelectedLocation(dataLocByIp);
        } catch (e) {
          console.error(e);
        }
      }
    }

    getInitialLocation();
  }, []);

  // run every location key is change
  useEffect(() => {
    async function fetchWeatherData(locationKey: string) {
      try {
        const [currentWeatherData, next12HourforecastData] = await Promise.all([
          getCurrentForecastFromAccuforecast(locationKey),
          get12HoursForecastFromAccuforecast(locationKey),
        ]);

        // Check if either request returned an error
        if ("error" in currentWeatherData) {
          throw currentWeatherData.error;
        }
        if (!Array.isArray(next12HourforecastData)) {
          throw next12HourforecastData.error;
        }

        // set the returned data
        setCurrentWeather(currentWeatherData);
        setNext12Forecast(next12HourforecastData);
      } catch (err) {
        console.error("Failed to fetch weather data:", err);
      }
    }

    selectedLocation?.key !== undefined &&
      fetchWeatherData(selectedLocation?.key);
  }, [selectedLocation?.key]);

  return (
    <div className="card rounded-xl p-3 flex flex-col justify-between w-full h-full">
      {/* top weather */}
      <div className="flex gap-1 items-center">
        {currentWeather === undefined ? (
          <SkeletonCurrentWeatherImage />
        ) : (
          <div className="w-16">
            <img
              src={getForecastIcon(currentWeather.weatherIcon)}
              className="w-16 object-center object-contain"
            />
          </div>
        )}
        <div className="flex flex-col">
          {selectedLocation === undefined ? (
            <div className="w-36 h-6 mb-1 bg-themed-bg animate-pulse rounded-sm"></div>
          ) : (
            <div className="flex items-center">
              <p className="font-semibold text-xs leading-0">
                {`${selectedLocation.name}, ${selectedLocation.administrativeArea}`}
              </p>
              <ChangeLocationBtn setSelectedLocation={setSelectedLocation} />
            </div>
          )}
          {currentWeather === undefined ? (
            <>
              <div className="w-24 h-4 bg-themed-bg animate-pulse rounded-sm mb-0.5"></div>
              <div className="w-16 h-4 bg-themed-bg animate-pulse rounded-sm"></div>
            </>
          ) : (
            <>
              <p className="text-themed-text-gray text-xs font-semibold">
                {currentWeather.weatherText}
              </p>
              <p className="text-xs font-bold">{currentWeather.time}</p>
            </>
          )}
        </div>
        {currentWeather === undefined ? (
          <div className="w-12 h-10 bg-themed-bg animate-pulse rounded-lg"></div>
        ) : (
          <p className="text-4xl font-extrabold font-mono ">
            {currentWeather.temperature}
            <sup className="text-base">°</sup>
          </p>
        )}
      </div>

      {/* hourly weather */}
      {next12Forecast === undefined ? (
        <div className="flex justify-between">
          <SkeletonLoaderHourlyWeatherItem counts={5} />
        </div>
      ) : (
        <div className="flex justify-between">
          {" "}
          {next12Forecast.map((forecast, index) => {
            // only print 5 forecast data instead of 12
            if (index > 4) return;
            return (
              <HourlyWeatherItem
                key={forecast.time}
                icon={getForecastIcon(forecast.forecastIcon)}
                temperature={Math.floor(forecast.temperature)}
                time={forecast.time}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function SkeletonCurrentWeatherImage() {
  return (
    <div className="w-16 aspect-square bg-themed-bg animate-pulse rounded-full"></div>
  );
}

function HourlyWeatherItem({
  icon,
  temperature,
  time,
}: {
  icon: string;
  temperature: number;
  time: string;
}) {
  return (
    <div className="grow-0 w-13 h-[81.3px] p-1 aspect-square rounded-lg flex flex-col items-center bg-themed-bg">
      <img
        src={icon}
        alt="weather"
        className="w-full object-center object-contain"
      />
      <p className="text-lg font-bold">
        {temperature}
        <sup className="text-sm">°</sup>
      </p>
      <time className="text-[10px]" dateTime={time}>
        {time}
      </time>
    </div>
  );
}

function SkeletonLoaderHourlyWeatherItem({ counts }: { counts: number }) {
  // create array from given number
  const arr = Array.from({ length: counts }, (value, index) => index);
  return arr.map((value) => (
    <div
      key={value}
      className="w-[55.25px] h-[81.3px] bg-themed-bg animate-pulse rounded-md"
    />
  ));
}

function ChangeLocationBtn({
  setSelectedLocation,
}: {
  setSelectedLocation: React.Dispatch<
    React.SetStateAction<Locationtype | undefined>
  >;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [inputLocation, setInputLocation] = useState("");
  const [locationResults, setLocationResults] = useState<Locationtype[]>([]);
  const divRef = useRef<HTMLDivElement>(null);
  const locationName: string = useDebounce(inputLocation, 350);

  function handleOpenCloseMenu() {
    setInputLocation("");
    setIsMenuOpen((prev) => !prev);
  }

  useEffect(() => {
    function closeOnClickOutside(e: MouseEvent) {
      // check if the mousedown happend inside the excluded area or not
      // if happened outside menu then fire the close menu
      if (
        divRef.current &&
        !divRef.current.contains(e.target as Node) &&
        divRef.current &&
        !divRef.current.contains(e.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", closeOnClickOutside);
    return () => {
      document.removeEventListener("mousedown", closeOnClickOutside);
    };
  }, []);

  useEffect(() => {
    async function getLocData(location: string) {
      if (!location) return;
      const locData = await getLocationByTextAccuforecast(location.trim());

      if (typeof locData === "object" && locData !== null && "error" in locData)
        return;

      setLocationResults(locData);
    }

    getLocData(locationName);
  }, [locationName]);

  return (
    <div className="relative p-0 m-0" ref={divRef}>
      <button onClick={handleOpenCloseMenu}>
        {isMenuOpen ? <Close /> : <Location />}
      </button>
      {isMenuOpen && (
        <div className={`flex flex-col gap-2 absolute z-10`}>
          <InputLocation
            inputLocation={inputLocation}
            setInputLocation={setInputLocation}
          />
          {locationResults.length !== 0 && (
            <LocationsList
              openCloseMenu={handleOpenCloseMenu}
              locationResults={locationResults}
              setSelectedLocation={setSelectedLocation}
            />
          )}
        </div>
      )}
    </div>
  );
}

function InputLocation({
  inputLocation,
  setInputLocation,
}: {
  inputLocation: string;
  setInputLocation: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <input
      className="input text-xs flex-1 outline-1 rounded-md px-4 p-2"
      type="text"
      name="location"
      id="location"
      placeholder="input city or country"
      value={inputLocation}
      onChange={(e) => {
        setInputLocation(e.currentTarget.value);
      }}
    />
  );
}

function LocationsList({
  locationResults,
  openCloseMenu,
  setSelectedLocation,
}: {
  locationResults: Locationtype[];
  openCloseMenu: () => void;
  setSelectedLocation: React.Dispatch<
    React.SetStateAction<Locationtype | undefined>
  >;
}) {
  return (
    <div className="max-h-40 overflow-y-auto card shadow-themed-card rounded-lg overflow-hidden flex flex-col">
      {locationResults.map((location, index) => {
        return (
          <button
            key={index}
            onClick={() => {
              localStorage.setItem(
                KeyCurrentLocation,
                JSON.stringify({ ...location })
              );
              setSelectedLocation({ ...location });
              openCloseMenu();
            }}
            className="themed-hover text-xs px-3 py-1 text-start"
          >
            <p>
              {location?.name}, {location?.administrativeArea}
            </p>
            <p className="text-themed-text-gray">{location.country}</p>
          </button>
        );
      })}
    </div>
  );
}
