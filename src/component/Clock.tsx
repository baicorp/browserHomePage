import { useEffect, useState } from "react";

export default function Clock() {
  const [time, setTime] = useState<string>(new Date().toLocaleTimeString());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  return (
    <div>
      <p className="font-mono text-3xl font-extrabold">{time}</p>
      <p className="font-semibold text-xs text-themed-text-gray">
        {new Date().toDateString()}
      </p>
    </div>
  );
}
