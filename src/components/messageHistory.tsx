import React, { useState } from 'react';
import { Box, Typography} from '@mui/material';

const MessageHistory = () => {
  const [messages, setMessages] = useState<string[]>([]);

  return (
    <Box display="flex" flexDirection="column" flexGrow={1} p={3}>
      <Box bgcolor="#f0f0d0" p={2} mb={2}>
        <Typography variant="h6">How many majors has tiger won?</Typography>
      </Box>
      <Box flexGrow={1} overflow="auto" maxHeight="60vh" bgcolor="#f0f0d0" p={2}>
        {messages.map((message, index) => (
          <Typography key={index} gutterBottom>
              {message}
            </Typography>
          ))}
      </Box>  
    </Box> 
  );
};

export default MessageHistory;