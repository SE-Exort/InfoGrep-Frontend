import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { selectChatroomChatModel, selectChatroomChatProvider, selectChatroomEmbeddingModel, selectChatroomEmbeddingProvider, selectCurrentChatroomID } from "../../redux/selectors";
import { Box, Divider, Typography } from "@mui/material";
import { useEffect } from "react";
import { fetchChatroomThunk } from "../../redux/slices/chatSlice";

const ChatroomDetails = () => {
    const dispatch = useDispatch<AppDispatch>();
    const selectedChatroomID = useSelector(selectCurrentChatroomID);
    const selectedEmbeddingModel = useSelector(selectChatroomEmbeddingModel);
    const selectedChatModel = useSelector(selectChatroomChatModel);
    const selectedEmbeddingProvider = useSelector(selectChatroomEmbeddingProvider);
    const selectedChatProvider = useSelector(selectChatroomChatProvider);

    useEffect(() => {
        if (selectedChatroomID) dispatch(fetchChatroomThunk());
    }, [dispatch, selectedChatroomID]);

    return <Box display='flex' gap={1} flexDirection='column'>
        <Typography>Room details</Typography>
        <Divider />
        <Typography variant="caption">
            <Typography variant="caption" fontWeight='bold'>Embedding Model: </Typography>
            {selectedEmbeddingModel}
        </Typography>
        <Typography variant="caption">
            <Typography variant="caption" fontWeight='bold'>Chat Model: </Typography>
            {selectedChatModel}
        </Typography>
        <Typography variant="caption">
            <Typography variant="caption" fontWeight='bold'>Embedding Provider: </Typography>
            {selectedEmbeddingProvider}
        </Typography>
        <Typography variant="caption">
            <Typography variant="caption" fontWeight='bold'>Chat Provider: </Typography>
            {selectedChatProvider}
        </Typography>
    </Box>
}

export default ChatroomDetails;