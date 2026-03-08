/**
 * ============================================
 * REACT THEME CONTEXT
 * ============================================
 * Wraps the production-grade ThemeManager
 * Provides theme state and toggle to all components
 *
 * Usage:
 * const { theme, toggleTheme } = useTheme();
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import { themeManager, type Theme } from "../utils/themeManager";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * ThemeProvider: Wraps app with theme context
 * Must be at the top level of your app
 *
 * Usage:
 * ```
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 * ```
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Initialize with current theme from manager
  const [theme, setThemeState] = useState<Theme>(() => themeManager.getTheme());

  // Subscribe to theme changes from manager
  useEffect(() => {
    const unsubscribe = themeManager.onChange((newTheme) => {
      setThemeState(newTheme);
    });

    return unsubscribe;
  }, []);

  const toggleTheme = (): void => {
    themeManager.toggle();
  };

  const setTheme = (newTheme: Theme): void => {
    themeManager.setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * useTheme Hook: Access theme state
 * Must be used within ThemeProvider
 *
 * Usage:
 * ```
 * const { theme, toggleTheme } = useTheme();
 * ```
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};

export type { Theme };
