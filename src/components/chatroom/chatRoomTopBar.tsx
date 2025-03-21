import { Inventory2 } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { selectCurrentChatroomID, selectCurrentChatroomName, selectFileListShowing } from "../../redux/selectors";
import { setFileListShowing } from "../../redux/slices/fileSlice";

const ChatroomTopBar = () => {
    const dispatch = useDispatch<AppDispatch>();
    const currentChatroomName = useSelector(selectCurrentChatroomName);
    const fileListShowing = useSelector(selectFileListShowing);
    const currentChatroomID = useSelector(selectCurrentChatroomID);

    return <Box
        p={2}
        display="flex"
        flexDirection="row"
        gap={2}
        alignItems="center"
        justifyContent="space-between"
    >
        <Typography variant="h5" style={{ flexGrow: 1, verticalAlign: 'center' }} color='secondary.contrastText' fontWeight='bold'>
            {currentChatroomName}
        </Typography>
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