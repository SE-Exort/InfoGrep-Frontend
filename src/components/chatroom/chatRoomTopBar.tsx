import { Inventory2, Save } from "@mui/icons-material";
import { Box, Button, Typography, TextField, IconButton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { selectCurrentChatroomID, selectCurrentChatroomName, selectFileListShowing } from "../../redux/selectors";
import { setFileListShowing } from "../../redux/slices/fileSlice";
import { renameChatroomThunk } from "../../redux/slices/chatroomSlice";
import { useState, useEffect } from "react";

const ChatroomTopBar = () => {
    const dispatch = useDispatch<AppDispatch>();
    const currentChatroomName = useSelector(selectCurrentChatroomName);
    const fileListShowing = useSelector(selectFileListShowing);
    const currentChatroomID = useSelector(selectCurrentChatroomID);

    const [editing, setEditing] = useState(false);
    const [editedName, setEditedName] = useState(currentChatroomName);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!editing) {
          setEditedName(currentChatroomName);
        }
      }, [currentChatroomName, editing]);

    const handleDoubleClick = () => {
        if (currentChatroomID) {
            setEditing(true);
            setEditedName(currentChatroomName);
        }
    };

    const handleSave = async () => {
        const trimmed = editedName.trim();
        
        // Prevent empty or duplicate names
        if (!trimmed || trimmed === currentChatroomName) {
          setEditing(false);
          return;
        }
    
        setIsSaving(true);
        try {
          console.log("Dispatching rename:", currentChatroomID, trimmed);
          await dispatch(renameChatroomThunk({ chatroomID: currentChatroomID, newName: trimmed })).unwrap();
        } catch (error) {
          console.error("Failed to rename chatroom:", error);
        }
        setIsSaving(false);
        setEditing(false);
      };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleSave();
        if (e.key === "Escape") setEditing(false);
    };

    return <Box
        p={2}
        display="flex"
        flexDirection="row"
        gap={2}
        alignItems="center"
        justifyContent="space-between"
    >
        { editing ? (
            <>
            <TextField 
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                onKeyDown={handleKeyDown}
                variant="standard"
                fullWidth
                autoFocus
                disabled={isSaving}
                inputProps={{ style: { fontSize: '1.5rem', fontWeight: 'bold' } }}
            />
            <IconButton onClick={handleSave} title="Save name">
              <Save />
            </IconButton>
            </>
        ) : (
            <Typography
                variant="h5"
                style={{ flexGrow: 1, verticalAlign: 'center' }}
                color='secondary.contrastText'
                fontWeight='bold'
                onDoubleClick={handleDoubleClick}
            >
                {currentChatroomName}
            </Typography>
        )}

        <Button
            variant="contained"
            startIcon={<Inventory2 />}
            onClick={() => dispatch(setFileListShowing(!fileListShowing))}
            disabled={!currentChatroomID}
        >
            Room
        </Button>
    </Box>
}
export default ChatroomTopBar;