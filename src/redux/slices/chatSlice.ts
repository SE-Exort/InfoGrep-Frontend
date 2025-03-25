import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  addIntegration,
  deleteIntegration,
  fetchChatroom,
  parseIntegration,
  sendMessage,
} from "../../utils/api";
import { RootState } from "../store";
import { logout } from "./authSlice";

interface Integration {
  id: string;
  integration: string;
  config: any;
}

export interface MessageReference {
  page: number;
  textContent: string;
  file: string;
}

interface ChatState {
  messages: {
    message: string;
    direction: "incoming" | "outgoing";
    sender: string;
    references: MessageReference[];
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

      for (const { user_uuid, message, references } of messageList) {
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
          references
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
          references: msg.references
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
      // show indicator that the AI is replying..
      .addCase(sendMessageThunk.pending, (state, action) => {
        state.messages.push({ message: action.meta.arg, direction: 'outgoing', sender: "You", references: [] });
        state.messages.push({ message: "Thinking..", direction: 'incoming', sender: "InfoGrep", references: [] })
      })
      .addCase(sendMessageThunk.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(logout, (state) => {
        state.messages = [];
        state.integrations = [];
        state.embedding_provider = '';
        state.embedding_model = '';
        state.chat_provider = '';
        state.chat_model = '';
        state.loading = false;
        state.error = null;
      })
  },
});

export default chatSlice.reducer;
