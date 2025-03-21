import { Box, Paper, Typography } from "@mui/material";
import TextPullUp from "./textPullUp";

const WelcomeScreen = () => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100vh"
            bgcolor="background.default"
            width="100%"
            pt={8}
            gap={1}
        >
            <TextPullUp text="Welcome to InfoGrep!" />
            <Paper
                sx={{
                    maxWidth: '800px',
                    mx: 'auto',
                    px: 4,
                    py: 3,
                    borderRadius: 2,
                    bgcolor: 'background.paper',
                }}
            >
                <Typography
                    variant="body1"
                    paragraph
                    sx={{ mb: 2 }}
                    color="primary"
                >
                    Create a new chatroom using the sidebar to start chatting. You can upload files and connect integrations for a better experience!
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: 2,
                        mt: 3,
                        alignItems: 'flex-start'
                    }}
                >
                    <Box
                        sx={{
                            flex: 1,
                            p: 2,
                            bgcolor: 'background.highlight',
                            borderRadius: 1,
                            border: '1px dashed',
                            borderColor: 'primary.light'
                        }}
                    >
                        <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
                            Step 1
                        </Typography>
                        <Typography variant="body2" color="primary">
                            Create or select a chatroom from the sidebar menu to begin
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            flex: 1,
                            p: 2,
                            bgcolor: 'background.highlight',
                            borderRadius: 1,
                            border: '1px dashed',
                            borderColor: 'primary.light'
                        }}
                    >
                        <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
                            Step 2
                        </Typography>
                        <Typography variant="body2" color="primary">
                            Upload files using the File List button to analyze your documents
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            flex: 1,
                            p: 2,
                            bgcolor: 'background.highlight',
                            borderRadius: 1,
                            border: '1px dashed',
                            borderColor: 'primary.light'
                        }}
                    >
                        <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
                            Step 3
                        </Typography>
                        <Typography variant="body2" color="primary">
                            Ask questions about your documents using the chat interface
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
}

export default WelcomeScreen;