import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Delete, Add } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../redux/store";
import {
  fetchChatroomsThunk,
  deleteChatroomThunk,
  setSelectedChatroom,
} from "../redux/slices/chatroomSlice";
import { checkUserThunk } from "../redux/slices/authSlice";
import {
  selectChatrooms,
  selectCurrentChatroomID,
  selectChatroomLoading,
  selectSession,
  selectUUID,
} from "../redux/selectors";
import ModelSelectorDialog from "./modelDialog";

const ChatroomManager: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Redux data
  const chatrooms = useSelector(selectChatrooms);
  const selectedChatroom = useSelector(selectCurrentChatroomID);
  const loading = useSelector(selectChatroomLoading);
  const session = useSelector(selectSession);
  const uuid = useSelector(selectUUID); // Get UUID from Redux

  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Fetch UUID if its missing
  useEffect(() => {
    if (session && !uuid) {
      dispatch(checkUserThunk()); // Get UUID from Redux
    }
  }, [session, uuid, dispatch]);

  // Fetch chatrooms
  useEffect(() => {
    if (session) {
      dispatch(fetchChatroomsThunk());
    }
  }, [session, dispatch]);

  const handleSelectChatroom = (id: string) => {
    dispatch(setSelectedChatroom(id));
  };

  if (loading) {
    return <Box display="flex" justifyContent="center" alignItems="center">
      <CircularProgress />
    </Box>
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={2}
      bgcolor="background.default"
      px={0.5}
    >
      <Button
        variant="contained"
        color="primary"
        onClick={() => setShowCreateDialog(true)}
      >
        <Add sx={{color: 'primary.contrastText'}}/>
      </Button>
      <List>
        {Array.from(chatrooms.entries()).map(([, cr]) => (
          <Box
            key={cr.CHATROOM_UUID}
            sx={{
              bgcolor:
                cr.CHATROOM_UUID !== selectedChatroom
                  ? "secondary.main"
                  : "rgb(0 0 0 / 23%)", // TODO: colour
              borderRadius: "4px",
              mb: 1,
              border:
                cr.CHATROOM_UUID === selectedChatroom
                  ? "2px solid black;" // TODO: colour
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
                  color: "secondary.contrastText",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              />
            </ListItem>
          </Box>
        ))}
      </List>
      <ModelSelectorDialog open={showCreateDialog} onClose={() => setShowCreateDialog(false)} />
    </Box>
  );
};

export default ChatroomManager;
