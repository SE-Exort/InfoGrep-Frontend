import React, { useEffect } from "react";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import ParticlesBackground from "../style/loginBackground";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import {
  authenticateUserThunk,
  setUsername,
  clearAuthError,
} from "../redux/slices/authSlice";

function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Redux state
  const session = useSelector((state: RootState) => state.auth.session);
  const username = useSelector((state: RootState) => state.auth.username);
  const authError = useSelector((state: RootState) => state.auth.authError);
  const [password, setPassword] = React.useState("");

  // Redirect if session exists
  useEffect(() => {
    if (session) {
      Cookies.set("session", session, { expires: 7 });
      navigate("/chat", { state: { sessionID: session } });
    }
  }, [session, navigate]);

  // Handle Login/Register
  const handleSignIn = async (
    type: "login" | "register",
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    dispatch(authenticateUserThunk({ type, username, password })); // Dispatch async thunk for authentication
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
            onChange={(e) => dispatch(setUsername(e.target.value))}
          />
          <TextField
            label="Password"
            type="password"
            variant="filled"
            placeholder="Enter password here.."
            value={password}
            error={!!authError}
            helperText={authError || ""}
            onChange={(e) => {
              setPassword(e.target.value);
              dispatch(clearAuthError()); // Clear error when typing
            }}
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
