import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import chatroomReducer from "./slices/chatroomSlice";
import chatReducer from "./slices/chatSlice";
import fileReducer from "./slices/fileSlice";
import appReducer from "./slices/appSlice";
import { enableMapSet } from "immer";

enableMapSet();

export const store = configureStore({
  reducer: {
    app: appReducer,
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
