
import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    Button,
    TextField,
    Autocomplete,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { addIntegrationThunk } from "../../redux/slices/chatSlice";

interface IntegrationDialogProps {
    open: boolean;
    onClose: () => void;
}

const IntegrationDialog: React.FC<IntegrationDialogProps> = ({
    open,
    onClose,
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const [integration, setIntegration] = useState('');
    const [config, setConfig] = useState<any>({});

    const handleSubmit = async () => {
        dispatch(addIntegrationThunk({ integration, config }));
        onClose();
    };

    const Confluence = <>
        <TextField
            label="URL"
            value={config.url ?? ''}
            onChange={(e) => {
                setConfig({ ...config, url: e.target.value })
            }} />
        <TextField
            label="Username"
            value={config.username ?? ''}
            onChange={(e) => {
                setConfig({ ...config, username: e.target.value })
            }} />
        <TextField
            label="Space Key"
            value={config.space_key ?? ''}
            onChange={(e) => {
                setConfig({ ...config, space_key: e.target.value })
            }} />
        <TextField
            label="API Key"
            value={config.api_key ?? ''}
            onChange={(e) => {
                setConfig({ ...config, api_key: e.target.value })
            }} />
    </>

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle sx={{ fontWeight: 'bold' }}>Add new integration</DialogTitle>
            <DialogContent>
                <Box display='flex' p={1} flexDirection='column' gap={2}>
                    <Autocomplete
                        onChange={(_, newValue) => {
                            setIntegration(newValue?.id ?? '');
                            if (!newValue) setConfig({});
                        }}
                        disablePortal
                        options={[{ label: 'Confluence', id: 'confluence' }]}
                        fullWidth
                        renderInput={(params) => <TextField {...params} label="Integration" />}
                    />
                    {integration === 'confluence' && Confluence}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleSubmit} variant="contained">
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default IntegrationDialog;
