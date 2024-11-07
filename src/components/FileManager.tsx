import { useState } from "react";
import styled from "@emotion/styled";
import { Attachment, UploadFile } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  List,
  ListItem,
  Stack,
  Typography,
} from "@mui/material";
import axios from "axios";

type FileLink = {
  url: string;
  name: string;
};

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const FileManager = () => {
  const [fileLinks, setFileLinks] = useState<FileLink[]>([]); // array of FileLink
  const [loading, setLoading] = useState(false); // loading state

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]; // get the selected file
    if (!file) return;

    const formData = new FormData();
    formData.append("text_file", file); // match backend field name

    setLoading(true); // start loading spinner

    try {
      const response = await axios.post(
        "http://127.0.0.1:61940/demo/document_save",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // set content type
          },
        }
      );
      //fd
      console.log("Response data:", response.data); // log backend response

      // make sure response struct is correct + parse the uploaded link
      const uploadedLink: FileLink = {
        url: response.data.fileLink || response.data.url || "#", // adjust for backend response
        name: response.data.fileName || file.name, // use file name from the backend or use local file name
      };

      // update fileLinks state
      setFileLinks((prevLinks) => [...prevLinks, uploadedLink]);
    } catch (error: any) {
      console.error("Error uploading file:", error.response || error.message);
    } finally {
      setLoading(false); // stop loading spinner
    }
  };

  return (
    <Stack direction={"column"} spacing={2}>
      {/* File & Links title */}
      <Box
        sx={{
          flexDirection: "row",
          display: "flex",
          justifyContent: "flex-start",
          borderBottom: "1px solid",
        }}
      >
        <Attachment sx={{ width: 40, height: 40 }} />
        <Typography color="primary.dark" p={1}>
          Files & Links
        </Typography>
      </Box>
      {/* where the list of files are stored */}
      <List sx={{ maxHeight: "83vh", overflowY: "auto" }}>
        {/* sample link */}
        <ListItem>
          <a
            href="https://example.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://example.com
          </a>
        </ListItem>
        {/* have loading animation inplace of response when waiting on the response */}
        {loading ? (
          <ListItem>
            <CircularProgress size={24} />
            <Typography sx={{ ml: 2, color: "primary.dark" }}>
              Uploading...
            </Typography>
          </ListItem>
        ) : (
          fileLinks.map((file, index) => (
            <ListItem key={index}>
              {file.url && file.name ? (
                <a href={file.url} target="_blank" rel="noopener noreferrer">
                  {file.name}
                </a>
              ) : (
                <Typography color="error">Invalid file link</Typography>
              )}
            </ListItem>
          ))
        )}
      </List>

      {/* upload button */}
      <Box position="relative">
        <Button
          component="label"
          tabIndex={-1}
          startIcon={<UploadFile />}
          sx={{
            color: "white",
            backgroundColor: "primary.dark",
            position: "fixed",
            bottom: 20,
            p: "4px 4px",
            display: "flex",
            width: "15vw",
          }}
          disabled={loading} // disable button while loading
        >
          <VisuallyHiddenInput type="file" onChange={handleFileUpload} />
          <Typography> Upload File</Typography>
        </Button>
      </Box>
    </Stack>
  );
};

export default FileManager;
