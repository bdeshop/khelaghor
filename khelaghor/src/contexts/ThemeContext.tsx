import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { getThemeConfig, THEME_CONFIG, ThemeConfig } from "../constants/theme";

interface ThemeContextType {
  theme: ThemeConfig;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeConfig>(THEME_CONFIG);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getThemeConfig()
      .then((config) => {
        setTheme(config);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
