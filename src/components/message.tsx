import React, { useState } from 'react';
import { Box, Button, TextField} from '@mui/material';

const Message = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentMessage(event.target.value);
  };

  const sendMessage = () => {
    if (!currentMessage.trim()) return; // Prevent sending empty messages
    setMessages([...messages, currentMessage]);
    setCurrentMessage(''); // Clear input field after sending
  };

  return (
    <Box display="flex" gap={1} mt={2}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Ask me anything..."
        value={currentMessage}
        onChange={handleInputChange}
        onKeyPress={(event) => {
        if (event.key === 'Enter') {
          sendMessage();
        }
      }}
      />
      <Button variant="contained" color="primary" onClick={sendMessage}>
        Send
      </Button>
    </Box>
  );
};

export default Message;