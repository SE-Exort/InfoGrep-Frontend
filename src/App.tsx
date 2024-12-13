import { BrowserRouter, Route, Routes } from "react-router-dom";
import Chat from "./pages/chat";
import Login from "./pages/login";
import { ThemeProvider } from "@mui/material";
import theme from "./theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="container">
        <BrowserRouter>
          <Routes>
            <Route path="/chat" element={<Chat />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
