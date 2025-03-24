import { useEffect, useState } from "react";
import { AppBar, Box, Button, Dialog, DialogContent, DialogContentText, DialogTitle, Divider, IconButton, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Toolbar, Typography } from "@mui/material";
import ChatroomsList from "../components/chatroom/chatroomsList";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
} from "@chatscope/chat-ui-kit-react";
import ChatroomManager from "../components/chatroom/chatroomManager";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../redux/store";
import {
  fetchChatroomThunk,
  MessageReference,
  sendMessageThunk,
} from "../redux/slices/chatSlice";
import { fetchFilesThunk } from "../redux/slices/fileSlice";
import { checkUserThunk } from "../redux/slices/authSlice";
import {
  selectSession,
  selectMessages,
  selectCurrentChatroomID,
  selectFontSize,
  selectDarkMode,
  selectFileListShowing,
  selectFiles,
} from "../redux/selectors";

import Markdown from "react-markdown";
import { useNavigate } from "react-router-dom";
import WelcomeScreen from "../components/chatroom/welcomeScreen";

import "./chat.css"
import ChatroomTopBar from "../components/chatroom/chatRoomTopBar";
import SettingsBar from "../components/user/settingsBar";

import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';

const Chat = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [referencesToDisplay, setReferencesToDisplay] = useState<MessageReference[]>([]);
  // Redux
  const session = useSelector(selectSession);
  // const uuid = useSelector((state: RootState) => state.auth.uuid);
  const messages = useSelector(selectMessages);
  const currentChatroomID = useSelector(selectCurrentChatroomID);

  const fileListShowing = useSelector(selectFileListShowing);
  const fontSize = useSelector(selectFontSize);
  const darkMode = useSelector(selectDarkMode);
  const files = useSelector(selectFiles);

  useEffect(() => {
    if (!session) navigate('/')
  }, [navigate, session])

  useEffect(() => {
    if (session) {
      dispatch(checkUserThunk()); // Get user UUID
    }
  }, [session, dispatch]);

  useEffect(() => {
    if (currentChatroomID) {
      dispatch(fetchChatroomThunk()); // Load chat messages
      dispatch(fetchFilesThunk()); // Load files for the chatroom
    }
  }, [currentChatroomID, dispatch]);

  const msgComponents = messages.map((msg, index) => (
    <Message style={{ fontSize: fontSize }}
      model={{
        direction: msg.direction, sender: msg.sender, position: "single", type: "custom", payload:
          <Box display='flex' flexDirection='column'>
            {msg?.references?.length > 0 && msg.direction === 'incoming' && <InfoIcon fontSize='small' onClick={() => setReferencesToDisplay(msg.references)} />}
            <Markdown>{msg.message}</Markdown>
          </Box>
      }}
      key={index} />
  ));

  return (
    <Box display="flex" justifyContent="flex-start" alignItems="center" height="100vh">
      <Dialog
        open={referencesToDisplay.length > 0}
        onClose={() => setReferencesToDisplay([])}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullScreen
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setReferencesToDisplay([])}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Sources of information
            </Typography>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <DialogContentText>
            The following sources were referenced during the generation of model response.
          </DialogContentText>
          <TableContainer>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>File Name</TableCell>
                  <TableCell>Page</TableCell>
                  <TableCell>Relevant Text</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {referencesToDisplay.map(r => (
                  <TableRow
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {files.find(f => f.File_UUID === r.file)?.File_Name ?? "NA"}
                    </TableCell>
                    <TableCell>{String(r.page)}</TableCell>
                    <TableCell>{r.textContent}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>
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
        <ChatroomsList />
      </Box>

      <Divider orientation='vertical' />

      {
        currentChatroomID && <Box display="flex" height="100vh" flexDirection="column" flexGrow={1} bgcolor="background.default" >
          <ChatroomTopBar />
          <Divider />

          <Box
            sx={{
              position: "relative",
              flexGrow: 1,
              display: "flex",
              flexDirection: "row",
              overflow: 'scroll'
            }}
          >
            <MainContainer
              style={{ flex: fileListShowing ? "0 0 70%" : "1 1 auto", border: 0 }}
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
            {fileListShowing && <ChatroomManager />}
          </Box>
        </Box>
      }
      {!currentChatroomID && <WelcomeScreen />}
    </Box >
  );
};

export default Chat;
