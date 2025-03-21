import { useEffect } from "react";
import { Box, Button, CircularProgress, Divider, Typography } from "@mui/material";
import { Inventory2 } from "@mui/icons-material";
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

import Markdown from "react-markdown";
import { useNavigate } from "react-router-dom";
import WelcomeScreen from "../components/welcomeScreen";

import "./chat.css"

const Chat = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

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

  useEffect(() => {
    if (!session) navigate('/')
  }, [navigate, session])

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

  const msgComponents = messages.map((msg, index) => (
    <Message style={{ fontSize: fontSize }} model={{ direction: msg.direction, sender: msg.sender, position: "single", type: "custom", payload: <Markdown>{msg.message}</Markdown> }} key={index} />
  ));

  return (
    <Box display="flex" justifyContent="flex-start" alignItems="center" height="100vh" >
      <Box
        display="flex"
        flexDirection="column"
        gap={2}
        bgcolor="background.default"
        height="100vh"
        width="10vw"
        maxWidth="10vw"
      >
        <SettingsBar />
        <ChatroomManager />
      </Box>

      <Divider orientation='vertical' />

      {currentChatroomID && <Box display="flex" height="100vh" flexDirection="column" flexGrow={1} bgcolor="background.default" >
        <Box
          p={2}
          display="flex"
          flexDirection="row"
          gap={2}
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h6" style={{ flexGrow: 1 }} color='secondary.contrastText' fontWeight='bold'>
            {currentChatroomName}
          </Typography>
          <Button
            variant="contained"
            startIcon={<Inventory2 />}
            onClick={handleFileListButton}
            disabled={!currentChatroomID}
          >
            File List
          </Button>
        </Box>

        <Divider />

        <Box
          sx={{
            position: "relative",
            flexGrow: 1,
            display: "flex",
            flexDirection: "row",
          }}
        >
          <MainContainer
            style={{ flex: fileListShowing ? "0 0 70%" : "1 1 auto", border: 0  }}
          >
            <ChatContainer>
              <MessageList style={{ backgroundColor: darkMode ? "#5F5F5FFF" : 'white', border: 0 }}>{msgComponents}</MessageList>
              <MessageInput
                placeholder="Type message here"
                style={{ backgroundColor: darkMode ? "#464646FF" : 'white', border: 0 }}
                onSend={(msg) => {
                  dispatch(sendMessageThunk(msg));
                }}
                attachButton={false}
              />
            </ChatContainer>
          </MainContainer>
          {fileListShowing && <FileManager />}
        </Box>
      </Box>}
      {!currentChatroomID && <WelcomeScreen />}
    </Box>
  );
};

export default Chat;
