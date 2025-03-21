import { createTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { selectDarkMode, selectFontSize } from './redux/selectors';

declare module '@mui/material/styles' {
  interface Palette {
    customWhites: Palette['primary'];
    // Add more custom colors as needed
    highlight: {
      main: string;
      light?: string;
      dark?: string;
    };
  }
  interface PaletteOptions {
    customWhites?: PaletteOptions['primary'];
    // Add more custom colors as needed
    highlight?: {
      main: string;
      light?: string;
      dark?: string;
    };
  }
  
  // Extend background options
  interface TypeBackground {
    adminPanel?: string;
    sidePanel?: string;
    highlight?: string;
  }
}

// Create theme factory functions that accept fontSize
export const createLightTheme = (fontSize: number) => createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: "#383838FF",
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: "#DADADAFF",
      contrastText: '#000000',
    },
    background: {
      default: "#f2f2f2",
      highlight: "#DBDBDBFF",
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
      main: "#FFFFFF",
      contrastText: "#000000",
    },
    secondary: {
      main: "#5F5F5FFF",
      contrastText: "#FFFFFF",
    },
    highlight: {
      main: '#00c853',
      light: '#69f0ae',
      dark: '#00e676',
    },
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