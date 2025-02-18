import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import { Delete, Add, Menu } from "@mui/icons-material";
import {
  fetchChatrooms,
  createChatroom,
  deleteChatroom,
  getUUID,
  Chatroom,
} from "../utils/api";

interface ChatroomManagerProps {
  sessionImport: string;
  setChatroom: React.Dispatch<React.SetStateAction<string>>;
}

const ChatroomManager: React.FC<ChatroomManagerProps> = ({
  sessionImport,
  setChatroom,
}) => {
  const [uuid, setUUID] = useState<string>("");
  const [chatrooms, setChatrooms] = useState<Chatroom[]>([]);
  const [minimized, setMinimized] = useState<boolean>(false);
  const [selectedChatroom, setSelectedChatroom] = useState<string>("");

  const handleSelectChatroom = (id: string) => {
    setSelectedChatroom(id);
    setChatroom(id);
  };

  const minimizePanel = () => {
    minimized ? setMinimized(false) : setMinimized(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching UUID...");
        const userUUID = await getUUID(sessionImport);
        if (userUUID) {
          setUUID(userUUID);
          console.log("UUID fetched successfully:", userUUID);
        }
      } catch (error) {
        console.error("Error fetching UUID:", error);
      }
    };
    fetchData();
  }, [sessionImport]);

  useEffect(() => {
    if (uuid) {
      console.log("Fetching chatrooms...");
      fetchChatrooms(sessionImport)
        .then((rooms) => {
          setChatrooms(rooms);
          console.log("Chatrooms fetched successfully:", rooms);
        })
        .catch((error) => console.error("Error fetching chatrooms:", error));
    }
  }, [uuid]);

  const newChatroom = async () => {
    try {
      console.log("Creating chatroom...");
      const newRoomID = await createChatroom(sessionImport);
      if (newRoomID) {
        console.log("Chatroom created successfully:", newRoomID);
        setChatroom(newRoomID);
        handleSelectChatroom(newRoomID);
        console.log("Fetching updated chatrooms...");
        const updatedRooms = await fetchChatrooms(sessionImport); // Fetch updated list directly
        setChatrooms(updatedRooms); // Update chatrooms state
        console.log("Chatrooms updated successfully:", updatedRooms);
      }
    } catch (error) {
      console.error("Chatroom creation error:", error);
    }
  };

  const handleDeleteChatroom = async (chatroom_uuid: string) => {
    try {
      await deleteChatroom(sessionImport, chatroom_uuid);
      console.log("Chatroom delete successful:", chatroom_uuid);
      console.log("Fetching updated chatrooms...");
      const updatedRooms = await fetchChatrooms(sessionImport); // Fetch updated list directly
      setChatrooms(updatedRooms); // Update chatrooms state
      console.log("Chatrooms updated successfully:", updatedRooms);
    } catch (error) {
      console.error("Chatroom delete error:", error);
    }
  };

  return (
    <Box
      width={minimized ? `max(133px, 40%)` : "100%"}
      bgcolor="#e0e0e0"
      display="flex"
      flexDirection="column"
      gap={2}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Button variant="contained" color="primary" onClick={minimizePanel}>
          <Menu />
        </Button>
        <Button variant="contained" color="primary" onClick={newChatroom}>
          <Add />
        </Button>
      </Box>
      <List>
        {chatrooms.map((cr, index) => (
          <Box
            key={cr.CHATROOM_UUID}
            sx={{
              bgcolor:
                cr.CHATROOM_UUID !== selectedChatroom
                  ? "secondary.main"
                  : "rgb(0 0 0 / 23%)",
              borderRadius: "4px",
              mb: 1,
              border:
                cr.CHATROOM_UUID === selectedChatroom
                  ? "2px solid #096908;"
                  : "1px solid transparent",
            }}
          >
            <ListItem
              selected={cr.CHATROOM_UUID === selectedChatroom}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDeleteChatroom(cr.CHATROOM_UUID)}
                >
                  <Delete />
                </IconButton>
              }
              onClick={() => handleSelectChatroom(cr.CHATROOM_UUID)}
            >
              <ListItemText
                primary={cr.CHATROOM_UUID}
                sx={{
                  color: "primary.contrastText",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              />
            </ListItem>
          </Box>
        ))}
      </List>
    </Box>
  );
};

export default ChatroomManager;
