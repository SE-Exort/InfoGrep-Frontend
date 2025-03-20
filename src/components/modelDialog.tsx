
import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    Button,
    MenuItem,
    TextField,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { createChatroomThunk } from "../redux/slices/chatroomSlice";
import { AppDispatch } from "../redux/store";
import * as endpoints from '../utils/api';

interface ModelSelectorDialogProps {
    open: boolean;
    onClose: () => void;
}

interface Model {
    provider: string;
    model: string;
}

const ModelSelectorDialog: React.FC<ModelSelectorDialogProps> = ({
    open,
    onClose,
}) => {
    const [loading, setLoading] = useState(false);
    const [chatModel, setChatModel] = useState<Model[]>([]);
    const [chatroomName, setChatroomName] = useState('');
    const [selectedChatModel, setSelectedChatModel] = useState('');
    const [embeddingModel, setEmbeddingModel] = useState<Model[]>([]);
    const [selectedEmbeddingModel, setSelectedEmbeddingModel] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    
    const handleSubmit = async () => {
        dispatch(createChatroomThunk({chatroomName, chatModel: selectedChatModel, embeddingModel: selectedEmbeddingModel}));
        onClose();
    };

    useEffect(() => {
        const fetchModels = async () => {
            setLoading(true);
            console.log('fetching model list..')
            const response = await fetch(`${endpoints.AI_API_BASE_URL}/models`, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();
            console.log(data)
            if (!data.error) {
                setChatModel(data.data.chat);
                setEmbeddingModel(data.data.embedding);
            } else {
                console.warn("Unexpected response:", data.status);
            }
            setLoading(false);
        }
        fetchModels();
    }, []);

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>New FlowZone</DialogTitle>
            <DialogContent>
                <Box display='flex' p={1} flexDirection='column' gap={2}>
                    <TextField
                        label="Zone Name"
                        value={chatroomName}
                        onChange={(e) => setChatroomName(e.target.value)}
                    />
                    <TextField
                        label="Chat Model"
                        value={selectedChatModel}
                        select
                        onChange={(e) => setSelectedChatModel(e.target.value)}
                    >
                        {chatModel.map(m => <MenuItem key={m.model} value={m.model}>{m.model}</MenuItem>)}
                    </TextField>
                    <TextField
                        value={selectedEmbeddingModel}
                        label="Embedding Model"
                        select
                        onChange={(e) => setSelectedEmbeddingModel(e.target.value)}
                    >
                        {embeddingModel.map(m => <MenuItem key={m.model} value={m.model}>{m.model}</MenuItem>)}
                    </TextField>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleSubmit} variant="contained" disabled={loading}>
                    {loading ? "Saving..." : "Create"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ModelSelectorDialog;
