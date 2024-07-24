import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
} from "@mui/material";
import { Delete, UploadFile } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Chatroom from "../components/chatroom";
import SettingsBar from "../components/settingsBar";
import ChatroomManager from "../components/chatroomManager";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  MessageModel,
} from "@chatscope/chat-ui-kit-react";

const theme = createTheme({
  palette: {
    primary: {
      main: "#9feeba",
    },
    secondary: {
      main: "#cfedd9",
    },
    // Add more colors as needed
  },
});

function Chat() {
  const navigate = useNavigate();
  let location = useLocation();
  const [session, setSession] = useState<string>("");
  const [uuid, setUUID] = useState<string>("");
  const [messages, setMessages] = useState<MessageModel[]>([
    {
      message: "Hi, I'm InfoGrep, your helpful assistant. Feel free to ask me anything related to your files!",
      sentTime: "just now",
      sender: "Joe",
      direction: "incoming",
      position: "normal",
    }
  ]);
  const [loading, setLoading] = useState(true);
  const [currentChatroom, setCurrentChatroom] = useState<string>("");
  
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
    if (session) {
      console.log("ChatSession:", session);
      getUUID();
    }
  }, [session]);

  const getUUID = async () => {
    try {
      const sessionToken = session;
      const response = await fetch(`http://localhost:4000/check`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionToken }),
      });
      if (!response.ok) {
        throw new Error("Request failed");
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.status);
      }
      setUUID(data.data);
      console.log("UUID:", data.data);
    } catch (error) {
      console.error("UUID error:", error);
    }
  };

  const handleFileUpload = () => {
    // Handle file upload logic here
    console.log("File uploaded");
  };

  if (loading) {
    return <div>Loading...</div>; // Display loading screen
  }
  return (
    <ThemeProvider theme={theme}>
      <Box display="flex" justifyContent="flex-start" alignItems="center">
        <Box
          display="flex"
          flexDirection="column"
          gap={2}
          bgcolor={"grey.200"}
          height="100vh"
        >
          <SettingsBar uuid={uuid} />
          <ChatroomManager
            sessionImport={session}
            setChatroom={setCurrentChatroom}
          />
        </Box>

        <Box display="flex" height="100vh" flexDirection="column" flexGrow={1}>
          {/* File manager */}
          <Box
            bgcolor="#e0e0e0"
            p={2}
            display="flex"
            flexDirection="column"
            gap={2}
          >
            <Button
              variant="contained"
              startIcon={<UploadFile />}
              onClick={handleFileUpload}
              component='label'
            >
              <input type="file" hidden onChange={(e) => console.log(e)} />
              Upload File
            </Button>
            <Divider />
          </Box>
          {/* Chat messages */}
          <div style={{ position: "relative", flexGrow: 1 }}>
            <MainContainer>
              <ChatContainer>
                <MessageList>
                  {messages.map(a => <Message model={a}/>)}
                </MessageList>
                <MessageInput placeholder="Type message here" />
              </ChatContainer>
            </MainContainer>
          </div>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default Chat;
