import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Button, TextField, Typography, List, ListItem, ListItemText, IconButton, Paper, Autocomplete, Snackbar, Alert, Grid } from '@mui/material';
import { Delete, Add, SyncLock, Save, Download } from '@mui/icons-material';
import * as endpoints from '../../utils/api';

import { selectSession } from "../../redux/selectors";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';


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

interface ProviderConfig {
  provider: string;
  displayName: string;
  fields: {
    key: string;
    label: string;
    type?: string;
  }[];
}

const PROVIDER_CONFIGS: ProviderConfig[] = [
  {
    provider: "openai",
    displayName: "OpenAI",
    fields: [
      { key: "api_key", label: "API Key" }
    ]
  },
  {
    provider: "cloudflare",
    displayName: "Cloudflare",
    fields: [
      { key: "api_token", label: "API Token" },
      { key: "account_id", label: "Account ID" }
    ]
  },
];

const AdminControlPanel: React.FC = () => {
  const [usernameCreate, setUsernameCreate] = useState<string>('');
  const [passwordCreate, setPasswordCreate] = useState<string>('');
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newUsername, setNewUsername] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [usernameDelete, setUsernameDelete] = useState<string>('');
  const ollamaLLMNameRef = useRef<HTMLInputElement>(null);
  const ollamaLLMProviderRef = useRef<HTMLInputElement>(null);
  const [selectedModel, setSelectedModel] = useState<ModelInfo | null>(null);
  const [fileList, setFileList] = useState<{ File_UUID: string; File_Name: string, File_Size: number }[]>([]);
  const [modelList, setModelList] = useState<ModelsResponse>({ chat: [], embedding: [] });
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [providerSettings, setProviderSettings] = useState<Record<string, string>>({});

  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('info');

  const navigate = useNavigate();

  const session = useSelector(selectSession);

  const getUsers = useCallback(async () => {
    try {

      const response = await fetch(`${endpoints.AUTH_API_BASE_URL}/admin/users?` + new URLSearchParams({
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
      const response = await fetch(`${endpoints.FILE_API_BASE_URL}/admin-all-files?` + new URLSearchParams({
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
      const response = await fetch(`${endpoints.AI_API_BASE_URL}/models?` + new URLSearchParams({
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

  const showToast = (message: string, severity: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    setToastMessage(message);
    setToastSeverity(severity);
    setOpenToast(true);
  };

  const handleCloseToast = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenToast(false);
  };

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
      const response = await fetch(`${endpoints.AUTH_API_BASE_URL}/register?` + new URLSearchParams({ sessionToken: session }), {
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
      showToast(`User ${username} created successfully`, 'success');
      setUsernameCreate('');
      setPasswordCreate('');
      getUsers();
      // also need to get admin or chat from this
    } catch (error) {
      if (error instanceof Error) {
        // TODO: toast
      }
      console.error('Login error:', error);
      showToast(error instanceof Error ? error.message : 'Failed to create user', 'error');
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
      const response = await fetch(`${endpoints.AUTH_API_BASE_URL}/admin/user?` + new URLSearchParams({
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
      showToast(`Password changed for ${newUsername}`, 'success');
      setNewUsername('');
      setNewPassword('');
      setSelectedUser(null);
    } catch (error) {
      console.error('Login error:', error);
      showToast(error instanceof Error ? error.message : 'Failed to change password', 'error');
    }
  };

  const handleDeleteUser = async () => {
    try {
      if ((usernameDelete === '')) {
        throw new Error('Please fill out all fields');
      }
      const userID = users.find(user => user.username === usernameDelete)?.id;
      console.log(JSON.stringify({ usernameDelete }));
      const response = await fetch(`${endpoints.AUTH_API_BASE_URL}/admin/user?sessionToken=${session}`, {
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
      showToast(`User ${usernameDelete} deleted successfully`, 'success');
      setUsernameDelete('');
    } catch (error) {
      console.error('delete error:', error);
      showToast(error instanceof Error ? error.message : 'Failed to delete user', 'error');
    }
    getUsers();
  };

  const handleProviderSettings = async () => {
    try {
      console.log('Setting provider settings for:', selectedProvider, providerSettings);
      
      const config = PROVIDER_CONFIGS.find(p => p.provider === selectedProvider);
      if (!config) {
        throw new Error('Invalid provider selected');
      }
      
      // Check if all required fields are filled
      const missingFields = config.fields.filter(field => !providerSettings[field.key]);
      if (missingFields.length > 0) {
        throw new Error(`Please fill all required fields for ${config.displayName}`);
      }

      const providersData = {
        providers: [
          {
            provider: selectedProvider,
            settings: { ...providerSettings }
          }
        ]
      };

      const response = await fetch('http://127.0.0.1:8004/providers?' + new URLSearchParams({
        'sessionToken': session,
      }).toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(providersData),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.status || 'Failed to update API key');
      }

      console.log('OpenAI key updated successfully:', data);
      showToast('OpenAI API key updated successfully', 'success');
      setProviderSettings({});

    } catch (error) {
      console.error('Error updating OpenAI key:', error);
      showToast(error instanceof Error ? error.message : 'Failed to update API key', 'error');
    }
  };

  const handleProviderFieldChange = (key: string, value: string) => {
    setProviderSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateModels = async (models: ModelsResponse) => {
    try {
      const postResult = await fetch(`${endpoints.AI_API_BASE_URL}/models?` + new URLSearchParams({
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
    try {
      console.log('Deleting model:', modelInfo);

      const newChatModels = modelList?.chat?.filter(m => !(m.model === modelInfo.model && m.provider === modelInfo.provider)) ?? [];
      const newEmbeddingsModels = modelList?.embedding?.filter(m => !(m.model === modelInfo.model && m.provider === modelInfo.provider)) ?? [];

      const updatedModelList: ModelsResponse = {
        chat: newChatModels,
        embedding: newEmbeddingsModels
      };
      await updateModels(updatedModelList);

      showToast(`Model ${modelInfo.model} deleted successfully`, 'success');

    } catch (error) {
      console.error('Error deleting model:', error);
      showToast(error instanceof Error ? error.message : 'Failed to delete model', 'error');
    }
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
    await fetch(`${endpoints.FILE_API_BASE_URL}/admin-delete-file?` + new URLSearchParams({
      'cookie': session,
      'file_uuid': fileUUID,
    }).toString(), { method: 'DELETE' });
    showToast('File deleted successfully', 'success');
    getFilesList();
  };

  return (
    <Box width="100%" bgcolor="background.default" display="flex" flexDirection="column" gap={1} p={3}>
      <Paper elevation={3} sx={{ p: 2, mb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h5" fontWeight='bold'>Admin Control Panel</Typography>
        <Button variant="contained" color="primary" onClick={() => navigate('/chat')} >Chat</Button>
      </Paper>
      <Grid container spacing={1}>
        <Grid item xs={3}>
          <Paper elevation={3} >
            <Box display="flex" flexDirection="column" gap={2} p={2}>
              <Typography variant="h6">Create an User</Typography>
              <TextField label="Username" variant="outlined" value={usernameCreate} onChange={handleCreateUserUsernameChange}
                error={checkEmail(usernameCreate)} sx={{ maxWidth: '400px' }} />
              <TextField label="Password" variant="outlined" value={passwordCreate} onChange={handleCreateUserPasswordChange} sx={{ maxWidth: '400px' }} />
              <Button variant="contained" color="primary" onClick={handleCreateUser} startIcon={<Add />} disabled={!usernameCreate || !passwordCreate}>Create</Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={3}>
          <Paper elevation={3} sx={{ height: '100%' }}>
            <Box display="flex" flexDirection="column" gap={2} p={2}>
              <Typography variant="h6">Change an User's Password</Typography>
              <Autocomplete
                options={users}
                getOptionLabel={(option) => option.username}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Users"
                    variant="outlined"
                  />
                )}
                value={selectedUser}
                onChange={(event, newValue) => {
                  setSelectedUser(newValue);
                  if (newValue) {
                    setNewUsername(newValue.username);
                  }
                }}
                isOptionEqualToValue={(option, value) => option.id === value?.id}
              />
              <TextField
                label="Password"
                variant="outlined"
                value={newPassword}
                onChange={handleChangePasswordPasswordChange}

              />
              <Button
                variant="contained"
                color="primary"
                onClick={handlePasswordChange}
                startIcon={<SyncLock />}
                disabled={!selectedUser || !newPassword}
              >
                Change Password
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={3}>
          <Paper elevation={3} sx={{ height: '100%' }}>
            <Box display="flex" flexDirection="column" gap={2} p={2}>
              <Typography variant="h6">Remove an Account</Typography>
              <Autocomplete
                options={users}
                getOptionLabel={(option) => option.username}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Users"
                    variant="outlined"
                    sx={{ maxWidth: '800px' }}
                  />
                )}
                value={users.find(user => user.username === usernameDelete) || null}
                onChange={(event, newValue) => {
                  setUsernameDelete(newValue ? newValue.username : '');
                }}
                isOptionEqualToValue={(option, value) => option.id === value?.id}
              />
              <Button
                variant="contained"
                color="error"
                onClick={handleDeleteUser}
                startIcon={<Delete />}
                disabled={!usernameDelete}
              >
                Delete User
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={3}>
          <Paper elevation={3} sx={{ height: '100%' }}>
            <Box display="flex" flexDirection="column" gap={2} p={2}>
              <Typography variant="h6">Provider Settings</Typography>
              <Autocomplete
                options={PROVIDER_CONFIGS}
                getOptionLabel={(option) => option.displayName}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Provider"
                    variant="outlined"
                    sx={{ maxWidth: '800px' }}
                  />
                )}
                value={PROVIDER_CONFIGS.find(p => p.provider === selectedProvider) || null}
                onChange={(event, newValue) => {
                  setSelectedProvider(newValue?.provider || '');
                  setProviderSettings({});
                }}
                isOptionEqualToValue={(option, value) => option.provider === value?.provider}
              />
              {selectedProvider && PROVIDER_CONFIGS.find(p => p.provider === selectedProvider)?.fields.map(field => (
                <TextField
                  key={field.key}
                  label={field.label}
                  type={field.type || "text"}
                  variant="outlined"
                  value={providerSettings[field.key] || ''}
                  onChange={(e) => handleProviderFieldChange(field.key, e.target.value)}
                  sx={{ maxWidth: '800px' }}
                />
              ))}
              
              <Button
                variant="contained"
                color="primary"
                onClick={handleProviderSettings}
                startIcon={<Save />}
                disabled={!selectedProvider}
              >
                Save Settings
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={3}>
          <Paper elevation={3} sx={{ height: '100%' }}>
            <Box display="flex" flexDirection="column" gap={2} p={2}>
              <Typography variant="h6">Add New LLM Model</Typography>
              <TextField label="Model Name" variant="outlined" inputRef={ollamaLLMNameRef} sx={{ maxWidth: '800px' }} />
              <TextField label="LLM Provider" variant="outlined" inputRef={ollamaLLMProviderRef} sx={{ maxWidth: '800px' }} />
              <Box display="flex" gap={2} flexDirection="row">
                <Button variant="contained" color="primary" onClick={() => handleDownloadLLM(ModelType.CHAT)} startIcon={<Download />} >Download as Chat</Button>
                <Button variant="contained" color="primary" onClick={() => handleDownloadLLM(ModelType.EMBEDDINGS)} startIcon={<Download />} >Download as Embedding</Button>
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={3}>
          <Paper elevation={3} sx={{ height: '100%' }}>
            <Box display="flex" flexDirection="column" gap={2} p={2}>
              <Typography variant="h6">Remove Models</Typography>
              <Autocomplete
                options={[
                  ...(modelList.chat || []).map(model => ({
                    ...model,
                    type: 'chat' as const
                  })),
                  ...(modelList.embedding || []).map(model => ({
                    ...model,
                    type: 'embeddings' as const
                  }))
                ]}
                getOptionLabel={(option) => `${option.model} (- ${option.provider})`}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search Models"
                    variant="outlined"
                    sx={{ maxWidth: '800px' }}
                  />
                )}
                value={selectedModel}
                onChange={(event, newValue) => {
                  setSelectedModel(newValue);
                }}
                isOptionEqualToValue={(option, value) =>
                  option.model === value?.model &&
                  option.provider === value?.provider
                }
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => selectedModel && handleDeleteLLM(selectedModel)}
                startIcon={<Delete />}
                disabled={!selectedModel}
              >
                Delete Model
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={6}>
          <Paper elevation={3} sx={{ height: '100%' }}>
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
        </Grid>
      </Grid>
      <Snackbar
        open={openToast}
        autoHideDuration={6000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toastSeverity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminControlPanel;