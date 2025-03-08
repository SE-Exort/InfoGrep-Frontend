import React, { useState, useEffect } from 'react';
import { Box, List, ListItem, ListItemText, IconButton, Typography, Divider } from "@mui/material";
import { Delete, Download } from "@mui/icons-material";

interface BackendFile {
  File_UUID: string;
  File_Name: string;
}

interface FileManagerProps {
  chatroom: string;
  sessionImport: string;
  setFileList: React.Dispatch<React.SetStateAction<BackendFile[]>>;
  fileList: BackendFile[];
  fetchFiles: () => void;
}

const FileManager: React.FC<FileManagerProps> = ({ chatroom, sessionImport, setFileList, fileList, fetchFiles }) => {


  useEffect(() => {
    fetchFiles();
  }, [chatroom, sessionImport, setFileList]);

  const handleDelete = async (fileName: string) => {
    await fetch('http://127.0.0.1:8002/api/file?' + new URLSearchParams({
      'chatroom_uuid': chatroom,
      'cookie': sessionImport,
      'file_uuid': fileName,
    }).toString(), { method: 'DELETE' });

    setFileList(fileList.filter(file => file.File_UUID !== fileName));
  };

  const handleItemClick = (file: BackendFile) => {
    console.log(`File clicked: ${file.File_Name}`);
    const fetchFileDownload = async () => {
      const response = await fetch('http://127.0.0.1:8002/api/file?' + new URLSearchParams({
        'chatroom_uuid': chatroom,
        'cookie': sessionImport,
        'file_uuid': file.File_UUID,
      }).toString(), { method: 'GET' });
      
      if (!response.ok) {
        console.error('Error fetching the file:', response.statusText);
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${file.File_Name}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    };
    fetchFileDownload();
  };

  return (
    <Box p={2} bgcolor="#eeeeee">
      <Typography variant="h6">Files: </Typography>
      <Divider />
      {!fileList || fileList.length === 0 ? (
        <Typography variant="body1">No files available.</Typography>
      ) : (
        <List>
          {fileList.map((file, index) => (
            <ListItem 
              key={index} 
              divider
            >
              <ListItemText primary={file.File_Name} />
              <IconButton edge="end" aria-label="download" onClick={() => handleItemClick(file)}>
                <Download />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(file.File_UUID)}>
                <Delete />
              </IconButton>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default FileManager;