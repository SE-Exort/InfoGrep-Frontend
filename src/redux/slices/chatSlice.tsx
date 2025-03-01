import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchMessages,
  fetchMessageDetails,
  sendMessage,
} from "../../utils/api";
import { RootState } from "../store";

interface ChatState {
  messages: {
    message: string;
    direction: "incoming" | "outgoing";
    sender: string;
  }[];
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  messages: [],
  loading: false,
  error: null,
};

export const fetchMessagesThunk = createAsyncThunk(
  "chat/fetchMessages",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const session = state.auth.session;
    const currentChatroom = state.chatroom.selectedChatroom;

    if (!session || !currentChatroom)
      return rejectWithValue("No session or chatroom found");

    try {
      const messageList = await fetchMessages(currentChatroom, session);
      const newMessagesArr = [];

      for (const { Message_UUID, User_UUID } of messageList) {
        const actualMsg = await fetchMessageDetails(
          currentChatroom,
          Message_UUID,
          session
        );
        newMessagesArr.push({
          message: actualMsg,
          direction:
            User_UUID === "00000000-0000-0000-0000-000000000000"
              ? "incoming"
              : "outgoing",
          sender:
            User_UUID === "00000000-0000-0000-0000-000000000000"
              ? "InfoGrep"
              : "You",
        });
      }
      return newMessagesArr;
    } catch (error) {
      return rejectWithValue("Failed to fetch messages");
    }
  }
);

export const sendMessageThunk = createAsyncThunk(
  "chat/sendMessage",
  async (message: string, { getState, dispatch, rejectWithValue }) => {
    const state = getState() as RootState;
    const session = state.auth.session;
    const currentChatroom = state.chatroom.selectedChatroom;

    if (!session || !currentChatroom)
      return rejectWithValue("No session or chatroom found");

    try {
      await sendMessage(currentChatroom, session, message);
      dispatch(fetchMessagesThunk()); // Refresh message list after sending
    } catch (error) {
      return rejectWithValue("Failed to send message");
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessagesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessagesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload.map((msg) => ({
          ...msg,
          direction: msg.direction as "incoming" | "outgoing",
        }));
      })
      .addCase(fetchMessagesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(sendMessageThunk.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export default chatSlice.reducer;
