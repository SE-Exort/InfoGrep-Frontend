import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, TextField, Typography, List, ListItem, ListItemText, IconButton, Divider, Paper, Autocomplete, InputLabel, FormControl, Select, MenuItem } from '@mui/material';
import { Delete, Add, Menu, SyncLock, Save, Download } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

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
  chat?: ModelInfo[];
  embeddings?: ModelInfo[]; 
}


const AdminControlPanel: React.FC<AdminControlPanelProps> = ({ session, uuid }) => {
//   const [session, setSession] = useState<string>('');
  const modelsDefault = ['Model A', 'Model B', 'Model C', 'Model D']; // get from backend in future
  // const userDefault = ['User A', 'User B', 'User C', 'User D']; // get from backend in future

  const [usernameCreate, setUsernameCreate] = useState<string>('');
  const [passwordCreate, setPasswordCreate] = useState<string>('');
  const [users, setUsers] = useState<{ id: string, username: string, password: string}[]>([]);
  const [usernameUpdate, setUsernameUpdate] = useState<string>('');
  const [passwordUpdate, setPasswordUpdate] = useState<string>('');
  const [usernameDelete, setUsernameDelete] = useState<string>('');
  const openAIKeyRef = useRef<HTMLInputElement>(null);
  const huggingFaceLLMNameRef = useRef<HTMLInputElement>(null);
  const huggingFaceLLMProviderRef = useRef<HTMLInputElement>(null);
  const [selectedModels, setSelectedModels] = useState<string[]>(modelsDefault);
  const [selectedModel, setSelectedModel] = useState<ModelInfo | null>(null);
  const [fileList, setFileList] = useState<{ File_UUID: string; File_Name: string, File_Size: number }[]>([]);
  const [modelList, setModelList] = useState<ModelsResponse>({});
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorDesc, setPasswordErrorDesc] = useState('');



  const getUsers = async () => {
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
  };

  const getFilesList = async () => {
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
  };

  const getModels = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8004/models?' + new URLSearchParams({
        'cookie': session,
      }).toString(), { method: 'GET' });
      const models: ModelsResponse = await response.json();
      console.log('Available models:', models);
      setModelList(models);
    } catch (error) {
      console.error('Error fetching the model list:', error);
    }
  };

  useEffect(() => {
    // need users?session
    getUsers();
    getModels();
    getFilesList();
  }, []);

  const checkEmail = (email: string) => {
    // if we want to check emails later
    return false;
  }
  
  const handleLogin = async (uuid: string) => {
    // changeSessionId?session,uuid
  };

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
      if((usernameCreate == '' || passwordCreate == '')){
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
        setPasswordError(true);
        setPasswordErrorDesc(error.message);
      }
      console.error('Login error:', error);
    }
  };

  const handleChangePasswordUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsernameUpdate(event.target.value);
  };

  const handleChangePasswordPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordUpdate(event.target.value);
  };
  
  const handlePasswordChange = async () => {
    try {
      // checkPassword();
      if((usernameUpdate == '' || passwordUpdate == '')){
        throw new Error('Please fill out all fields');
      } 
      const username = usernameUpdate;
      const password = passwordUpdate;
      console.log(JSON.stringify({ usernameUpdate, passwordUpdate }));
      const response = await fetch(`http://localhost:4000/admin/user`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ session, username, password }),
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }
      
      const data = await response.json();

      if (data.error) {
        throw new Error(data.status);
      }
      console.log('Login successful:', data.data);
      setUsernameUpdate('');
      setPasswordUpdate(''); 
    } catch (error) {
      if (error instanceof Error) {
        setPasswordError(true);
        setPasswordErrorDesc(error.message);
      }
      console.error('Login error:', error);
    }
  };

  const handleDeleteUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsernameDelete(event.target.value);
  };

  const handleDeleteUser = async () => {
    try {
      if((usernameDelete == '')){
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
        setPasswordError(true);
        setPasswordErrorDesc(error.message);
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
        'cookie': session,
        'models': JSON.stringify(models),
      }).toString(), {method: 'POST'}); // FIX
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
    if (!modelInfo) return;
      console.log('Deleting model:', modelInfo);

      const newChatModels = modelList.chat ? 
      modelList.chat.filter(m => !(m.model === modelInfo.model && m.provider === modelInfo.provider)) : [];
      const newEmbeddingsModels = modelList.embeddings ? 
      modelList.embeddings.filter(m => !(m.model === modelInfo.model && m.provider === modelInfo.provider)) : [];

      const updatedModelList: ModelsResponse = {
      chat: newChatModels,
      embeddings: newEmbeddingsModels
      };
      updateModels(updatedModelList);
  }

  const handleDownloadLLM = async (modelType: ModelType) => {
    if (!modelType || huggingFaceLLMNameRef.current?.value == '' || huggingFaceLLMProviderRef.current?.value == '') return;
    else {
      console.log('Adding model:', modelType, huggingFaceLLMNameRef.current?.value, huggingFaceLLMProviderRef.current?.value);

      const newModel = {
        model: huggingFaceLLMNameRef.current?.value || '',
        provider: huggingFaceLLMProviderRef.current?.value || ''
      };
      let updatedModelList: ModelsResponse;
      if(modelType === ModelType.CHAT) {
        const newChatModels = modelList.chat ? [...modelList.chat, newModel] : [newModel];
        updatedModelList = {
          chat: newChatModels,
          embeddings: modelList.embeddings
        };
      } else if (modelType === ModelType.EMBEDDINGS) {
        const newEmbeddingsModels = modelList.embeddings ? [...modelList.embeddings, newModel] : [newModel];
        updatedModelList = {
          chat: modelList.chat,
          embeddings: newEmbeddingsModels
      }
      updateModels(updatedModelList);
    }
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
      <Paper elevation={3}  sx={{ p: 2, mb: 2 }}>    
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
                value={usernameUpdate}
                onChange={(event) => setUsernameUpdate(event.target.value as string)}
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
            <TextField label="Password" variant="outlined" value={passwordUpdate} onChange={handleChangePasswordPasswordChange} sx={{ maxWidth: '400px' }} />
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
            <Typography variant="h6">Download new LLM Models</Typography>
            <TextField label="Hugging Face LLM Name" variant="outlined" inputRef={huggingFaceLLMNameRef} sx={{ maxWidth: '800px' }} /> 
            <TextField label="Hugging Face LLM Provider" variant="outlined" inputRef={huggingFaceLLMProviderRef} sx={{ maxWidth: '800px' }} />
            <Box display="flex" gap={2} flexDirection="row"> 
              <Button variant="contained" color="primary" onClick={() => handleDownloadLLM(ModelType.CHAT)} startIcon={<Download />}>Download as Chat</Button>
              <Button variant="contained" color="primary" onClick={() => handleDownloadLLM(ModelType.EMBEDDINGS)} startIcon={<Download />}>Download as Embedding</Button>
            </Box>
          </Box>
        </Paper>
        
        {/* <Paper elevation={3} sx={{ p: 2, mb: 2, maxWidth: '400px', minWidth: '250px', flexGrow: 1 }}>   
          <Box display="flex" flexDirection="column" gap={2} p={2}>
            <Typography variant="h6">Select models to show to users</Typography>
            <Autocomplete
              multiple
              options={selectedModels}
              getOptionLabel={(option) => option}
              value={selectedModels}
              onChange={(event, newValue) => setSelectedModels(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Models"
                  placeholder="Select models"
                />
              )}
              sx={{ maxWidth: '800px' }}
            />
            <Button variant="contained" color="primary" onClick={() => console.log("saving:", selectedModels)} startIcon={<Save />}>Save</Button>
          </Box>
        </Paper> */ }

        <Paper elevation={3} sx={{ p: 2, mb: 2, maxWidth: '400px', minWidth: '250px', flexGrow: 1 }}>   
          <Box display="flex" flexDirection="column" gap={2} p={2}>
            <Typography variant="h6">Remove Models</Typography>
            <FormControl variant="outlined" sx={{ maxWidth: '800px' }}>
              <InputLabel id="model-select-label">Models</InputLabel>
              <Select
                labelId="model-select-label"
                label="Models"
                value={selectedModel}
                onChange={(event) => setSelectedModel(JSON.parse(event.target.value as string))}
              >
                {modelList.chat && modelList.chat.map((model) => (
                  <MenuItem key={model.model} value={model.provider}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                      {`${model.model}\\${model.provider}`}
                    </Box>
                  </MenuItem>
                ))}
                {modelList.embeddings && modelList.embeddings.map((model) => (
                  <MenuItem key={model.model} value={model.provider}>
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
      {/* <List>
      {chatrooms.map((cr, index) => (
        <Box key={cr.CHATROOM_UUID} sx={{ bgcolor: 'secondary.main', borderRadius: '4px', mb: 1 }}>
          <ListItem secondaryAction={
            <IconButton edge="end" aria-label="delete" onClick={() => deleteChatroom(cr.CHATROOM_UUID)}> 
              <Delete />
            </IconButton>
          }
          onClick={() => setChatroom(cr.CHATROOM_UUID)}>
            <ListItemText primary={cr.CHATROOM_NAME} 
              sx={{ color: 'primary.contrastText', 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis', 
                  whiteSpace: 'nowrap' }} />
          </ListItem>
        </Box>
      ))}
          </List> */}
    </Box>
  );
};

export default AdminControlPanel;