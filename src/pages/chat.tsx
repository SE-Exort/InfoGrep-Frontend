import { useState, useEffect, useContext, useCallback } from "react";
import {
  Box,
  Button,
  Typography,
  Divider,
} from "@mui/material";
import { UploadFile, Inventory2 } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
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
import FileManager from "../components/fileManager";
import { SettingsContext } from "../context/SettingsContext";
import { current } from "@reduxjs/toolkit";


interface BackendFile {
  File_UUID: string;
  File_Name: string;
}

const CHATBOT_UUID = "00000000-0000-0000-0000-000000000000";

const Chat = () => {
  const navigate = useNavigate();
  let location = useLocation();
  const [session, setSession] = useState<string>('');
  const [uuid, setUUID] = useState<string>("");
  const [messages, setMessages] = useState<MessageModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentChatroom, setCurrentChatroom] = useState<string>("");
  const [currentChatroomName, setChatroomName] = useState<string>("");
  const [fileList, setFileList] = useState<BackendFile[]>([]);
  const [fileListShowing, setFileListShowing] = useState<boolean>(false);

  const { darkMode, fontSize } = useContext(SettingsContext);
  const theme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: "#9feeba",
      },
      secondary: {
        main: "#cfedd9",
      },

      // Add more colors as needed
    },
    typography: {
      fontSize,
    },
  });
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#518764',
      },
      secondary: {
        main: '#424f47',
      },
    },
    typography: {

      fontSize,
    },
  });
  const refetchMessages = useCallback(async () => {
    // refetch messages
    const data = await fetch('http://127.0.0.1:8003/api/room?' + new URLSearchParams({
      'chatroom_uuid': currentChatroom,
      'cookie': session,
    }).toString(), { method: 'GET' });
    const newMessages = await data.json();

    // process each individual message
    const newMessagesArr: MessageModel[] = [];
    newMessages.list.forEach(async ({ Message_UUID, User_UUID, Message }: { Message_UUID: string, User_UUID: string, Message: string }) => {
      newMessagesArr.push({
        message: Message.replaceAll("[[\"", '').replaceAll("\"]]", ''),
        direction: User_UUID === CHATBOT_UUID ? 'incoming' : 'outgoing',
        sender: User_UUID === CHATBOT_UUID ? 'InfoGrep' : 'You',
        position: 'single',
      })
    })
    console.log("refetched msgs", newMessagesArr);
    setMessages(newMessagesArr);
  }, [currentChatroom, session]);

  useEffect(() => {
    if (currentChatroom && session) {
      refetchMessages();
    }
  }, [currentChatroom, refetchMessages, session])

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // This will switch to the main content after 2 seconds
    }, 1000);
    return () => clearTimeout(timer); // Cleanup the timer
  }, []); // Empty dependency array means this effect runs once on mount

  useEffect(() => {
    if (session === '') {
      if (location.state && location.state.sessionID) {
        setSession(location.state.sessionID);
      } else {
        navigate('/')
      };
    }
  }, [location, navigate, session]);

  const getUUID = useCallback(async () => {
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
  }, [session]);

  useEffect(() => {
    // Set the session cookie whenever the session state changes
    if (session) {
    }
    if (session) {
      console.log("ChatSession:", session);
      getUUID();
    }
  }, [getUUID, session]);



  const handleFileUpload = () => {
    // Handle file upload logic here
    console.log("File uploaded");
  };

  const handleFileListButton = () => {
    setFileListShowing(!fileListShowing);
  };

  if (loading) {
    return <div>Loading...</div>; // Display loading screen
  }

  console.log("render: ", messages)
  const msgComponents = messages.map((a: MessageModel) => (
    <div key={a.message} style={{ fontSize: `${fontSize}px` }}>
      <Message model={a} />
    </div>
  ));
  console.log(msgComponents)

  return (
    <ThemeProvider theme={darkMode ? darkTheme : theme}>
      <Box display="flex" justifyContent="flex-start" alignItems="center">
        <Box
          display="flex"
          flexDirection="column"
          gap={2}
          bgcolor={darkMode ? '#647569' : 'grey.200'}
          height="100vh"
        >
          <SettingsBar sessionToken={session} uuid={uuid} />
          <ChatroomManager
            sessionImport={session}
            setChatroom={setCurrentChatroom}
            setChatroomName={setChatroomName}
          />
        </Box>

        <Box display="flex" height="100vh" flexDirection="column" flexGrow={1}>
          {/* File manager */}
          <Box
            bgcolor={darkMode ? '#696969' : "#e0e0e0"}
            p={2}
            display="flex"
            flexDirection="row"
            gap={2}
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h6" style={{ flexGrow: 1 }}>{currentChatroomName}</Typography>
            <Box display="flex" gap={2}>
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
                    const data = await fetch('http://127.0.0.1:8002/api/file?' + new URLSearchParams({
                      'chatroom_uuid': currentChatroom,
                      'cookie': session
                    }).toString(), { method: "POST", body: formData });

                    const fileId = (await data.text()).replaceAll("\"", '');
                    console.log("got file id " + fileId);
                    const parseResult = await fetch('http://127.0.0.1:8001/api/start_parsing?' + new URLSearchParams({
                      'chatroom_uuid': currentChatroom,
                      'cookie': session,
                      'file_uuid': fileId,
                      'filetype': 'PDF'
                    }).toString(), { method: 'POST' });

                    console.log("Parse result" + parseResult);
                  }
                }} />
                Upload File
              </Button>
              <Divider />
              <Button
                variant="contained"
                startIcon={<Inventory2 />}
                onClick={handleFileListButton}
              >
                File List
              </Button>
            </Box>
          </Box>
          {/* Chat messages */}
          <div style={{ position: "relative", flexGrow: 1, display: 'flex', flexDirection: "row" }}>
            <MainContainer style={{ flex: fileListShowing ? '0 0 70%' : '1 1 auto' }}>
              <ChatContainer>
                <MessageList style={{ backgroundColor: darkMode ? '#6b7572' : '#f0f0f0' }}>
                  {msgComponents}
                </MessageList>
                <MessageInput placeholder="Type message here" onSend={async (msg) => {
                  // send to our chatroom service
                  setMessages([...messages, {
                    message: msg,
                    direction: 'outgoing',
                    position: 'single'
                  }]);
                  await fetch('http://127.0.0.1:8003/api/message?' + new URLSearchParams({
                    'chatroom_uuid': currentChatroom,
                    'cookie': session,
                    'message': msg,
                    'model': 'ollama'
                  }).toString(), { method: 'POST' });
                  refetchMessages();
                }} />
              </ChatContainer>
            </MainContainer>
            {fileListShowing && (
              <FileManager
                chatroom={currentChatroom}
                sessionImport={session}
                setFileList={setFileList}
                fileList={fileList}
              />
            )}
          </div>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default Chat;
