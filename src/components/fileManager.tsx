import { useEffect } from "react";
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import { Delete, Download, PlayArrow } from "@mui/icons-material";
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
  selectSelectedChatroom,
} from "../redux/selectors";

const FileManager = () => {
  const dispatch = useDispatch<AppDispatch>();

  const files = useSelector(selectFiles);
  const loading = useSelector(selectFileLoading);
  const error = useSelector(selectFileError);
  const selectedChatroom = useSelector(selectSelectedChatroom);

  useEffect(() => {
    if (selectedChatroom) {
      dispatch(fetchFilesThunk());
    }
  }, [selectedChatroom, dispatch]);

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <List>
        {loading ? (
          <p>Loading files...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          files.map((file) => (
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
          ))
        )}
      </List>
      <Button variant="contained" component="label">
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
