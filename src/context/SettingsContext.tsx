// src/contexts/SettingsContext.tsx
import React, { createContext, useState, ReactNode } from "react";

interface SettingsContextProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  fontSize: number;
  setFontSize: React.Dispatch<React.SetStateAction<number>>;
}

export const SettingsContext = createContext<SettingsContextProps>({
  darkMode: false,
  setDarkMode: () => {},
  fontSize: 14, // default font size
  setFontSize: () => {},
});

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState(14);

  return (
    <SettingsContext.Provider value={{ darkMode, setDarkMode, fontSize, setFontSize }}>
      {children}
    </SettingsContext.Provider>
  );
};
