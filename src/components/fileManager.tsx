import { useEffect } from "react";
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
} from "@mui/material";
import { Delete, Download, PlayArrow, UploadFile } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../redux/store";
import {
  fetchFilesThunk,
  uploadFileThunk,
  deleteFileThunk,
  fetchFileDownloadThunk,
  startParsingThunk,
} from "../redux/slices/fileSlice";
import {
  selectFiles,
  selectFileLoading,
  selectFileError,
  selectCurrentChatroomID,
} from "../redux/selectors";
import CircularProgress from '@mui/material/CircularProgress';

const FileManager = () => {
  const dispatch = useDispatch<AppDispatch>();

  const files = useSelector(selectFiles);
  const loading = useSelector(selectFileLoading);
  const error = useSelector(selectFileError);
  const selectedChatroomID = useSelector(selectCurrentChatroomID);

  useEffect(() => {
    if (selectedChatroomID) {
      dispatch(fetchFilesThunk());
    }
  }, [selectedChatroomID, dispatch]);

  if (!selectedChatroomID) {
    return <Box display="flex" flexDirection="column" justifyContent='center' alignItems='center' flexGrow={1}>
      <Typography>Please select a chatroom first</Typography>
    </Box>
  }
  return (
    <Box display="flex" flexDirection="column" gap={2} flexGrow={1} m={2} alignItems='center'>
      <List>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          (files?.length ? files?.map((file) => (
            <ListItem key={file.File_UUID}>
              <ListItemText primary={file.File_Name} />
              <IconButton
                onClick={() => dispatch(fetchFileDownloadThunk(file))}
              >
                <Download />
              </IconButton>
              <IconButton
                onClick={() => dispatch(startParsingThunk(file.File_UUID))}
              >
                <PlayArrow />
              </IconButton>
              <IconButton
                onClick={() => dispatch(deleteFileThunk(file.File_UUID))}
              >
                <Delete />
              </IconButton>
            </ListItem>
          )) : <Typography>No files available</Typography>)
        )}
      </List>
      <Button variant="contained" component="label" startIcon={<UploadFile />} fullWidth>
        Upload File
        <input
          type="file"
          hidden
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              dispatch(uploadFileThunk(e.target.files[0]));
            }
          }}
        />
      </Button>
    </Box>
  );
};

export default FileManager;
