import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, List, ListItem, ListItemText, IconButton, Divider } from '@mui/material';
import { Delete, UploadFile } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Chatroom from '../components/chatroom';
import SettingsBar from '../components/settingsBar';
import ChatroomManager from '../components/chatroomManager';

const theme = createTheme({
  palette: {
    primary: {
      main: '#9feeba',
    },
    secondary: {
      main: '#cfedd9',
    },
    // Add more colors as needed
  },
});

function Chat() {
  const navigate = useNavigate();
  let location = useLocation();
  const [session, setSession] = useState<string>('');
  const [uuid, setUUID] = useState<string>('');
  const [messages, setMessages] = useState<string[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentChatroom, setCurrentChatroom] = useState<string>('');
  const [questions, setQuestions] = useState<string[]>([
    'What is Laplace Transform?',
    'Why is coal so interesting?',
    'What makes the Leafs bad?',
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // This will switch to the main content after 2 seconds
    }, 1000); 
    return () => clearTimeout(timer); // Cleanup the timer
  }, []); // Empty dependency array means this effect runs once on mount

  useEffect(() => {
    setSession(location.state.sessionID);
  }, [location]);

  useEffect(() => {
    if(session){
      console.log('ChatSession:', session);
      getUUID();
    }
  }, [session]);

  const getUUID = async () => {
      try {
        const sessionToken = session;
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

  const sendMessage = () => {
    if (!currentMessage.trim()) return; // Prevent sending empty messages
    setMessages([...messages, currentMessage]);
    setCurrentMessage(''); // Clear input field after sending
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentMessage(event.target.value);
  };

  const deleteQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleFileUpload = () => {
    // Handle file upload logic here
    console.log('File uploaded');
  };

  if (loading) {
    return <div>Loading...</div>; // Display loading screen
  }
  return (
    <ThemeProvider theme={theme}>
      <Box display="flex" justifyContent="flex-start" alignItems="center">
        <Box width="25%" p={1} display="flex" flexDirection="column" gap={2} bgcolor={"grey.200"}>
          <SettingsBar uuid={uuid}/>
          <ChatroomManager sessionImport={session} setChatroom={setCurrentChatroom}/>
        </Box>
        <Chatroom/> 
      </Box>
      {/* <Box display="flex" height="100vh">
        <Box width="20%" bgcolor="#e0e0e0" p={2} display="flex" flexDirection="column" gap={2}>
          <Button
            variant="contained"
            startIcon={<UploadFile />}
            onClick={handleFileUpload}
          >
            Upload File
          </Button>
          <Divider />
          <List>
            {questions.map((question, index) => (
              <Box key={index} sx={{ bgcolor: 'secondary.main', borderRadius: '4px', mb: 1 }}>
                <ListItem secondaryAction={
                  <IconButton edge="end" aria-label="delete" onClick={() => deleteQuestion(index)}>
                    <Delete />
                  </IconButton>
                }>
                  <ListItemText primary={question} sx={{ color: 'primary.contrastText' }} />
                </ListItem>
              </Box>
            ))}
          </List>
        </Box>
        <Box display="flex" flexDirection="column" flexGrow={1} p={3}>
          <Box bgcolor="#f0f0f0" p={2} mb={2}>
            <Typography variant="h6">What makes the Leafs bad?</Typography>
          </Box>
          <Box flexGrow={1} overflow="auto" maxHeight="60vh" bgcolor="#f0f0f0" p={2}>
            {messages.map((message, index) => (
              <Typography key={index} gutterBottom>
                {message}
              </Typography>
            ))}
          </Box>
          <Box display="flex" gap={1} mt={2}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter your question..."
              value={currentMessage}
              onChange={handleInputChange}
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  sendMessage();
                }
              }}
            />
            <Button variant="contained" color="primary" onClick={sendMessage}>
              Send
            </Button>
          </Box>
        </Box>
      </Box> */}
    </ThemeProvider>
  );
}

export default Chat;
