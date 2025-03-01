import { RootState } from "./store";

// Authentication Selectors
export const selectAuthError = (state: RootState) => state.auth.authError;
export const selectSession = (state: RootState) => state.auth.session;
export const selectUUID = (state: RootState) => state.auth.uuid;
export const selectUsername = (state: RootState) => state.auth.username;

// Chatroom Selectors
export const selectChatrooms = (state: RootState) => state.chatroom.chatrooms;
export const selectSelectedChatroom = (state: RootState) =>
  state.chatroom.selectedChatroom;
export const selectChatroomLoading = (state: RootState) =>
  state.chatroom.loading;
export const selectChatroomError = (state: RootState) => state.chatroom.error;

// Chat Selectors
export const selectMessages = (state: RootState) => state.chat.messages;
export const selectChatLoading = (state: RootState) => state.chat.loading;

// File Selectors
export const selectFiles = (state: RootState) => state.file.files;
export const selectFileLoading = (state: RootState) => state.file.loading;
export const selectFileError = (state: RootState) => state.file.error;
