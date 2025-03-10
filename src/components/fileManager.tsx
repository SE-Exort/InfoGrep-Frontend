import { useEffect, useState } from "react";
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
} from "@mui/material";
import { Delete, Download, UploadFile } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../redux/store";
import {
  fetchFilesThunk,
  uploadFileThunk,
  deleteFileThunk,
  fetchFileDownloadThunk,
} from "../redux/slices/fileSlice";
import {
  selectFiles,
  selectFileLoading,
  selectFileError,
  selectCurrentChatroomID,
  selectSession,
} from "../redux/selectors";
import CircularProgress from '@mui/material/CircularProgress';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { BackendFile, FILE_API_BASE_URL } from "../utils/api";
import { pdfjs } from "react-pdf";
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.3.136/pdf.worker.min.mjs`;

const FileManager = () => {
  const dispatch = useDispatch<AppDispatch>();

  const files = useSelector(selectFiles);
  const loading = useSelector(selectFileLoading);
  const error = useSelector(selectFileError);
  const selectedChatroomID = useSelector(selectCurrentChatroomID);
  const session = useSelector(selectSession);
  const [currentFile, setCurrentFile] = useState<BackendFile | null>(null);

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
              {/* Let's do this automatically for the user... */}

              {/* <IconButton
                onClick={() => dispatch(startParsingThunk(file.File_UUID))}
              >
                <PlayArrow />
              </IconButton> */}
              <IconButton
                onClick={() => setCurrentFile(file)}
              >
                <VisibilityIcon />
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
      {currentFile ?
        <Dialog open={true} onClose={() => setCurrentFile(null)} fullWidth>
          <DialogTitle id="alert-dialog-title">
            {currentFile.File_Name}
          </DialogTitle>
          <DocViewer documents={[{
            uri: `${FILE_API_BASE_URL}/file?` +
              new URLSearchParams({
                chatroom_uuid: selectedChatroomID,
                cookie: session,
                file_uuid: currentFile.File_UUID,
              })
          }]} pluginRenderers={DocViewerRenderers} config={{ header: { disableHeader: true } }} />
        </Dialog> : <></>
      }

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
