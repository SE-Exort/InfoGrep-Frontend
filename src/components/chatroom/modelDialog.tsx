
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
import { createChatroomThunk } from "../../redux/slices/chatroomSlice";
import { AppDispatch } from "../../redux/store";
import * as endpoints from '../../utils/api';

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
    const [chatModels, setChatModels] = useState<Model[]>([]);
    const [chatroomName, setChatroomName] = useState('');
    const [chatModel, setChatModel] = useState<Model | null>(null);
    const [embeddingModels, setEmbeddingModels] = useState<Model[]>([]);
    const [embeddingModel, setEmbeddingModel] = useState<Model | null>(null);
    const dispatch = useDispatch<AppDispatch>();
    
    const handleSubmit = async () => {
        if (!chatModel || !embeddingModel) return;
        dispatch(createChatroomThunk({chatroomName, chatModel: chatModel.model, embeddingModel: embeddingModel.model, embeddingProvider: embeddingModel.provider, chatProvider: chatModel.provider}));
        onClose();
    };

    useEffect(() => {
        const fetchModels = async () => {
            setLoading(true);
            const response = await fetch(`${endpoints.AI_API_BASE_URL}/models`, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();
            console.log(data)
            if (!data.error) {
                setChatModels(data.data.chat);
                setEmbeddingModels(data.data.embedding);
            } else {
                console.warn("Unexpected response:", data.status);
            }
            setLoading(false);
        }
        fetchModels();
    }, []);

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle sx={{fontWeight: 'bold'}}>New Chatroom</DialogTitle>
            <DialogContent>
                <Box display='flex' p={1} flexDirection='column' gap={2}>
                    <TextField
                        label="Room Name"
                        value={chatroomName}
                        onChange={(e) => setChatroomName(e.target.value)}
                    />
                    <TextField
                        label="Chat Model"
                        value={chatModel ? JSON.stringify(chatModel) : ''}
                        select
                        onChange={(e) => {
                            const model = JSON.parse(e.target.value) as Model;
                            setChatModel(model)
                        }}
                    >
                        {chatModels.map(m => <MenuItem key={m.provider+m.model} value={JSON.stringify(m)}>{m.provider}: {m.model}</MenuItem>)}
                    </TextField>
                    <TextField
                        value={embeddingModel ? JSON.stringify(embeddingModel) : ''}
                        label="Embedding Model"
                        select
                        onChange={(e) => {
                            const model = JSON.parse(e.target.value) as Model;
                            setEmbeddingModel(model)
                        }}
                    >
                        {embeddingModels.map(m => <MenuItem key={m.provider+m.model} value={JSON.stringify(m)}>{m.provider}: {m.model}</MenuItem>)}
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
