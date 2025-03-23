import {
  Box,
  Divider,
  Snackbar
} from "@mui/material";
import { useSelector } from "react-redux";
import MuiAlert from '@mui/material/Alert';
import {
  selectFileLoading,
  selectFileError,
} from "../../redux/selectors";
import CircularProgress from '@mui/material/CircularProgress';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import ChatroomDetails from "./chatroomDetails";
import ChatroomFiles from "./chatroomFiles";
import ChatroomIntegrations from "./chatroomIntegrations";
import { useCallback, useState } from "react";

const ChatroomManager = () => {
  const loading = useSelector(selectFileLoading);
  const error = useSelector(selectFileError);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const showToast = useCallback((message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  }, []);

  if (loading) {
    return <CircularProgress />
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>
  }

  return (
    <Box display="flex" flexDirection="column" gap={2} m={2} flexGrow={1}>
      <ChatroomDetails />
      <Divider />
      <ChatroomFiles showToast={showToast}/>
      <Divider />
      <ChatroomIntegrations />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ zIndex: 1500 }}
      >
        <MuiAlert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          elevation={6}
          variant="filled"
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default ChatroomManager;
