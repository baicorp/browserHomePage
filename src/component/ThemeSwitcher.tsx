import { useTheme } from "..";
import ThemeAuto from "../assets/svg/ThemeAuto";
import ThemeDark from "../assets/svg/ThemeDark";
import ThemeLight from "../assets/svg/ThemeLight";
import { KeyTheme } from "../utils/localSotrageKey";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { key: "auto", icon: <ThemeAuto /> },
    { key: "dark", icon: <ThemeDark /> },
    { key: "light", icon: <ThemeLight /> },
  ] as const;

  const ThemeButtons = themes.map((themeBtn) => {
    return (
      <button
        key={themeBtn.key}
        onClick={() => {
          setTheme(themeBtn.key);
          localStorage.setItem(KeyTheme, themeBtn.key);
        }}
        className={`rounded-full ${
          theme === themeBtn.key && "bg-themed-highlight"
        }`}
        title={themeBtn.key}
      >
        {themeBtn.icon}
      </button>
    );
  });

  return (
    <div className="self-end w-fit p-0.5 card rounded-full flex items-center gap-0.5">
      {ThemeButtons}
    </div>
  );
}
