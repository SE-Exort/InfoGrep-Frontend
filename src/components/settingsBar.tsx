import React, { useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { logout } from "../redux/slices/authSlice";

const SettingsBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Fetch session & uuid from Redux
  const session = useSelector((state: RootState) => state.auth.session);
  const uuid = useSelector((state: RootState) => state.auth.uuid);

  const handleLogout = async () => {
    dispatch(logout()); // Call Redux logout action
    navigate("/"); // Redirect to login
  };

  const handleSettings = () => {
    console.log("Settings");
    //navigate('/settings');
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mt: 2,
        }}
      >
        <IconButton onClick={handleSettings}>
          <SettingsIcon />
        </IconButton>
        <IconButton onClick={handleLogout}>
          <LogoutIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default SettingsBar;
