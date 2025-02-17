import React, { useEffect } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Divider,
} from "@mui/material";
import { Delete, Download } from "@mui/icons-material";
import {
  BackendFile,
  fetchFileDownload,
  deleteFile,
  fetchFiles,
} from "../utils/api";

interface FileManagerProps {
  chatroom: string;
  sessionImport: string;
  setFileList: React.Dispatch<React.SetStateAction<BackendFile[]>>;
  fileList: BackendFile[];
}

const FileManager: React.FC<FileManagerProps> = ({
  chatroom,
  sessionImport,
  setFileList,
  fileList,
}) => {
  useEffect(() => {
    // Fetch the file list when the component mounts
    const loadFiles = async () => {
      try {
        const response = await fetchFiles(chatroom, sessionImport);
        console.log("files", response);
        setFileList(response);
      } catch (error) {
        console.error("Error loading files:", error);
      }
    };
    loadFiles();
  }, [chatroom, sessionImport, setFileList]);

  const handleDelete = async (fileName: string) => {
    try {
      await deleteFile(chatroom, sessionImport, fileName);
      setFileList(fileList.filter((file) => file.File_UUID !== fileName));
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const handleItemClick = async (file: BackendFile) => {
    try {
      console.log(`File clicked: ${file.File_Name}`);
      await fetchFileDownload(chatroom, sessionImport, file);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <Box p={2} bgcolor="#eeeeee">
      <Typography variant="h6">Files: </Typography>
      <Divider />
      <List>
        {fileList.map((file, index) => (
          <ListItem key={index} divider>
            <ListItemText primary={file.File_Name} />
            <IconButton
              edge="end"
              aria-label="download"
              onClick={() => handleItemClick(file)}
            >
              <Download />
            </IconButton>
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => handleDelete(file.File_UUID)}
            >
              <Delete />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default FileManager;
