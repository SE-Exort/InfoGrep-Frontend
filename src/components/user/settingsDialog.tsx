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
import ChangePasswordDialog from "./changePassword";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { selectDarkMode, selectFontSize } from "../../redux/selectors";
import { setDarkMode, setFontSize } from "../../redux/slices/appSlice";
import SessionsList from "./sessionsList";

const SettingsDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const darkMode = useSelector(selectDarkMode);
  const fontSize = useSelector(selectFontSize);

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth='xl'>
        <DialogTitle sx={{ fontWeight: 600 }}>Settings</DialogTitle>
        <DialogContent sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
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
            display='flex'
            flexDirection='row'
            justifyContent='space-between'
          >
            <Typography variant="subtitle1" fontWeight={400}>
              Font Size: {fontSize}px
            </Typography>

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
          <Button color="error"
            variant="contained" onClick={() => setOpenChangePassword(true)}>
            Change My Password
          </Button>
          <SessionsList />
        </DialogContent>
      </Dialog>
      <ChangePasswordDialog
        open={openChangePassword}
        onClose={() => setOpenChangePassword(false)}
      />
    </>
  );
};

export default SettingsDialog;
