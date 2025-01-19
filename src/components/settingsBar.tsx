import React, { useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate } from 'react-router-dom';

const SettingsBar = ({ uuid }: { uuid: string }) => {
  const [count, setCount] = useState(0);
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log('Logging out...');
    // call Auth Endpoint for logout
    navigate('/'); // Use the path you defined in your Routes

  };

  const handleSettings = () => {
    console.log('Settings');
    //navigate('/settings');
  }

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
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