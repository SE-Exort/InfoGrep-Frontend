import { Chat } from "@mui/icons-material";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
} from "@mui/material";
import SettingBar from "./SettingBar";

const ChatroomManager = () => {
  return (
    <Stack spacing={2}>
      <SettingBar />
      <List
        sx={{
          maxHeight: "82vh",
          overflowY: "auto",
        }}
      >
        <ListItemButton>
          <ListItemIcon>
            <Chat />
          </ListItemIcon>
          <ListItemText primary="ECE 459 - Lecture 5: " />
        </ListItemButton>
        <ListItemButton>
          <ListItemIcon>
            <Chat />
          </ListItemIcon>
          <ListItemText primary="ECE 459 - Lecture 4" />
        </ListItemButton>
        <ListItemButton>
          <ListItemIcon>
            <Chat />
          </ListItemIcon>
          <ListItemText primary="ECE 459 - Lecture 3" />
        </ListItemButton>

        <ListItemButton>
          <ListItemIcon>
            <Chat />
          </ListItemIcon>
          <ListItemText primary="ECE 459 - Lecture 2" />
        </ListItemButton>
        <ListItemButton>
          <ListItemIcon>
            <Chat />
          </ListItemIcon>
          <ListItemText primary="ECE 459 - Lecture 1: Introduction to Rust" />
        </ListItemButton>
      </List>
    </Stack>
  );
};

export default ChatroomManager;
