import React, { useState, useMemo } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { ThemeProvider, CssBaseline } from "@mui/material";

import "leaflet/dist/leaflet.css";
import App from './App.jsx'
import { getTheme } from "./theme";

const Root = () => {
  const [mode, setMode] = useState(
    localStorage.getItem("theme") || "light"
  );  

  const theme = useMemo(() => getTheme(mode), [mode]);

  const toggleTheme = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    console.log("Current theme:", mode);
    localStorage.setItem("theme", newMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <App toggleTheme={toggleTheme} mode={mode} />
      </BrowserRouter>
    </ThemeProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<Root />);

