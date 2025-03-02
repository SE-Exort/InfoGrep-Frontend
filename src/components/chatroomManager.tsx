import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { Delete, Add, Menu } from '@mui/icons-material';
import ModelSelectorDialog from './modelSelector';

interface Chatroom {
  CHATROOM_UUID: string;
  CHATROOM_NAME: string;
}
interface ChatroomManagerProps {
  sessionImport: string;
  setChatroom: React.Dispatch<React.SetStateAction<string>>;
  setChatroomName: React.Dispatch<React.SetStateAction<string>>;
}

const ChatroomManager: React.FC<ChatroomManagerProps> = ({ sessionImport, setChatroom, setChatroomName }) => {
  const [session, setSession] = useState<string>('');
  const [uuid, setUUID] = useState<string>('');
  const [chatrooms, setChatrooms] = useState<Chatroom[]>([]);
  const [minimized, setMinimized] = useState<boolean>(false);
  const [selectedChatroom, setSelectedChatroom] = useState<string>('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const handleSelectChatroom = (id: string, name: string) => {
    setSelectedChatroom(id);
    setChatroom(id);
    setChatroomName(name);
  };

  const minimizePanel = () => {
    minimized ? setMinimized(false) : setMinimized(true);
  };

  const getUUID = useCallback(async () => {
    try {
      const sessionToken = session;
      console.log(JSON.stringify({ sessionToken }));
      const response = await fetch(`http://localhost:4000/check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionToken }),
      });
      if (!response.ok) {
        throw new Error('Request failed');
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.status);
      }
      setUUID(data.data);
      console.log('UUID:', data.data);
    } catch (error) {
      console.error('UUID error:', error);
    }
  }, [session]);

  const newChatroom = async (chatroomName: string, chatModel: string, embeddingModel: string) => {
    try {
      const cookie = session;
      // const response = await fetch(`http://localhost:8003/api/room?` + new URLSearchParams({ cookie }).toString());
      const response = await fetch(`http://localhost:8003/api/room?` + new URLSearchParams({ cookie, chat_model: chatModel, embedding_model: embeddingModel, provider: 'ollama', chatroom_name: chatroomName }).toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded', // or 'application/json' if sending JSON data
        },
        body: new URLSearchParams({ cookie }).toString() // Send the data in the body
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.status);
      }
      console.log('Chatroom creation successful:', data, data.list);

      const {id: newRoomID, name: newRoomName} = data;
      //set the cur chat to newly created
      setChatroom(newRoomID);
      handleSelectChatroom(newRoomID, newRoomName);

      getChatrooms();
    } catch (error) {
      console.error('Chatroom creation error:', error);
    }
  };

  useEffect(() => {
    setSession(sessionImport);
  }, [sessionImport]);

  useEffect(() => {
    if (session) {
      getUUID();
    }
  }, [getUUID, session]);

  const getChatrooms = useCallback(async () => {
    try {
      const cookie = session;
      const response = await fetch(`http://localhost:8003/api/rooms?` + new URLSearchParams({ cookie }).toString());
      if (!response.ok) {
        throw new Error('Request failed');
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.status);
      }

      setChatrooms(data.list);
      // if (data?.list?.length) {
      //   setChatroom(data.list[0].CHATROOM_UUID)
      // }
      console.log('Chatroom grep successful:', data.list);
    } catch (error) {
      console.error('Chatroom grep error:', error);
    }
  }, [session]);

  useEffect(() => {
    if (uuid) {
      getChatrooms();
    }
  }, [getChatrooms, uuid]);



  const deleteChatroom = async (chatroom_uuid: string) => {
    try {
      const cookie = session;
      // const response = await fetch(`http://localhost:8003/api/room?` + new URLSearchParams({ cookie }).toString());
      const response = await fetch(`http://localhost:8003/api/room?` + new URLSearchParams({ chatroom_uuid, cookie }).toString(), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded', // or 'application/json' if sending JSON data
        },
        body: new URLSearchParams({ chatroom_uuid, cookie }).toString() // Send the data in the body
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.status);
      }
      console.log('Chatroom delete successful:', data);
      getChatrooms();
    } catch (error) {
      console.error('Chatroom delete error:', error);
    }
  };

  return (
    <Box width={minimized ? `max(133px, 40%)` : "100%"} bgcolor="#e0e0e0" display="flex" flexDirection="column" gap={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Button variant="contained" color="primary" onClick={minimizePanel}>
          <Menu />
        </Button>
        <Button variant="contained" color="primary" onClick={() => setCreateDialogOpen(true)}>
          <Add />
        </Button>
      </Box>
      <List>
        {chatrooms.map((cr, index) => (
          <Box key={cr.CHATROOM_UUID} sx={{
            bgcolor: cr.CHATROOM_UUID !== selectedChatroom ? 'secondary.main' : 'rgb(0 0 0 / 23%)',
            borderRadius: '4px',
            mb: 1,
            border: cr.CHATROOM_UUID === selectedChatroom
              ? '2px solid #096908;'
              : '1px solid transparent',
          }}>
            <ListItem selected={cr.CHATROOM_UUID === selectedChatroom} secondaryAction={
              <IconButton edge="end" aria-label="delete" onClick={() => deleteChatroom(cr.CHATROOM_UUID)}>
                <Delete />
              </IconButton>
            }
              onClick={() => handleSelectChatroom(cr.CHATROOM_UUID, cr.CHATROOM_NAME)}>
              <ListItemText primary={cr.CHATROOM_NAME}
                sx={{
                  color: 'primary.contrastText',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }} />
            </ListItem>
          </Box>
        ))}
      </List>
      <ModelSelectorDialog onClose={() => setCreateDialogOpen(false)} open={createDialogOpen} newChatroom={newChatroom}/>
    </Box>
  );
};

export default ChatroomManager;