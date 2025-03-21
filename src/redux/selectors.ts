import { RootState } from "./store";

// Authentication Selectors
export const selectAuthError = (state: RootState) => state.auth.authError;
export const selectSession = (state: RootState) => state.auth.session;
export const selectUUID = (state: RootState) => state.auth.uuid;
export const selectUsername = (state: RootState) => state.auth.username;
export const selectIsAdmin = (state: RootState) => state.auth.isAdmin;

// Chatroom Selectors
export const selectChatrooms = (state: RootState) => state.chatroom.chatroomMap;
export const selectCurrentChatroomID = (state: RootState) =>
  state.chatroom.currentChatroomID;
export const selectCurrentChatroomName = (state: RootState) =>
  state.chatroom.chatroomMap.get(state.chatroom.currentChatroomID)?.CHATROOM_NAME ?? '';
export const selectChatroomLoading = (state: RootState) =>
  state.chatroom.loading;
export const selectChatroomError = (state: RootState) => state.chatroom.error;

// Chat Selectors
export const selectMessages = (state: RootState) => state.chat.messages;
export const selectChatLoading = (state: RootState) => state.chat.loading;
export const selectChatroomEmbeddingModel = (state: RootState) =>
  state.chat.embedding_model;
export const selectChatroomChatModel = (state: RootState) =>
  state.chat.chat_model;
export const selectChatroomEmbeddingProvider = (state: RootState) =>
  state.chat.embedding_provider;
export const selectChatroomChatProvider = (state: RootState) =>
  state.chat.chat_provider;

// File Selectors
export const selectFiles = (state: RootState) => state.file.files;
export const selectFileListShowing = (state: RootState) => state.file.fileListShowing;
export const selectFileLoading = (state: RootState) => state.file.loading;
export const selectFileError = (state: RootState) => state.file.error;

// App selectors
export const selectFontSize = (state: RootState) => state.app.fontSize;
export const selectDarkMode = (state: RootState) => state.app.darkMode;
