import React, { useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const SettingsBar = ({ sessionToken, uuid }: { sessionToken: string, uuid: string }) => {
  const [count, setCount] = useState(0);

  const [fontSize, setFontSize] = useState(16);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch(`http://localhost:4000/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionToken }),
      });

      if (!response.ok) {
        throw new Error('Request failed');
      } else {
        console.log('OK: Logged out');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
    // stop processing things 
    Cookies.remove('session'); // remove session cookie
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