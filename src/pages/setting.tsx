// src/pages/setting.tsx
import React, { useContext, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Switch,
  Button,
} from "@mui/material";
import { useLocation,useNavigate } from "react-router-dom";
import { SettingsContext } from "../context/SettingsContext";
import ChangePasswordDialog from "../components/changePassword";

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();

  const location = useLocation();

  const session = location.state?.sessionToken;
  
  const { darkMode, setDarkMode, fontSize, setFontSize } = useContext(SettingsContext);

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
  };

  const increaseFontSize = () => {
    setFontSize((prev) => prev + 1);
  };

  const decreaseFontSize = () => {
    setFontSize((prev) => prev - 1);
  };

  const handleCloseSettings = () => {
    // For a dedicated settings page, you might navigate back to chat or another page.
    navigate("/chat");
  };
  const [openChangePassword, setOpenChangePassword] = useState(false);
  return (
    <>
    <Dialog open={true} onClose={handleCloseSettings}>
      <DialogTitle sx={{ fontWeight: 600 }}>Settings</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            mt: 1,
          }}
        >
          <Typography variant="subtitle1" fontWeight={400}>
            Night Mode
          </Typography>
          <Switch checked={darkMode} onChange={handleDarkModeToggle} />
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mt: 2,
          }}
        >
          <Box sx={{ flexGrow: 1, textAlign: "center" }}>
            <Typography variant="subtitle1" fontWeight={400}>
              Font Size: {fontSize}px
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={decreaseFontSize}
              sx={{
                minWidth: "30px",
                padding: "2px 6px",
                fontSize: "0.75rem",
              }}
            >
              Decrease
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={increaseFontSize}
              sx={{
                minWidth: "30px",
                padding: "2px 6px",
                fontSize: "0.75rem",
              }}
            >
              Increase
            </Button>
          </Box>
        </Box>
        <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
            <Button sx={{
                backgroundColor: "#d32f2f",
                '&:hover': {
                    backgroundColor: "#b71c1c",
                },
                }}
                variant="contained" onClick={() => setOpenChangePassword(true)}>
                Change My Password
            </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseSettings} variant="contained" fullWidth>
          Save
        </Button>
      </DialogActions>
    </Dialog>
    <ChangePasswordDialog
        open={openChangePassword}
        onClose={() => setOpenChangePassword(false)}
        sessionImport={session}
      />
    </>
  );
};

export default SettingsPage;
