// src/pages/setting.tsx
import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Switch,
  Button,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import ChangePasswordDialog from "./changePassword";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../redux/store";
import { selectDarkMode, selectFontSize } from "../redux/selectors";
import { setDarkMode, setFontSize } from "../redux/slices/appSlice";

const SettingsDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const location = useLocation();
  const session = location.state?.sessionToken;
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const darkMode = useSelector(selectDarkMode);
  const fontSize = useSelector(selectFontSize);

  return (
    <>
      <Dialog open={open} onClose={onClose}>
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
            <Switch checked={darkMode} onChange={() => dispatch(setDarkMode(!darkMode))} />
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
                onClick={() => dispatch(setFontSize(fontSize - 1))}
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
                onClick={() => dispatch(setFontSize(fontSize + 1))}
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
            <Button color="error"
              variant="contained" onClick={() => setOpenChangePassword(true)}>
              Change My Password
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
      <ChangePasswordDialog
        open={openChangePassword}
        onClose={() => setOpenChangePassword(false)}
        sessionImport={session}
      />
    </>
  );
};

export default SettingsDialog;
