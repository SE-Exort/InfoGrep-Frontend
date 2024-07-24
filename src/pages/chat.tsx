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
import { current } from "@reduxjs/toolkit";

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
  const [messages, setMessages] = useState<MessageModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentChatroom, setCurrentChatroom] = useState<string>("");

  const refetchMessages = async () => {
    // refetch messages
    const data = await fetch('http://0.0.0.0:8003/api/room?' + new URLSearchParams({
      'chatroom_uuid': currentChatroom,
      'cookie': session,
    }).toString(), {method: 'GET'});
    const newMessages = await data.json();
    
    // get each individual message
    const newMessagesArr: MessageModel[] = [];
    newMessages.list.forEach(async ({Message_UUID, User_UUID} : {Message_UUID: string, User_UUID: string}) => {
      const data = await fetch('http://0.0.0.0:8003/api/message?' + new URLSearchParams({
        'chatroom_uuid': currentChatroom,
        'message_uuid': Message_UUID,
        'cookie': session,
      }).toString(), {method: 'GET'});
      const actualMsg = await data.text();

      newMessagesArr.push({
        message: actualMsg.replaceAll("[[\"", '').replaceAll("\"]]", ''),
        direction: User_UUID === "00000000-0000-0000-0000-000000000000" ? 'incoming' : 'outgoing',
        sender: User_UUID === "00000000-0000-0000-0000-000000000000" ? 'InfoGrep' : 'You',
        position: 'single',
      })
      console.log("refetched msgs", newMessagesArr);
      setMessages(newMessagesArr);
    })
  };

  useEffect(() => {
    if (currentChatroom && session) {
      refetchMessages();
    }
  }, [currentChatroom, session])
  
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

  console.log("render: ", messages)
  const msgComponents = messages.map(a => <Message model={a} key={a.message}/>);
  console.log(msgComponents)
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
              <input type="file" hidden onChange={async (e) => {
                if (e.target.files && e.target.files[0]) {
                  const file: File = e.target.files[0]
                  const formData = new FormData()
                  formData.append("uploadedfile", file)
                  const data = await fetch('http://0.0.0.0:8002/api/file?' + new URLSearchParams({
                    'chatroom_uuid': currentChatroom,
                    'cookie': session
                  }).toString(), {method: "POST", body: formData});

                  const fileId = (await data.text()).replaceAll("\"", '');
                  console.log("got file id " + fileId);
                  const parseResult = await fetch('http://0.0.0.0:8001/api/start_parsing?' + new URLSearchParams({
                    'chatroom_uuid': currentChatroom,
                    'cookie': session,
                    'file_uuid': fileId,
                    'filetype': 'PDF'
                  }).toString(), {method: 'POST'});

                  console.log("Parse result" + parseResult);
                }
                }}/>
              Upload File
            </Button>
            <Divider />
          </Box>
          {/* Chat messages */}
          <div style={{ position: "relative", flexGrow: 1 }}>
            <MainContainer>
              <ChatContainer>
                <MessageList>
                  {msgComponents}
                </MessageList>
                <MessageInput placeholder="Type message here" onSend={async (msg) => {
                  // send to our chatroom service
                  setMessages([...messages, {
                    message: msg,
                    direction: 'outgoing',
                    position: 'single'
                  }]);
                  await fetch('http://0.0.0.0:8003/api/message?' + new URLSearchParams({
                    'chatroom_uuid': currentChatroom,
                    'cookie': session,
                    'message': msg,
                  }).toString(), {method: 'POST'});
                  refetchMessages();
                }} />
              </ChatContainer>
            </MainContainer>
          </div>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default Chat;
