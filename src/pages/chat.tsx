import { useEffect } from "react";
import { Box, Button, Typography, Divider } from "@mui/material";
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
  selectSelectedChatroom,
  selectFontSize,
  selectDarkMode,
  selectFileListShowing,
} from "../redux/selectors";

const Chat = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Redux
  const session = useSelector(selectSession);
  // const uuid = useSelector((state: RootState) => state.auth.uuid);
  const messages = useSelector(selectMessages);
  const loading = useSelector(selectChatLoading);
  const currentChatroom = useSelector(selectSelectedChatroom);
  const fileListShowing = useSelector(selectFileListShowing);
  const fontSize = useSelector(selectFontSize);
  const darkMode = useSelector(selectDarkMode);
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

  useEffect(() => {
    if (session) {
      dispatch(checkUserThunk()); // Get user UUID
    }
    if (currentChatroom) {
      dispatch(fetchMessagesThunk()); // Load chat messages
      dispatch(fetchFilesThunk()); // Load files for the chatroom
    }
  }, [session, currentChatroom, dispatch]);

  const handleFileUpload = () => {
    console.log("File uploaded");
  };

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
          bgcolor={darkMode ? '#647569' : 'grey.200'}
          height="100vh"
        >
          <SettingsBar />
          <ChatroomManager />
        </Box>

        <Box display="flex" height="100vh" flexDirection="column" flexGrow={1}>
          <Box
            bgcolor={darkMode ? '#696969' : "#e0e0e0"}
            p={2}
            display="flex"
            flexDirection="row"
            gap={2}
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              {currentChatroom}
            </Typography>
            <Box display="flex" gap={2}>
              <Button
                variant="contained"
                startIcon={<UploadFile />}
                onClick={handleFileUpload}
                component="label"
              >
                <input
                  type="file"
                  hidden
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      console.log("Uploading file", e.target.files[0]);
                    }
                  }}
                />
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
            {fileListShowing && (
              <FileManager />
            )}
          </div>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Chat;
