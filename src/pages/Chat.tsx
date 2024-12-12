import { Grid2 } from "@mui/material";
import ChatroomManager from "../components/ChatroomManager";
import Chatroom from "../components/Chatroom";
import FileManager from "../components/FileManager";

const Chat = () => {
  return (
    <Grid2
      container
      sx={{ width: "100vw", height: "100vh", position: "fixed" }}
    >
      <Grid2
        size={2}
        sx={{
          backgroundColor: "primary.main",
          padding: 2,
          minWidth: 120,
        }}
      >
        <ChatroomManager />
      </Grid2>
      <Grid2 size={8} sx={{ padding: 2 }}>
        <Chatroom />
      </Grid2>
      <Grid2
        size={2}
        sx={{ backgroundColor: "primary.light", padding: 2, minWidth: 120 }}
      >
        <FileManager />
      </Grid2>
    </Grid2>
  );
};

export default Chat;
