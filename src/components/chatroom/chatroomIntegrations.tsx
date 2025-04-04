import { useDispatch, useSelector } from "react-redux";
import { selectChatroomIntegrations } from "../../redux/selectors";
import { Box, Divider, IconButton, List, ListItem, ListItemButton, ListItemText, Tooltip, Typography, useTheme } from "@mui/material";
import ElectricalServicesIcon from '@mui/icons-material/ElectricalServices';
import { useState } from "react";
import IntegrationDialog from "./integrationDialog";
import { Delete } from '@mui/icons-material';
import InfoIcon from '@mui/icons-material/Info';
import { AppDispatch } from "../../redux/store";
import { deleteIntegrationThunk, parseIntegrationThunk } from "../../redux/slices/chatSlice";
import SyncIcon from '@mui/icons-material/Sync';

const ChatroomIntegrations = () => {
    const integrations = useSelector(selectChatroomIntegrations);
    const [show, setShow] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const theme = useTheme();

    return (
        <Box
            display="flex"
            gap={1}
            flexDirection="column"
            sx={{
                backgroundColor: theme.palette.background.default,
                color: theme.palette.text.primary,
                p: 2,
                borderRadius: 2,
            }}
        >
            <Box display="flex" justifyContent="space-between">
                <Typography>Integrations</Typography>
                <IconButton onClick={() => setShow(true)}>
                <ElectricalServicesIcon />
                </IconButton>
            </Box>

            {integrations.length > 0 && 
                <Box
                    sx={{
                        width: "100%",
                        backgroundColor: theme.palette.background.paper,
                        color: theme.palette.text.primary,
                        borderRadius: 2,
                        p: 1,
                    }}
         >   
                <List>
                    {integrations.map((integration) =>
                        <ListItem disablePadding key={integration.id} sx={{ display: 'flex', justifyContent: 'space-between', backgroundColor: theme.palette.background.paper, color: theme.palette.text.primary,}}>
                            <ListItemText primary={integration.integration} sx={{ ml: 2, width: '100%' }} />
                            <Tooltip title={JSON.stringify(integration.config)}>
                                <IconButton>
                                    <InfoIcon />
                                </IconButton>
                            </Tooltip>
                            <ListItemButton onClick={() => dispatch(parseIntegrationThunk({ integration: integration.integration, config: integration.config }))}>
                                <SyncIcon />
                            </ListItemButton >
                            <ListItemButton onClick={() => dispatch(deleteIntegrationThunk(integration.id))}>
                                <Delete />
                            </ListItemButton>
                        </ListItem>)}
                </List>
                <Divider />
            </Box>}
            <IntegrationDialog open={show} onClose={() => setShow(false)} />
            {!integrations.length && <Typography variant="caption">No integrations yet, go add some!</Typography>}
        </Box>
    );
};

export default ChatroomIntegrations;