import { createTheme, ThemeOptions } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { selectDarkMode, selectFontSize } from './redux/selectors';

// Create theme factory functions that accept fontSize
export const createLightTheme = (fontSize: number) => createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: "#9feeba",
    },
    secondary: {
      main: "#cfedd9",
    },
    background: {
      default: "#f2f2f2",
    }
  },
  typography: {
    fontSize,
  },
});

export const createDarkTheme = (fontSize: number) => createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#518764",
    },
    secondary: {
      main: "#424f47",
    },
    background: {
      default: "#121212",
    }
  },
  typography: {
    fontSize,
  },
});

// Hook to get the current theme based on Redux state
export const useAppTheme = () => {
  const darkMode = useSelector(selectDarkMode);
  const fontSize = useSelector(selectFontSize);
  
  return darkMode ? createDarkTheme(fontSize) : createLightTheme(fontSize);
};