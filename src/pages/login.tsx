import React, { useState, useEffect } from "react";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import ParticlesBackground from "../style/loginBackground";
import { authenticateUser } from "../utils/api";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [session, setSession] = useState(Cookies.get("session") || "");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorDesc, setPasswordErrorDesc] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (session !== "") {
      Cookies.set("session", session, { expires: 7 });
      goToChat();
    }
  }, [session]);

  const goToChat = () => {
    navigate("/chat", { state: { sessionID: session } });
  };

  const handleSignIn = async (
    type: "login" | "register",
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    const response = await authenticateUser(type, username, password);

    if (response.error) {
      setPasswordError(true);
      setPasswordErrorDesc(response.status || "An unknown error occurred");
    } else {
      setSession(response.data || "");
    }
  };

  return (
    <>
      <ParticlesBackground /> {/* moved background to a separate component */}
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Paper
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
            padding: 50,
            zIndex: 99,
          }}
        >
          <Typography variant="h4" fontWeight="bold" marginBottom={5}>
            Welcome to InfoGrep
          </Typography>
          <TextField
            label="Email"
            variant="filled"
            placeholder="Enter username here.."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            variant="filled"
            placeholder="Enter password here.."
            value={password}
            error={passwordError}
            helperText={passwordErrorDesc}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Box
            display="flex"
            gap={3}
            marginTop={5}
            justifyContent="space-around"
          >
            <Button
              variant="contained"
              color="primary"
              onClick={(e) => handleSignIn("login", e)}
            >
              Login
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={(e) => handleSignIn("register", e)}
            >
              Sign up
            </Button>
          </Box>
        </Paper>
      </Box>
    </>
  );
}

export default Login;
