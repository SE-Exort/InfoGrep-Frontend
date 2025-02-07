import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./pages/login";
import Chat from "./pages/chat";
import SettingsPage from "./pages/setting";
import { SettingsProvider } from "./context/SettingsContext";
import { StyledEngineProvider } from "@mui/material/styles";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root")!);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/chat",
    element: <Chat />,
  },
  {
    path: "/settings",
    element: <SettingsPage  />,
  },
]);

root.render(
  <StyledEngineProvider injectFirst>
    <SettingsProvider>
      <RouterProvider router={router} />
    </SettingsProvider>
  </StyledEngineProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
