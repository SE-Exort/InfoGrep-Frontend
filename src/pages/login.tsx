import React, { useEffect, useState } from "react";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import ParticlesBackground from "../style/loginBackground";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../redux/store";
import {
  authenticateUserThunk,
  clearAuthError,
  checkUserThunk,
  setSession,
} from "../redux/slices/authSlice";
import {
  selectSession,
  selectAuthError,
} from "../redux/selectors";
import { AUTH_API_BASE_URL } from "../utils/api";

function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Redux state
  const session = useSelector(selectSession);
  const [username, setUsername] = useState("");
  const authError = useSelector(selectAuthError);
  const [password, setPassword] = React.useState("");
  const [searchParams] = useSearchParams();
  const sessionToken = searchParams.get("token")
  useEffect(() => {
    if (session) {
      dispatch(checkUserThunk());
    }
  }, [dispatch, session]);

  const checkUserAndRedirect = async () => {
    // Then check if the user is admin
    const result = await dispatch(checkUserThunk()).unwrap();
    const isAdmin = result.is_admin;
    const renameFlag = result.changePasswordWarning;

    if (isAdmin) {
      navigate("/admin", {
        state: {
          sessionID: session,
          renameFlag: renameFlag,
        },
      });
    } else {
      navigate("/chat", { state: { sessionID: session } });
    }
  }

  useEffect(() => {
    if (sessionToken) {
      console.log('found sessoin token in URL, likely from oauth! ', sessionToken)
      dispatch(setSession(sessionToken));
      checkUserAndRedirect();
    }
  })

  // Handle Login/Register
  const handleSignIn = async (
    type: "login" | "register",
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    try {
      await dispatch(authenticateUserThunk({ type, username, password })).unwrap();
      await checkUserAndRedirect();
    } catch (error) {
      console.error("Authentication error:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      handleSignIn(
        "login",
        e as unknown as React.MouseEvent<HTMLButtonElement>
      );
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
            <Button
              variant="contained"
              color="secondary"
              onClick={(e) => window.location.href = AUTH_API_BASE_URL + '/oauth_login'}
            >
              OAuth SSO
            </Button>
          </Box>
        </Paper>
      </Box>
    </>
  );
}

export default Login;
