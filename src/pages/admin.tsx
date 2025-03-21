import { useState, useEffect } from "react";
import {
  Box,
  Snackbar,
  Alert,
  CircularProgress,
  Typography,
  Button,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import AdminControlPanel from "../components/admin/adminControlPanel";

import { selectIsAdmin, selectSession } from "../redux/selectors";
import { useSelector, useDispatch } from "react-redux";
import { checkUserThunk } from "../redux/slices/authSlice";
import { AppDispatch } from "../redux/store";
import SettingsBar from "../components/user/settingsBar";

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
    if (location.state?.renameFlag) {
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
    return <Box display='flex' alignItems='center' justifyContent='center' height="100vh">
      <CircularProgress />
    </Box>;
  }

  if (!isAdmin) {
    return <Box display='flex' flexDirection='column' alignItems='center' justifyContent='center' height="100vh" gap={1}>
      <Typography>503: You're not authorized to view this page!</Typography>
      <Button variant='contained' onClick={() => navigate('/chat')}>Go back to chat</Button>
    </Box>;
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
