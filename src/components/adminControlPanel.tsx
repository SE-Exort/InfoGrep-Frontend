import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Button, TextField, Typography, List, ListItem, ListItemText, IconButton, Paper, InputLabel, FormControl, Select, MenuItem } from '@mui/material';
import { Delete, Add, SyncLock, Save, Download } from '@mui/icons-material';

interface AdminControlPanelProps {
  session: string,
  uuid: string
}
// enum for chat vs embeddings
enum ModelType {
  CHAT = 'chat',
  EMBEDDINGS = 'embeddings'
}

interface ModelInfo {
  model: string;
  provider: string;
}

interface ModelsResponse {
  chat: ModelInfo[];
  embedding: ModelInfo[];
}

interface User {
  id: string;
  username: string;
  password: string;
}

const AdminControlPanel: React.FC<AdminControlPanelProps> = ({ session, uuid }) => {
  const [usernameCreate, setUsernameCreate] = useState<string>('');
  const [passwordCreate, setPasswordCreate] = useState<string>('');
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newUsername, setNewUsername] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [usernameDelete, setUsernameDelete] = useState<string>('');
  const openAIKeyRef = useRef<HTMLInputElement>(null);
  const ollamaLLMNameRef = useRef<HTMLInputElement>(null);
  const ollamaLLMProviderRef = useRef<HTMLInputElement>(null);
  const [selectedModel, setSelectedModel] = useState<ModelInfo | null>(null);
  const [fileList, setFileList] = useState<{ File_UUID: string; File_Name: string, File_Size: number }[]>([]);
  const [modelList, setModelList] = useState<ModelsResponse>({ chat: [], embedding: [] });

  const getUsers = useCallback(async () => {
    try {

      const response = await fetch('http://localhost:4000/admin/users?' + new URLSearchParams({
        'sessionToken': session,
      }).toString(), { method: 'GET' });

      if (!response.ok) {
        throw new Error('Request failed');
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.status);
      }
      console.log('Users:', data);
      setUsers(data.data);
    } catch (error) {
      console.error('UUID error:', error);
    }
  }, [session]);

  const getFilesList = useCallback(async () => {
    try {
      const response = await fetch('http://127.0.0.1:8002/api/admin-all-files?' + new URLSearchParams({
        'cookie': session,
      }).toString(), { method: 'GET' });
      const files = await response.json();
      console.log(files);
      setFileList(files.list);
    } catch (error) {
      console.error('Error fetching the file list:', error);
    }
  }, [session]);

  const getModels = useCallback(async () => {
    try {
      const response = await fetch('http://127.0.0.1:8004/api/models?' + new URLSearchParams({
        'cookie': session,
      }).toString(), { method: 'GET' });
      const models: ModelsResponse = (await response.json()).data;
      console.log('Available models:', models);
      setModelList({
        chat: models?.chat?.map(m => ({ model: m.model, provider: m.provider })) ?? [],
        embedding: models?.embedding?.map(m => ({ model: m.model, provider: m.provider })) ?? []
      });
    } catch (error) {
      console.error('Error fetching the model list:', error);
    }
  }, [session]);

  useEffect(() => {
    // need users?session
    getUsers();
    getModels();
    getFilesList();
  }, [getFilesList, getModels, getUsers]);

  const checkEmail = (email: string) => {
    // if we want to check emails later
    return false;
  }

  const handleCreateUserUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsernameCreate(event.target.value);
  };

  const handleCreateUserPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordCreate(event.target.value);
  };

  const handleCreateUser = async () => {
    // createUser?session,username,password
    try {
      checkEmail(usernameCreate);
      // checkPassword();
      if ((usernameCreate === '' || passwordCreate === '')) {
        throw new Error('Please fill out all fields');
      }
      const username = usernameCreate;
      const password = passwordCreate;
      console.log(JSON.stringify({ usernameCreate, passwordCreate }));
      const response = await fetch(`http://localhost:4000/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.status);
      }
      // setSession(data.data); // dont take session
      // Handle success (e.g., store the token, redirect the user)
      console.log('Login successful:', data.data);
      setUsernameCreate('');
      setPasswordCreate('');
      getUsers();
      // also need to get admin or chat from this
    } catch (error) {
      if (error instanceof Error) {
        // TODO: toast
      }
      console.error('Login error:', error);
    }
  };

  const handleChangePasswordPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(event.target.value);
  };

  const handlePasswordChange = async () => {
    try {
      if (!selectedUser || !newUsername || !newPassword) {
        throw new Error('Please fill out all fields');
      }
      console.log(JSON.stringify({ usernameUpdate: newUsername, passwordUpdate: newPassword }));
      const response = await fetch(`http://localhost:4000/admin/user?` + new URLSearchParams({
        sessionToken: session
      }), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: selectedUser.id, username: newUsername, password: newPassword }),
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.status);
      }
      console.log('Login successful:', data.data);
      setNewUsername('');
      setNewPassword('');
      setSelectedUser(null);
    } catch (error) {
      if (error instanceof Error) {
        // TODO: toast
      }
      console.error('Login error:', error);
    }
  };

  const handleDeleteUser = async () => {
    try {
      if ((usernameDelete === '')) {
        throw new Error('Please fill out all fields');
      }
      const userID = users.find(user => user.username === usernameDelete)?.id;
      console.log(JSON.stringify({ usernameDelete }));
      const response = await fetch(`http://localhost:4000/admin/user?sessionToken=${session}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: userID }),
      });
      if (!response.ok) {
        throw new Error('Request failed');
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.status);
      }
      console.log('Delete successful:', data);
      setUsernameDelete('');
    } catch (error) {
      if (error instanceof Error) {
        // TODO: toast
      }
      console.error('delete error:', error);
    }
    getUsers();
  };

  const handleOpenAIKey = async () => {
    console.log('Setting OpenAI Key:', openAIKeyRef.current?.value);
    // setOpenAIKey?uuid,session
  };


  const updateModels = async (models: ModelsResponse) => {
    try {
      const postResult = await fetch('http://127.0.0.1:8004/api/models?' + new URLSearchParams({
        'sessionToken': session,
      }).toString(), {
        method: 'POST', body: JSON.stringify(models), headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!postResult.ok) {
        throw new Error('Request failed');
      }
      const data = await postResult.json();
      console.log("updateModel Return", data);
    } catch (error) {
      console.error('Error updating models:', error);
    }
    getModels();
  };

  const handleDeleteLLM = async (modelInfo: ModelInfo) => {
    console.log('Deleting model:', modelInfo);

    const newChatModels = modelList?.chat?.filter(m => !(m.model === modelInfo.model && m.provider === modelInfo.provider)) ?? [];
    const newEmbeddingsModels = modelList?.embedding?.filter(m => !(m.model === modelInfo.model && m.provider === modelInfo.provider)) ?? [];

    const updatedModelList: ModelsResponse = {
      chat: newChatModels,
      embedding: newEmbeddingsModels
    };
    updateModels(updatedModelList);
  }

  const handleDownloadLLM = async (modelType: ModelType) => {
    if (!modelType || ollamaLLMNameRef.current?.value === '' || ollamaLLMProviderRef.current?.value === '') return;
    else {
      console.log('Adding model:', modelType, ollamaLLMNameRef.current?.value, ollamaLLMProviderRef.current?.value);

      const newModel = {
        model: ollamaLLMNameRef.current?.value || '',
        provider: ollamaLLMProviderRef.current?.value || ''
      };
      let updatedModelList: ModelsResponse;
      if (modelType === ModelType.CHAT) {
        const newChatModels = [...modelList.chat, newModel];
        updatedModelList = {
          chat: newChatModels,
          embedding: modelList.embedding
        };
      } else {
        const newEmbeddingsModels = [...modelList.embedding, newModel];
        updatedModelList = {
          chat: modelList.chat,
          embedding: newEmbeddingsModels
        }
      }
      updateModels(updatedModelList);
    }

  };

  const handleDeleteFile = async (fileUUID: string) => {
    await fetch('http://127.0.0.1:8002/api/admin-delete-file?' + new URLSearchParams({
      'cookie': session,
      'file_uuid': fileUUID,
    }).toString(), { method: 'DELETE' });

    setFileList(fileList.filter(file => file.File_UUID !== fileUUID));
  };

  return (
    <Box width="100%" bgcolor="#f2f2f2" display="flex" flexDirection="column" gap={1}>
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <Typography variant="h5">Admin Control Panel</Typography>
      </Paper>
      <Box width="100%" bgcolor="#f2f2f2" display="flex" flexDirection="row" flexWrap="wrap" gap={1} overflow="auto">
        <Paper elevation={3} sx={{ p: 2, mb: 2, maxWidth: '400px', minWidth: '250px', flexGrow: 1 }}>
          <Box display="flex" flexDirection="column" gap={2} p={2}>
            <Typography variant="h6">Create an User</Typography>
            <TextField label="Username" variant="outlined" value={usernameCreate} onChange={handleCreateUserUsernameChange}
              error={checkEmail(usernameCreate)} sx={{ maxWidth: '400px' }} />
            <TextField label="Password" variant="outlined" value={passwordCreate} onChange={handleCreateUserPasswordChange} sx={{ maxWidth: '400px' }} />
            <Button variant="contained" color="primary" onClick={handleCreateUser} startIcon={<Add />}>Create</Button>
          </Box>
        </Paper>
        <Paper elevation={3} sx={{ p: 2, mb: 2, maxWidth: '400px', minWidth: '250px', flexGrow: 1 }}>
          <Box display="flex" flexDirection="column" gap={2} p={2}>
            <Typography variant="h6">Change an User's Password</Typography>
            <FormControl variant="outlined" sx={{ maxWidth: '800px' }}>
              <InputLabel id="model-select-label">Users</InputLabel>
              <Select
                labelId="model-select-label"
                label="Models"
                value={selectedUser ? JSON.stringify(selectedUser) : ''}
                onChange={(event) => {
                  const user: User = JSON.parse(event.target.value as string);
                  setSelectedUser(user);
                  setNewUsername(user.username); // TODO: support username changes
                }}
              >
                {users.map((user) => (
                  <MenuItem key={user.id} value={JSON.stringify(user)}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                      {user.username}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField label="Password" variant="outlined" value={newPassword} onChange={handleChangePasswordPasswordChange} sx={{ maxWidth: '400px' }} />
            <Button variant="contained" color="primary" onClick={handlePasswordChange} startIcon={<SyncLock />}>Change Password</Button>
          </Box>
        </Paper>

        <Paper elevation={3} sx={{ p: 2, mb: 2, maxWidth: '400px', minWidth: '250px', flexGrow: 1 }}>
          <Box display="flex" flexDirection="column" gap={2} p={2}>
            <Typography variant="h6">Remove an Account</Typography>
            <FormControl variant="outlined" sx={{ maxWidth: '800px' }}>
              <InputLabel id="model-select-label">Users</InputLabel>
              <Select
                labelId="model-select-label"
                label="Models"
                value={usernameDelete}
                onChange={(event) => setUsernameDelete(event.target.value as string)}
              >
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.username}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                      {user.username}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button variant="contained" color="primary" onClick={handleDeleteUser} startIcon={<Delete />}>Delete</Button>
          </Box>
        </Paper>
        <Paper elevation={3} sx={{ p: 2, mb: 2, maxWidth: '400px', minWidth: '250px', flexGrow: 1 }}>
          <Box display="flex" flexDirection="column" gap={2} p={2}>
            <Typography variant="h6">Set Open AI API Key</Typography>
            <TextField label="Key" variant="outlined" inputRef={openAIKeyRef} sx={{ maxWidth: '800px' }} />
            <Button variant="contained" color="primary" onClick={handleOpenAIKey} startIcon={<Save />}>Save</Button>
          </Box>
        </Paper>
        <Paper elevation={3} sx={{ p: 2, mb: 2, maxWidth: '400px', minWidth: '250px', flexGrow: 1 }}>
          <Box display="flex" flexDirection="column" gap={2} p={2}>
            <Typography variant="h6">Add New LLM Model</Typography>
            <TextField label="Model Name" variant="outlined" inputRef={ollamaLLMNameRef} sx={{ maxWidth: '800px' }} />
            <TextField label="LLM Provider" variant="outlined" inputRef={ollamaLLMProviderRef} sx={{ maxWidth: '800px' }} />
            <Box display="flex" gap={2} flexDirection="row">
              <Button variant="contained" color="primary" onClick={() => handleDownloadLLM(ModelType.CHAT)} startIcon={<Download />}>Download as Chat</Button>
              <Button variant="contained" color="primary" onClick={() => handleDownloadLLM(ModelType.EMBEDDINGS)} startIcon={<Download />}>Download as Embedding</Button>
            </Box>
          </Box>
        </Paper>

        <Paper elevation={3} sx={{ p: 2, mb: 2, maxWidth: '400px', minWidth: '250px', flexGrow: 1 }}>
          <Box display="flex" flexDirection="column" gap={2} p={2}>
            <Typography variant="h6">Remove Model</Typography>
            <FormControl variant="outlined" sx={{ maxWidth: '800px' }}>
              <InputLabel id="model-select-label">Models</InputLabel>
              <Select
                labelId="model-select-label"
                label="Models"
                value={selectedModel ? JSON.stringify(selectedModel) : ''}
                onChange={(event) => setSelectedModel(JSON.parse(event.target.value as string))}
              >
                {modelList?.chat?.concat(modelList?.embedding ?? []).map((model) => (
                  <MenuItem key={model.model} value={JSON.stringify(model)}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                      {`${model.model}\\${model.provider}`}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button variant="contained" color="primary" onClick={() => selectedModel && handleDeleteLLM(selectedModel)} startIcon={<Delete />}>Delete Model</Button>
          </Box>
        </Paper>

        <Paper elevation={3} sx={{ p: 2, mb: 2, maxWidth: '1000px', minWidth: '800px', flexGrow: 1 }}>
          <Box display="flex" flexDirection="column" gap={2} p={2}>
            <Typography variant="h6">Files</Typography>
            <List>
              {fileList.map((file) => (
                <ListItem key={file.File_UUID} divider>
                  <ListItemText primary={file.File_Name} />
                  <ListItemText primary={`${(file.File_Size / 1000000).toFixed(1)}MB`} />
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteFile(file.File_UUID)}>
                    <Delete />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default AdminControlPanel;