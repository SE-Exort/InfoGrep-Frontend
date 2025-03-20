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
      main: "#156434",
      contrastText: 'black',
    },
    secondary: {
      main: "#cfedd9",
    },
    // Add custom colors for light mode
    customWhites: {
      main: '#f2f2f2',
      light: '#fafafa',
      dark: '#e2e2e2',
      contrastText: '#ffffff',
    },
    highlight: {
      main: '#b9f6ca',
      light: '#ccff90',
      dark: '#69f0ae',
    },
    background: {
      default: "#f2f2f2",
      highlight: "#b9f6ca",
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
      contrastText: "#fff",
    },
    secondary: {
      main: "#424f47",
    },
    // Add custom colors for dark mode
    customWhites: {
      main: '#121212',
      light: '#020202',
      dark: '#222222',
      contrastText: '#ffffff',
    },
    highlight: {
      main: '#00c853',
      light: '#69f0ae',
      dark: '#00e676',
    },
    background: {
      default: "#121212",
      highlight: "#004d40",
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