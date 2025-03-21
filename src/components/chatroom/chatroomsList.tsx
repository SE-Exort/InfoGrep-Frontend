import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  List,
  ListItem,
  IconButton,
  CircularProgress,
  Typography,
} from "@mui/material";
import { Delete, Add } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../redux/store";
import {
  fetchChatroomsThunk,
  deleteChatroomThunk,
  setSelectedChatroom,
} from "../../redux/slices/chatroomSlice";
import { checkUserThunk } from "../../redux/slices/authSlice";
import {
  selectChatrooms,
  selectCurrentChatroomID,
  selectChatroomLoading,
  selectSession,
  selectUUID,
} from "../../redux/selectors";
import ModelSelectorDialog from "./modelDialog";

const ChatroomsList: React.FC = () => {
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
        <Add sx={{ color: 'primary.contrastText' }} />
      </Button>
      <List>
        {Array.from(chatrooms.entries()).map(([, { id, name }]) => (
          <Box
            key={id}
            sx={{
              bgcolor:
                id !== selectedChatroom
                  ? "secondary.main"
                  : "rgb(0 0 0 / 23%)", // TODO: colour
              borderRadius: "4px",
              mb: 1,
              border:
                id === selectedChatroom
                  ? "2px solid black;" // TODO: colour
                  : "1px solid transparent",
            }}
          >
            <ListItem
              selected={id === selectedChatroom}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={(e) => {
                    dispatch(deleteChatroomThunk(id))
                    e.stopPropagation();
                  }}
                >
                  <Delete />
                </IconButton>
              }
              onClick={(e) => dispatch(setSelectedChatroom(id))}
            >
              <Typography
                sx={{
                  color: "secondary.contrastText",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  fontWeight: id === selectedChatroom ? 'bold' : undefined
                }}
              >{name}</Typography>
            </ListItem>
          </Box>
        ))}
      </List>
      <ModelSelectorDialog open={showCreateDialog} onClose={() => setShowCreateDialog(false)} />
    </Box>
  );
};

export default ChatroomsList;
