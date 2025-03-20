import { useState, useEffect } from "react";
import {
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import SettingsBar from "../components/settingsBar";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import AdminControlPanel from "../components/adminControlPanel";

import { selectIsAdmin, selectSession } from "../redux/selectors";
import { useSelector, useDispatch } from "react-redux";
import { checkUserThunk } from "../redux/slices/authSlice";
import { AppDispatch } from "../redux/store";

function Admin() {
  const navigate = useNavigate();
  let location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const session = useSelector(selectSession);
  const isAdmin = useSelector(selectIsAdmin);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // This will switch to the main content after 2 seconds
    }, 1000);
    return () => clearTimeout(timer); // Cleanup the timer
  }, []); // Empty dependency array means this effect runs once on mount

  useEffect(() => {
    // Check for renameFlag in location state
    if(location.state?.renameFlag) {
      console.log("Show toast for admin credentials");
      setShowToast(true);
    }
    // Verify admin status
    if (session) {
      // is this is an admin 
      dispatch(checkUserThunk());
    } else {
      // No session redirect to login
      navigate('/');
    }
  }, [dispatch, location, navigate, session]);

  if (loading || isAdmin === undefined) {
    return <div>Loading...</div>; // Display loading screen
  }

  if (!isAdmin) {
    // 503 forribben
    return <div>503 Forbidden halt!</div>;
  }

  return (
    <>
      <Box display="flex" justifyContent="flex-start" alignItems="top" height="100vh">
        <Box
          display="flex"
          flexDirection="column"
          gap={2}
          bgcolor="background.default"
          height="100vh"
        >
          <SettingsBar />
        </Box>
        <AdminControlPanel />

        
      </Box>
      <Snackbar
        open={showToast}
        onClose={() => setShowToast(false)}
      >
        <Alert onClose={() => setShowToast(false)} severity="warning" sx={{ width: '100%' }}>
          Please change admin username and password to something secure!
        </Alert>
      </Snackbar>
    </>
  );
}

export default Admin;
