import React from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { useAppTheme } from '../theme';

interface AppThemeProviderProps {
  children: React.ReactNode;
}

export const AppThemeProvider: React.FC<AppThemeProviderProps> = ({ children }) => {
  const theme = useAppTheme();
  
  return (
    <MuiThemeProvider theme={theme}>
      {children}
    </MuiThemeProvider>
  );
};