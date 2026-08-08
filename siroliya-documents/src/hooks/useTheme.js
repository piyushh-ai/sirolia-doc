import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getColors } from "../constants/colors";

const THEME_KEY = "app_theme_mode";

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(null); // null = not yet loaded from storage

  // ── Load saved theme on mount ──────────────────────────────────────────────
  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY)
      .then((saved) => {
        setMode(saved === "dark" ? "dark" : "light");
      })
      .catch(() => {
        setMode("light"); // fallback
      });
  }, []);

  // ── Toggle and persist ─────────────────────────────────────────────────────
  const toggleTheme = () => {
    setMode((prev) => {
      const next = prev === "light" ? "dark" : "light";
      AsyncStorage.setItem(THEME_KEY, next).catch(() => {}); // fire-and-forget
      return next;
    });
  };

  // Don't render children until theme is loaded from storage (prevents flash)
  if (mode === null) return null;

  const colors = getColors(mode);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
