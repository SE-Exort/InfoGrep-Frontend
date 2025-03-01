import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import chatroomReducer from "./slices/chatroomSlice";
import chatReducer from "./slices/chatSlice";
import fileReducer from "./slices/fileSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chatroom: chatroomReducer,
    chat: chatReducer,
    file: fileReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Needed for handling cookies
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
