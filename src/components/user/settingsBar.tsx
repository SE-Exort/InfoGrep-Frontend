import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState } from "react";
import SettingsDialog from "./settingsDialog";
import { logout } from "../../redux/slices/authSlice";
import { AppDispatch } from "../../redux/store";

const SettingsBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = async () => {
    dispatch(logout()); // Call Redux logout action
    navigate("/"); // Redirect to login
  };

  const [showSettings, setShowSettings] = useState(false);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        mt: 2,
        px: 1
      }}
    >
      <IconButton onClick={() => setShowSettings(true)}>
        <SettingsIcon sx={{ color: 'primary.main' }} />
      </IconButton>
      <IconButton onClick={handleLogout}>
        <LogoutIcon sx={{ color: 'primary.main' }} />
      </IconButton>
      <SettingsDialog open={showSettings} onClose={() => setShowSettings(false)} />
    </Box>
  );
};

export default SettingsBar;
