import React, { useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
const SettingsBar = () => {
  const [count, setCount] = useState(0);

  const [fontSize, setFontSize] = useState(16);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/'); // Use the path you defined in your Routes
    // stop processing things 
    console.log('Logging out...');
    // call Auth Endpoint for logout
    navigate('/'); // Use the path you defined in your Routes

  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        mt: 2
      }}>
        <IconButton onClick={() => navigate("/settings")}>
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