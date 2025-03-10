import { useEffect, useState } from "react";

export function useDebounce(locationValue: string, delay: number) {
  const [debouncedLocationValue, setDebouncedLocationValue] = useState("");

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setDebouncedLocationValue(locationValue);
    }, delay);

    return () => {
      clearTimeout(timeOut);
    };
  }, [locationValue, delay]);

  return debouncedLocationValue;
}
