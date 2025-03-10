import React, { createContext, useContext, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { KeyTheme } from "./utils/localSotrageKey";

const rootEl = document.getElementById("root");
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <Theme>
        <App />
      </Theme>
    </React.StrictMode>
  );
}

export type Theme = "auto" | "dark" | "light";

type ThemeContextType = {
  theme: Theme | undefined;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
};

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

function Theme({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("auto");

  useEffect(() => {
    const savedTheme = localStorage.getItem(KeyTheme);
    if (
      savedTheme !== "auto" &&
      savedTheme !== "light" &&
      savedTheme !== "dark"
    )
      return;

    const html: HTMLElement = document.documentElement;
    html.setAttribute("data-theme", savedTheme);

    setTheme(savedTheme);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return theme;
}
