import React, { createContext, useContext, useState } from "react";
import { getColors } from "../constants/colors";

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState("light"); // 'light' | 'dark'

  const toggleTheme = () => setMode((prev) => (prev === "light" ? "dark" : "light"));

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
