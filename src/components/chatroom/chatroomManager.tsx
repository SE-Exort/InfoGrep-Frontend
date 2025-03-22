import {
  Box,
  Divider,
} from "@mui/material";
import { useSelector } from "react-redux";
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

const ChatroomManager = () => {
  const loading = useSelector(selectFileLoading);
  const error = useSelector(selectFileError);

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
      <ChatroomFiles />
      <Divider />
      <ChatroomIntegrations />
    </Box>
  );
};

export default ChatroomManager;
