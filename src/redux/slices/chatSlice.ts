import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  addIntegration,
  deleteIntegration,
  fetchChatroom,
  parseIntegration,
  sendMessage,
} from "../../utils/api";
import { RootState } from "../store";

interface Integration {
  id: string;
  integration: string;
  config: any;
}

interface ChatState {
  messages: {
    message: string;
    direction: "incoming" | "outgoing";
    sender: string;
  }[];
  embedding_provider: string;
  embedding_model: string;
  chat_provider: string;
  chat_model: string;
  integrations: Integration[];
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  messages: [],
  integrations: [],
  embedding_provider: '',
  embedding_model: '',
  chat_provider: '',
  chat_model: '',
  loading: false,
  error: null,
};

export const fetchChatroomThunk = createAsyncThunk(
  "chat/fetchMessages",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const session = state.auth.session;
    const currentChatroom = state.chatroom.currentChatroomID;

    if (!session || !currentChatroom)
      return rejectWithValue("No session or chatroom found");

    try {
      const { messages: messageList, embedding_model, chat_model, chat_provider, embedding_provider, integrations } = await fetchChatroom(currentChatroom, session);
      const newMessagesArr = [];

      for (const { user_uuid, message } of messageList) {
        newMessagesArr.push({
          message: message,
          direction:
            user_uuid === "00000000-0000-0000-0000-000000000000"
              ? "incoming"
              : "outgoing",
          sender:
            user_uuid === "00000000-0000-0000-0000-000000000000"
              ? "InfoGrep"
              : "You",
        });
      }

      return {
        messageList: newMessagesArr,
        embedding_model,
        chat_model,
        chat_provider,
        embedding_provider,
        integrations
      };
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
    const currentChatroom = state.chatroom.currentChatroomID;

    if (!session || !currentChatroom)
      return rejectWithValue("No session or chatroom found");

    try {
      await sendMessage(currentChatroom, session, message);
      dispatch(fetchChatroomThunk()); // Refresh message list after sending
    } catch (error) {
      return rejectWithValue("Failed to send message");
    }
  }
);

export const addIntegrationThunk = createAsyncThunk(
  "chat/addIntegration",
  async ({ integration, config }: { integration: string, config: any }, { getState, dispatch, rejectWithValue }) => {
    const state = getState() as RootState;
    const session = state.auth.session;
    const currentChatroom = state.chatroom.currentChatroomID;

    if (!session || !currentChatroom)
      return rejectWithValue("No session or chatroom found");

    try {
      await addIntegration(currentChatroom, integration, config, session);
      dispatch(parseIntegrationThunk({ integration, config }));
      dispatch(fetchChatroomThunk()); // Refresh chatroom after addition
    } catch (error) {
      return rejectWithValue("Failed to add integration");
    }
  }
);

export const deleteIntegrationThunk = createAsyncThunk(
  "chat/addIntegration",
  async (integration_uuid: string, { getState, dispatch, rejectWithValue }) => {
    const state = getState() as RootState;
    const session = state.auth.session;
    const currentChatroom = state.chatroom.currentChatroomID;

    if (!session || !currentChatroom)
      return rejectWithValue("No session or chatroom found");

    try {
      await deleteIntegration(integration_uuid, session);
      dispatch(fetchChatroomThunk()); // Refresh chatroom after addition
    } catch (error) {
      return rejectWithValue("Failed to add integration");
    }
  }
);

export const parseIntegrationThunk = createAsyncThunk(
  "chat/addIntegration",
  async ({ integration, config }: { integration: string; config: any }, { getState, dispatch, rejectWithValue }) => {
    const state = getState() as RootState;
    const session = state.auth.session;
    const currentChatroom = state.chatroom.currentChatroomID;

    if (!session || !currentChatroom)
      return rejectWithValue("No session or chatroom found");

    try {
      await parseIntegration(currentChatroom, integration, config, session);
      dispatch(fetchChatroomThunk()); // Refresh chatroom after addition
    } catch (error) {
      return rejectWithValue("Failed to parse integration");
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatroomThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatroomThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload.messageList.map((msg) => ({
          ...msg,
          direction: msg.direction as "incoming" | "outgoing",
        }));
        state.integrations = action.payload.integrations;
        state.chat_model = action.payload.chat_model;
        state.embedding_model = action.payload.embedding_model;
        state.chat_provider = action.payload.chat_provider;
        state.embedding_provider = action.payload.embedding_provider;
      })
      .addCase(fetchChatroomThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(sendMessageThunk.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export default chatSlice.reducer;
