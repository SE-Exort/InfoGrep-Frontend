import styled from "@emotion/styled";
import profile from "../assets/profile.png";
import logo from "../assets/infogrep_logo.png";
import { Send } from "@mui/icons-material";
import {
  Avatar,
  Box,
  IconButton,
  InputBase,
  Paper,
  Stack,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import axios from "axios";

const Message = styled(Box)({
  display: "flex",
  flexDirection: "row",
  gap: 20,
  padding: 2,
});

type MessageType = {
  sender: "user" | "infogrep";
  text: string;
};

const Chatroom = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission refresh
    if (!inputValue.trim()) return;

    const userMessage: MessageType = {
      sender: "user",
      text: inputValue,
    };

    // add user's message to the chat
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue(""); // clear input field

    try {
      setIsTyping(true);
      // send query to the backend
      const response = await axios.post(`http://${import.meta.env.VITE_VECTOR_SERVICE_URL}/demo/query`, {
        query: inputValue,
      });

      // infogrep's response
      const botMessage: MessageType = {
        sender: "infogrep",
        text:
          response.status === 200
            ? response.data.payload || "No response from server"
            : "Unexpected response from server",
      };

      // add backend response to chat
      setMessages((prevMessages) => [...prevMessages, botMessage]); //adding to the text array
    } catch (error) {
      console.error("Error sending query:", error);
      const errorMessage: MessageType = {
        sender: "infogrep",
        text: "An error occurred. Please try again later.",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]); // adding to the text array
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <Stack direction={"column"} spacing={2} sx={{ alignItems: "center" }}>
      {/* chat title */}
      <Box
        sx={{
          backgroundColor: "primary.dark",
          width: "100%",
          textAlign: "center",
          padding: 1,
        }}
      >
        <Typography variant="h4" color="white">
          Chatroom Name
        </Typography>
      </Box>
      {/* the chat */}
      <Box
        sx={{
          maxHeight: "84.5vh",
          overflowY: "auto",
          width: "64.5vw",
          padding: 2,
        }}
      >
        {messages.map((message, index) => (
          <Message
            key={index}
            sx={{
              justifyContent:
                message.sender === "user" ? "flex-end" : "flex-start", // choose which side the text will appear based on who is talking
            }}
          >
            {message.sender === "infogrep" && <Avatar src={logo} />}
            <Paper
              sx={{
                padding: 2,
                backgroundColor:
                  message.sender === "user" ? "#FBEFD9" : "#E1F5FE", // choose color of text bubbly based on who is talking
                maxWidth: "70%",
              }}
            >
              <Typography variant="body1">{message.text}</Typography>
            </Paper>
            {message.sender === "user" && <Avatar src={profile} />}
          </Message>
        ))}
        {/* loading animation */}
        {isTyping && (
          <Message sx={{ justifyContent: "flex-start" }}>
            <Avatar src={logo} />
            <Paper
              sx={{
                padding: 2,
                backgroundColor: "#E1F5FE",
                maxWidth: "70%",
                display: "flex",
                alignItems: "center",
              }}
            >
              <CircularProgress size={20} sx={{ marginRight: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Typing...
              </Typography>
            </Paper>
          </Message>
        )}
      </Box>

      {/* text box */}
      <Paper
        component="form"
        onSubmit={handleSendMessage}
        sx={{
          position: "fixed",
          bottom: 20,
          p: "2px 4px",
          display: "flex",
          alignItems: "center",
          width: "50vw",
          maxWidth: 1000,
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Message InfoGrep"
          inputProps={{ "aria-label": "message infogrep" }}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <IconButton type="submit" sx={{ p: "10px" }} aria-label="send">
          <Send />
        </IconButton>
      </Paper>
    </Stack>
  );
};

export default Chatroom;
