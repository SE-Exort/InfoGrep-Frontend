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
interface SettingsBarProps {
  uuid: string;
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}
const SettingsBar: React.FC<SettingsBarProps> = ({ uuid, darkMode, setDarkMode  }) => {
  const [count, setCount] = useState(0);
  const [openSettings, setOpenSettings] = useState(false);

  const [fontSize, setFontSize] = useState(16);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/'); // Use the path you defined in your Routes
    // stop processing things 
    console.log('Logging out...');
    // call Auth Endpoint for logout
    navigate('/'); // Use the path you defined in your Routes

  };

  const handleSettings = () => {
    setOpenSettings(true); 
  };

  const handleCloseSettings = () => {
    setOpenSettings(false);
  };

  const handleDarkModeToggle = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDarkMode(event.target.checked);
  };

  const increaseFontSize = () => {
    setFontSize((prevSize) => prevSize + 1);
  };

  const decreaseFontSize = () => {
    setFontSize((prevSize) => Math.max(1, prevSize - 1)); 
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        mt: 2
      }}>
        <IconButton onClick={handleSettings}>
          <SettingsIcon />
        </IconButton>
        <IconButton onClick={handleLogout}>
          <LogoutIcon />
        </IconButton>
      </Box>


      <Dialog open={openSettings} onClose={handleCloseSettings}>
        <DialogTitle fontWeight={600}>Settings</DialogTitle>
        <DialogContent>

          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              width: '100%',
              mt: 1 
            }}
          >
            <Typography variant="subtitle1" fontWeight={400}>Night Mode</Typography>
            <Switch 
              checked={darkMode} 
              onChange={handleDarkModeToggle} 
            />
          </Box>

          <Box 
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap : 1,
              mt: 2
            }}
          >
            <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
              <Typography variant="subtitle1" fontWeight={400}>
                Font Size: {fontSize}px
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="outlined" size="small" onClick={decreaseFontSize}   sx={{
                minWidth: '30px',   
                padding: '2px 6px',   
                fontSize: '0.75rem'    
              }}>
                Decrease
              </Button>
              <Button variant="contained" size="small" onClick={increaseFontSize}   sx={{
                minWidth: '30px',  
                padding: '2px 6px',
                fontSize: '0.75rem'
              }}>
                Increase
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSettings} variant="contained" fullWidth>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SettingsBar;