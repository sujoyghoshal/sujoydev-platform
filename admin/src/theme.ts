import { createTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';

const common = {
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
  },
  shape: { borderRadius: 10 },
};

export function buildTheme(mode: 'light' | 'dark'): Theme {
  return createTheme({
    ...common,
    palette:
      mode === 'light'
        ? {
            mode,
            primary: { main: '#4F46E5' },
            secondary: { main: '#0D9488' },
            background: { default: '#F1F5F9', paper: '#FFFFFF' },
          }
        : {
            mode,
            primary: { main: '#818CF8' },
            secondary: { main: '#2DD4BF' },
            background: { default: '#0B1120', paper: '#111827' },
          },
  });
}
