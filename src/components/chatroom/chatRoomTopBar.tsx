import { Inventory2, Save } from "@mui/icons-material";
import { Box, Button, Typography, TextField, IconButton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { selectCurrentChatroomID, selectCurrentChatroomName, selectFileListShowing } from "../../redux/selectors";
import { setFileListShowing } from "../../redux/slices/fileSlice";
import { updateChatroomName } from "../../redux/slices/chatroomSlice";
import { useState, useEffect } from "react";

const ChatroomTopBar = () => {
    const dispatch = useDispatch<AppDispatch>();
    const currentChatroomName = useSelector(selectCurrentChatroomName);
    const fileListShowing = useSelector(selectFileListShowing);
    const currentChatroomID = useSelector(selectCurrentChatroomID);

    const [editing, setEditing] = useState(false);
    const [editedName, setEditedName] = useState(currentChatroomName);

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

    const handleBlur = () => {
        if (editedName.trim() && editedName !== currentChatroomName) {
            console.log("Dispatching name change:", currentChatroomID, editedName.trim());
            dispatch(updateChatroomName({ chatroomID: currentChatroomID, newName: editedName.trim() }));
        }
        setEditing(false);
    };

    const handleSave = () => {
        const trimmed = editedName.trim();
        if (trimmed && trimmed !== currentChatroomName) {
        console.log("Dispatching name change:", currentChatroomID, trimmed);
        dispatch(updateChatroomName({ chatroomID: currentChatroomID, newName: trimmed }));
        }
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
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                variant="standard"
                fullWidth
                autoFocus
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