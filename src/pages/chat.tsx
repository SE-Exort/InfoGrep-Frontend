import { useState, useEffect } from "react";
import { Box, Button, Typography, Divider, Tooltip } from "@mui/material";
import { UploadFile, Inventory2 } from "@mui/icons-material";
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
} from "@chatscope/chat-ui-kit-react";
import FileManager from "../components/fileManager";
import theme from "../style/theme";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../redux/store";
import {
  fetchMessagesThunk,
  sendMessageThunk,
} from "../redux/slices/chatSlice";
import { fetchFilesThunk, setFileListShowing } from "../redux/slices/fileSlice";
import { checkUserThunk } from "../redux/slices/authSlice";
import {
  selectSession,
  selectMessages,
  selectChatLoading,
  selectCurrentChatroomID,
  selectFontSize,
  selectDarkMode,
  selectFileListShowing,
  selectCurrentChatroomName,
} from "../redux/selectors";
import { motion } from "framer-motion";

const Chat = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Redux
  const session = useSelector(selectSession);
  // const uuid = useSelector((state: RootState) => state.auth.uuid);
  const messages = useSelector(selectMessages);
  const loading = useSelector(selectChatLoading);
  const currentChatroomID = useSelector(selectCurrentChatroomID);
  const currentChatroomName = useSelector(selectCurrentChatroomName);
  const fileListShowing = useSelector(selectFileListShowing);
  const fontSize = useSelector(selectFontSize);
  const darkMode = useSelector(selectDarkMode);
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#518764",
      },
      secondary: {
        main: "#424f47",
      },
    },
    typography: {
      fontSize,
    },
  });

  // Welcome page
  const message = "Welcome to Infogrep!";
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < message.length) {
        setDisplayedText((prev) => message.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (session) {
      dispatch(checkUserThunk()); // Get user UUID
    }
    if (currentChatroomID) {
      dispatch(fetchMessagesThunk()); // Load chat messages
      dispatch(fetchFilesThunk()); // Load files for the chatroom
    }
  }, [session, currentChatroomID, dispatch]);

  const handleFileListButton = () => {
    // Toggle file list visibility
    dispatch(setFileListShowing(!fileListShowing));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const msgComponents = messages.map((msg, index) => (
    <Message model={{ ...msg, position: "single" }} key={index} />
  ));

  return (
    <ThemeProvider theme={darkMode ? darkTheme : theme}>
      <Box display="flex" justifyContent="flex-start" alignItems="center">
        <Box
          display="flex"
          flexDirection="column"
          gap={2}
          bgcolor={darkMode ? "#647569" : "grey.200"}
          height="100vh"
        >
          <SettingsBar />
          <ChatroomManager />
        </Box>

        <Box display="flex" height="100vh" flexDirection="column" flexGrow={1}>
          {currentChatroomID ? (
            <>
              <Box
                bgcolor={darkMode ? "#696969" : "#e0e0e0"}
                p={2}
                display="flex"
                flexDirection="row"
                gap={2}
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                  {currentChatroomName}
                </Typography>
                <Tooltip
                  title={!currentChatroomID && "Please select a chatroom"}
                >
                  <span>
                    <Button
                      variant="contained"
                      startIcon={<Inventory2 />}
                      onClick={handleFileListButton}
                      disabled={!currentChatroomID}
                    >
                      File List
                    </Button>
                  </span>
                </Tooltip>
              </Box>

              <div
                style={{
                  position: "relative",
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <MainContainer
                  style={{ flex: fileListShowing ? "0 0 70%" : "1 1 auto" }}
                >
                  <ChatContainer>
                    <MessageList>{msgComponents}</MessageList>
                    <MessageInput
                      placeholder="Type message here"
                      onSend={(msg) => {
                        dispatch(sendMessageThunk(msg));
                      }}
                    />
                  </ChatContainer>
                </MainContainer>
                {fileListShowing && <FileManager />}
              </div>
            </>
          ) : (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              height="100vh"
              bgcolor="#798f60"
            >
              <motion.h1
                className="text-4xl font-bold text-white mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              >
                {displayedText}
              </motion.h1>
            </Box>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Chat;
