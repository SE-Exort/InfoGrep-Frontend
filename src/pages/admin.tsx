import React, { useState, useEffect } from "react";
import {
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import SettingsBar from "../components/settingsBar";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import Cookies from 'js-cookie';
import AdminControlPanel from "../components/adminControlPanel";
import * as endpoints from '../utils/api';

const theme = createTheme({
  palette: {
    primary: {
      main: "#9feeba",
    },
    secondary: {
      main: "#cfedd9",
    },
    // Add more colors as needed
  },
});

interface BackendFile {
  File_UUID: string;
  File_Name: string;
}

function Admin() {
  const navigate = useNavigate();
  let location = useLocation();
  const [session, setSession] = useState<string>(Cookies.get('session') || '');
  const [uuid, setUUID] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);

  
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // This will switch to the main content after 2 seconds
    }, 1000);
    return () => clearTimeout(timer); // Cleanup the timer
  }, []); // Empty dependency array means this effect runs once on mount

  useEffect(() => {
    if(location.state){
      if (location.state.renameFlag) {
        console.log("Show toast");
        setShowToast(true); // Show toast if flag is true
      }
      if(session === '') {
        if(location.state.sessionID){
          setSession(location.state.sessionID);
        } else {
          navigate('/')
        };
      }
    }
    if(session === '') {
      if(location.state && location.state.sessionID){
        setSession(location.state.sessionID);
        if (location.state.renameFlag) {
          console.log("Show toast");
          setShowToast(true); // Show toast if flag is true
        }
      } else {
        navigate('/')
      };
    }
  }, [location]);

  useEffect(() => {
    // Set the session cookie whenever the session state changes
    if (session) {
    }
    if (session) {
      Cookies.set('session', session, { expires: 7 }); // Cookie expires in 7 days
      console.log("ChatSession:", session);
      getUUID();
    }
  }, [session]);

  const getUUID = async () => {
    try {
      const sessionToken = session;
      const response = await fetch(`${endpoints.AUTH_API_BASE_URL}/check`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionToken }),
      });
      if (!response.ok) {
        throw new Error("Request failed");
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.status);
      }
      setUUID(data);
      setAdmin(data.is_admin);
      console.log("UUID:", data);
    } catch (error) {
      console.error("UUID error:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Display loading screen
  }

  if (!admin) {
    // 503 forribben
    return <div>503 Forbidden halt!</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <Box display="flex" justifyContent="flex-start" alignItems="top" height="100vh">
        <Box
          display="flex"
          flexDirection="column"
          gap={2}
          bgcolor={"grey.200"}
          height="100vh"
        >
          <SettingsBar />
        </Box>
        <AdminControlPanel session={session} uuid={uuid}/>

        
      </Box>
      <Snackbar
        open={showToast}
        onClose={() => setShowToast(false)}
      >
        <Alert onClose={() => setShowToast(false)} severity="warning" sx={{ width: '100%' }}>
          Please change admin username and password to something secure!
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default Admin;
