import { useState, useEffect } from "react";
import { Box, Button, Typography, Divider } from "@mui/material";
import { UploadFile, Inventory2 } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
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
import {
  fetchMessages,
  fetchMessageDetails,
  sendMessage,
  getUUID,
  uploadFile,
  startParsing,
  BackendFile,
} from "../utils/api";
import theme from "../style/theme";

function Chat() {
  const navigate = useNavigate();
  let location = useLocation();
  const [session, setSession] = useState<string>("");
  const [uuid, setUUID] = useState<string>("");
  const [messages, setMessages] = useState<MessageModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentChatroom, setCurrentChatroom] = useState<string>("");
  const [fileList, setFileList] = useState<BackendFile[]>([]);
  const [fileListShowing, setFileListShowing] = useState<boolean>(false);

  const refetchMessages = async () => {
    if (!currentChatroom || !session) return;
    const messageList = await fetchMessages(currentChatroom, session);
    const newMessagesArr: MessageModel[] = [];

    for (const { Message_UUID, User_UUID } of messageList) {
      const actualMsg = await fetchMessageDetails(
        currentChatroom,
        Message_UUID,
        session
      );
      newMessagesArr.push({
        message: actualMsg,
        direction:
          User_UUID === "00000000-0000-0000-0000-000000000000"
            ? "incoming"
            : "outgoing",
        sender:
          User_UUID === "00000000-0000-0000-0000-000000000000"
            ? "InfoGrep"
            : "You",
        position: "single",
      });
    }
    setMessages(newMessagesArr);
  };

  useEffect(() => {
    if (currentChatroom && session) {
      refetchMessages();
    }
  }, [currentChatroom, session]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // This will switch to the main content after 2 seconds
    }, 1000);
    return () => clearTimeout(timer); // Cleanup the timer
  }, []); // Empty dependency array means this effect runs once on mount

  useEffect(() => {
    if (session === "") {
      if (location.state && location.state.sessionID) {
        setSession(location.state.sessionID);
      } else {
        navigate("/");
      }
    }
  }, [location]);

  useEffect(() => {
    // Set the session cookie whenever the session state changes
    if (session) {
    }
    if (session) {
      console.log("ChatSession:", session);
      getUUID();
    }
  }, [session]);

  useEffect(() => {
    if (session) {
      getUUID().then((id) => id && setUUID(id));
    } else if (location.state?.sessionID) {
      setSession(location.state.sessionID);
    } else {
      navigate("/");
    }
  }, [session, location, navigate]);

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

  console.log("render: ", messages);
  const msgComponents = messages.map((a) => (
    <Message model={a} key={a.message} />
  ));
  console.log(msgComponents);
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
          <SettingsBar />
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
                  onChange={async (e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      const fileId = await uploadFile(
                        currentChatroom,
                        session,
                        file
                      );
                      console.log("got file id " + fileId);
                      if (fileId) {
                        const parseResult = await startParsing(
                          currentChatroom,
                          session,
                          fileId
                        );
                        console.log("Parse result" + parseResult);
                      }
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
          {/* Chat messages */}
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
                  onSend={async (msg) => {
                    // send to our chatroom service
                    setMessages([
                      ...messages,
                      {
                        message: msg,
                        direction: "outgoing",
                        position: "single",
                      },
                    ]);
                    await sendMessage(currentChatroom, session, msg);
                    refetchMessages();
                  }}
                />
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
