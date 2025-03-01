import React, { useEffect } from "react";
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import { Delete, Add, Menu } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import {
  fetchChatroomsThunk,
  createChatroomThunk,
  deleteChatroomThunk,
  setSelectedChatroom,
} from "../redux/slices/chatroomSlice";
import { fetchUUIDThunk } from "../redux/slices/authSlice";
import {
  selectChatrooms,
  selectSelectedChatroom,
  selectChatroomLoading,
  selectChatroomError,
  selectSession,
  selectUUID,
} from "../redux/selectors";

const ChatroomManager: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Redux data
  const chatrooms = useSelector(selectChatrooms);
  const selectedChatroom = useSelector(selectSelectedChatroom);
  const loading = useSelector(selectChatroomLoading);
  const error = useSelector(selectChatroomError);
  const session = useSelector(selectSession);
  const uuid = useSelector(selectUUID); // Get UUID from Redux

  const [minimized, setMinimized] = React.useState(false);

  // Fetch UUID if its missing
  useEffect(() => {
    if (session && !uuid) {
      dispatch(fetchUUIDThunk()); // Get UUID from Redux
    }
  }, [session, uuid, dispatch]);

  // Fetch chatrooms
  useEffect(() => {
    if (uuid) {
      dispatch(fetchChatroomsThunk());
    }
  }, [uuid, dispatch]);

  const handleSelectChatroom = (id: string) => {
    dispatch(setSelectedChatroom(id));
  };

  const minimizePanel = () => {
    setMinimized(!minimized);
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
        <Button
          variant="contained"
          color="primary"
          onClick={() => dispatch(createChatroomThunk())}
        >
          <Add />
        </Button>
      </Box>
      {loading ? (
        <p>Loading chatrooms...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <List>
          {chatrooms.map((cr) => (
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
                    onClick={() =>
                      dispatch(deleteChatroomThunk(cr.CHATROOM_UUID))
                    }
                  >
                    <Delete />
                  </IconButton>
                }
                onClick={() => handleSelectChatroom(cr.CHATROOM_UUID)}
              >
                <ListItemText
                  primary={cr.CHATROOM_NAME}
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
      )}
    </Box>
  );
};

export default ChatroomManager;
