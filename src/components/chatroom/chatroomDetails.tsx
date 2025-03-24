import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { selectChatroomChatModel, selectChatroomChatProvider, selectChatroomEmbeddingModel, selectChatroomEmbeddingProvider,selectCurrentChatroomID } from "../../redux/selectors";
import { changeModelThunk } from "../../redux/slices/chatSlice";
import {
    Box,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
  } from "@mui/material";
const ChatroomDetails = () => {
    const dispatch = useDispatch<AppDispatch>();
    const selectedEmbeddingModel = useSelector(selectChatroomEmbeddingModel);
    const selectedChatModel = useSelector(selectChatroomChatModel);
    const selectedEmbeddingProvider = useSelector(selectChatroomEmbeddingProvider);
    const selectedChatProvider = useSelector(selectChatroomChatProvider);
    const [open, setOpen] = useState(false);

    const [chatModel, setChatModel] = useState(selectedChatModel);
    const [chatProvider, setChatProvider] = useState(selectedChatProvider);
    const selectedChatroomID = useSelector(selectCurrentChatroomID);
    let chatroom_uuid = selectedChatroomID;

    const handleOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

    const handleSave= async () => {

      await dispatch(changeModelThunk({chatroom_uuid, chatModel, chatProvider})).unwrap();;
      handleClose();
    };
    return (
        <Box display="flex" gap={1} flexDirection="column">
            <Typography>Room details</Typography>
            <Typography variant="caption">
            <Typography variant="caption" fontWeight="bold">
                Embedding Model:&nbsp;
            </Typography>
            {selectedEmbeddingModel}
            </Typography>
            <Typography variant="caption">
            <Typography variant="caption" fontWeight="bold">
                Chat Model:&nbsp;
            </Typography>
            {selectedChatModel}
            </Typography>
            <Typography variant="caption">
            <Typography variant="caption" fontWeight="bold">
                Embedding Provider:&nbsp;
            </Typography>
            {selectedEmbeddingProvider}
            </Typography>
            <Typography variant="caption">
            <Typography variant="caption" fontWeight="bold">
                Chat Provider:&nbsp;
            </Typography>
            {selectedChatProvider}
            </Typography>


            <Button variant="contained" onClick={handleOpen}>
            Edit Chat Settings
            </Button>

            <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Change Chat Model/Provider</DialogTitle>
            <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2}}>
                <TextField
                margin="normal"
                label="Chat Model"
                value={chatModel}
                onChange={(e) => setChatModel(e.target.value)}
                fullWidth
                />
                <TextField
                label="Chat Provider"
                value={chatProvider}
                onChange={(e) => setChatProvider(e.target.value)}
                fullWidth
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSave}>Save</Button>
            </DialogActions>
            </Dialog>
        </Box>
        );
}

export default ChatroomDetails;