import { useState, useCallback } from "react";
import {
    Box,
    Button,
    List,
    ListItem,
    IconButton,
    Typography,
    Dialog,
    DialogTitle,
    Divider
} from "@mui/material";
import { Delete, Download, UploadFile } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../redux/store";
import {
    uploadFileThunk,
    deleteFileThunk,
    fetchFileDownloadThunk,
    removeEmbeddingThunk,
} from "../../redux/slices/fileSlice";
import {
    selectFiles,
    selectCurrentChatroomID,
    selectSession,
} from "../../redux/selectors";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { BackendFile, FILE_API_BASE_URL } from "../../utils/api";
import { pdfjs } from "react-pdf";
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.3.136/pdf.worker.min.mjs`;

const ChatroomFiles = ({ showToast }: { showToast: (msg: string, severity: 'success' | 'error') => void }) => {
    const dispatch = useDispatch<AppDispatch>();

    const files = useSelector(selectFiles);
    const selectedChatroomID = useSelector(selectCurrentChatroomID);
    const session = useSelector(selectSession);
    const [currentFile, setCurrentFile] = useState<BackendFile | null>(null);

    return (
        <Box display="flex" flexDirection="column" gap={2}>
            <Typography>Files</Typography>
            <List sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', bgcolor: 'background.paper' }}>
                {!files.length && <Typography color="primary.main" >No files available</Typography>}
                {files.length > 0 && files.map((file, i) => (
                    <>
                        {i !== 0 && <Divider />}
                        <ListItem key={file.File_UUID} sx={{ pr: 0, flexGrow: 1, maxWidth: '26vw', display: 'flex', justifyContent: 'space-between' }}>
                            <Typography noWrap color="primary.main">{file.File_Name}</Typography>
                            <Box display='flex' >
                                <IconButton
                                    onClick={() => dispatch(fetchFileDownloadThunk(file))}
                                >
                                    <Download />
                                </IconButton>
                                <IconButton
                                    onClick={() => setCurrentFile(file)}
                                >
                                    <VisibilityIcon />
                                </IconButton>
                                <IconButton
                                    onClick={() => {
                                        dispatch(deleteFileThunk(file.File_UUID))
                                            .unwrap()
                                            .then(() => {
                                                dispatch(removeEmbeddingThunk(file.File_UUID));
                                                showToast("File deleted successfully!", "success");
                                            })
                                            .catch(() => {
                                                showToast("Failed to delete file.", "error");
                                            });
                                    }}
                                >
                                    <Delete />
                                </IconButton>
                            </Box>
                        </ListItem>
                    </>
                ))}
            </List>
            {currentFile ?
                <Dialog open={true} onClose={() => setCurrentFile(null)} fullWidth>
                    <DialogTitle id="alert-dialog-title" noWrap>
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
                </Dialog> : null
            }

            <Button variant="contained" component="label" startIcon={<UploadFile />} fullWidth>
                Upload File
                <input
                    type="file"
                    hidden
                    onChange={(e) => {
                        if (e.target.files?.[0]) {
                            dispatch(uploadFileThunk(e.target.files[0]))
                                .unwrap()
                                .then(() => {
                                    showToast("File uploaded successfully!", "success");
                                })
                                .catch(() => {
                                    showToast("Failed to upload file.", "error");
                                });
                        }
                    }}
                />
            </Button>
        </Box>
    );
};

export default ChatroomFiles;
