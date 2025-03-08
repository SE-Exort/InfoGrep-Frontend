import React, { useCallback, useEffect, useState } from "react";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import ParticlesBackground from "../style/loginBackground";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../redux/store";
import {
  authenticateUserThunk,
  setUsername,
  clearAuthError,
  checkUserThunk,
} from "../redux/slices/authSlice";
import {
  selectSession,
  selectUsername,
  selectAuthError,
  selectIsAdmin,
} from "../redux/selectors";

function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Redux state
  const session = useSelector(selectSession);
  const [username, setUsername] = useState('');
  const authError = useSelector(selectAuthError);
  const [password, setPassword] = React.useState("");
  const isAdmin = useSelector(selectIsAdmin);

  const goToAdmin = useCallback(() => {

  }, [navigate, password, session, username]);

  // Redirect if session exists
  useEffect(() => {
    if (session) {
      Cookies.set("session", session, { expires: 7 });
      if (isAdmin) {
        navigate('/admin', { state: { sessionID: session, renameFlag: username === 'admin' || password === 'admin' } }); // Use the path you defined in your Routes
      } else {
        navigate("/chat", { state: { sessionID: session } });
      }
    }
  }, [session, isAdmin, navigate]);

  // Handle Login/Register
  const handleSignIn = async (
    type: "login" | "register",
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    dispatch(authenticateUserThunk({ type, username, password })); // Dispatch async thunk for authentication
    dispatch(checkUserThunk());
    if (isAdmin) {
      console.log(isAdmin)
      goToAdmin();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      handleSignIn("login", e as unknown as React.MouseEvent<HTMLButtonElement>);
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
            onKeyDown={handleKeyDown}
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
            onKeyDown={handleKeyDown}
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
            {/* <Button
              variant="contained"
              color="secondary"
              onClick={(e) => handleSignIn("register", e)}
            >
              Sign up
            </Button> */}
          </Box>
        </Paper>
      </Box>
    </>
  );
}

export default Login;
