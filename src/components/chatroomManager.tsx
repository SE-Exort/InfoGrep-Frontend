import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, List, ListItem, ListItemText, IconButton, Divider } from '@mui/material';
import { Delete, Add, Menu } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';

interface Chatroom {
  CHATROOM_UUID: string;
  CHATROOM_NAME: string;
}

const ChatroomManager = ({ sessionImport }: { sessionImport: string }) => {
  const [count, setCount] = useState(0);
  const [session, setSession] = useState<string>('');
  const [uuid, setUUID] = useState<string>('');
  const [chatrooms, setChatrooms] = useState<Chatroom[]>([]);
  const [minimized, setMinimized] = useState<boolean>(false);

  const minimizePanel = () => {
    minimized ? setMinimized(false) : setMinimized(true);
  };

  const getUUID = async () => {
    try {
      const sessionToken = session;
      console.log(JSON.stringify({ sessionToken }));
      const response = await fetch(`http://localhost:4000/check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionToken }),
      });
      if (!response.ok) {
        throw new Error('Request failed');
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.status);
      }
      setUUID(data.data); 
      console.log('UUID:', data.data);
    } catch (error) {
      console.error('UUID error:', error);
    }
  };

  const newChatroom = async () => {
    try {
      const cookie = session;
      // const response = await fetch(`http://localhost:8003/api/room?` + new URLSearchParams({ cookie }).toString());
      const response = await fetch(`http://localhost:8003/api/room?` + new URLSearchParams({cookie}).toString(), {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded', // or 'application/json' if sending JSON data
        },
        body: new URLSearchParams({ cookie }).toString() // Send the data in the body
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.status);
      }
      console.log('Chatroom creation successful:', data, data.list);
      getChatrooms();
    } catch (error) {
      console.error('Chatroom creation error:', error);
    }
  };

  useEffect(() => {
    setSession(sessionImport);
  }, []);

  useEffect(() => {
    if(session){
      getUUID();
    }
  }, [session]);

  useEffect(() => {
    if(uuid){
      getChatrooms();
    }
  }, [uuid]);

  const getChatrooms = async () => {
    try {
      const cookie = session;
      const response = await fetch(`http://localhost:8003/api/rooms?` + new URLSearchParams({ cookie }).toString());
      if (!response.ok) {
        throw new Error('Request failed');
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.status);
      }
      
      setChatrooms(data.list);
      console.log('Chatroom grep successful:', data.list);
    } catch (error) {
      console.error('Chatroom grep error:', error);
    }
  };

  const deleteChatroom = async (chatroom_uuid: string) => {
    try {
      const cookie = session;
      // const response = await fetch(`http://localhost:8003/api/room?` + new URLSearchParams({ cookie }).toString());
      const response = await fetch(`http://localhost:8003/api/room?` + new URLSearchParams({ chatroom_uuid, cookie}).toString(), {
        method: 'DELETE', 
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded', // or 'application/json' if sending JSON data
        },
        body: new URLSearchParams({ chatroom_uuid, cookie }).toString() // Send the data in the body
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.status);
      }
      console.log('Chatroom delete successful:', data);
      getChatrooms();
    } catch (error) {
      console.error('Chatroom delete error:', error);
    }
  };

  return (
    <Box width={minimized ? "25%" : "100%"} bgcolor="#e0e0e0" p={1} display="flex" flexDirection="column" gap={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Button variant="contained" color="primary" onClick={minimizePanel}>
          <Menu />
        </Button>
        <Button variant="contained" color="primary" onClick={newChatroom}>
          <Add />
        </Button>
      </Box>
      <List>
      {chatrooms.map((cr, index) => (
        <Box key={cr.CHATROOM_NAME} sx={{ bgcolor: 'secondary.main', borderRadius: '4px', mb: 1 }}> {/* Use cr.id instead of index for key */}
          <ListItem secondaryAction={
            <IconButton edge="end" aria-label="delete" onClick={() => deleteChatroom(cr.CHATROOM_UUID)}> {/* Pass cr.id to deleteChatroom */}
              <Delete />
            </IconButton>
          }>
            <ListItemText primary={cr.CHATROOM_NAME} sx={{ color: 'primary.contrastText' }} /> {/* Use cr.name for the primary text */}
          </ListItem>
        </Box>
      ))}
          </List>
    </Box>
  );
};

export default ChatroomManager;