"use client";

import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#FAE0D8", // Rose Lips
      light: "#FFF5F2",
      dark: "#E6C0B5",
      contrastText: "#000000",
    },
    secondary: {
      main: "#FADCDC", // Cosmos
      light: "#FFF5F5",
      dark: "#E6C0C0",
      contrastText: "#000000",
    },
    background: {
      default: "#FFF5F5", // Light blend
      paper: "#FFFFFF",
    },
    text: {
      primary: "#000000",
      secondary: "#000000",
    },
  },
  typography: {
    fontFamily: '"Sarabun", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
      background: "linear-gradient(45deg, #FAE0D8 30%, #FADCDC 90%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      color: "#000000", // Fallback
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 600,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.7,
    },
  },
  shape: {
    borderRadius: 16,
  },
  shadows: ["none", "0px 2px 4px rgba(250, 224, 216, 0.2)", "0px 4px 8px rgba(250, 224, 216, 0.25)", "0px 8px 16px rgba(250, 224, 216, 0.3)", "0px 12px 24px rgba(250, 224, 216, 0.35)", "0px 16px 32px rgba(250, 224, 216, 0.4)", "0px 20px 40px rgba(250, 224, 216, 0.45)", "0px 24px 48px rgba(250, 224, 216, 0.5)", "0px 2px 4px rgba(250, 220, 220, 0.2)", "0px 4px 8px rgba(250, 220, 220, 0.25)", "0px 8px 16px rgba(250, 220, 220, 0.3)", "0px 12px 24px rgba(250, 220, 220, 0.35)", "0px 16px 32px rgba(250, 220, 220, 0.4)", "0px 20px 40px rgba(250, 220, 220, 0.45)", "0px 24px 48px rgba(250, 220, 220, 0.5)", "0px 2px 4px rgba(0, 0, 0, 0.1)", "0px 4px 8px rgba(0, 0, 0, 0.15)", "0px 8px 16px rgba(0, 0, 0, 0.2)", "0px 12px 24px rgba(0, 0, 0, 0.25)", "0px 16px 32px rgba(0, 0, 0, 0.3)", "0px 20px 40px rgba(0, 0, 0, 0.35)", "0px 24px 48px rgba(0, 0, 0, 0.4)", "0px 28px 56px rgba(0, 0, 0, 0.45)", "0px 32px 64px rgba(0, 0, 0, 0.5)", "0px 36px 72px rgba(0, 0, 0, 0.55)"],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: "none",
          padding: "10px 24px",
          fontSize: "1rem",
          fontWeight: 500,
          color: "#000000", // Enforce black text for all buttons
        },
        text: {
          color: "#000000",
        },
        outlined: {
          color: "#000000",
          borderColor: "#000000",
        },
        contained: {
          boxShadow: "0px 4px 12px rgba(250, 224, 216, 0.5)",
          "&:hover": {
            boxShadow: "0px 8px 20px rgba(250, 224, 216, 0.6)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.08)",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0px 8px 30px rgba(0, 0, 0, 0.12)",
            transform: "translateY(-4px)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 12,
          },
        },
      },
    },
  },
});
