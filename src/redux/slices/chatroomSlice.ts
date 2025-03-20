import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchChatrooms,
  createChatroom,
  deleteChatroom,
  Chatroom,
} from "../../utils/api";
import { RootState } from "../store";

interface ChatroomState {
  chatroomMap: Map<string, Chatroom>;
  currentChatroomID: string;
  loading: boolean;
  error: string | null;
}

const initialState: ChatroomState = {
  chatroomMap: new Map<string, Chatroom>(),
  currentChatroomID: "",
  loading: false,
  error: null,
};

export const fetchChatroomsThunk = createAsyncThunk(
  "chatrooms/fetchChatrooms",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const session = state.auth.session; // Get session from Redux

    if (!session) return rejectWithValue("No session found");

    try {
      return await fetchChatrooms(session);
    } catch (error) {
      return rejectWithValue("Failed to fetch chatrooms");
    }
  }
);

export const createChatroomThunk = createAsyncThunk(
  "chatrooms/createChatroom",
  async ({ chatroomName, chatModel, chatProvider, embeddingModel, embeddingProvider }: { chatroomName: string, chatModel: string, chatProvider: string, embeddingModel: string, embeddingProvider: string }, { getState, dispatch, rejectWithValue }) => {
    const state = getState() as RootState;
    const session = state.auth.session;

    if (!session) return rejectWithValue("No session found");

    try {
      const newChatroomUUID = await createChatroom(session, chatroomName, chatModel, chatProvider, embeddingModel, embeddingProvider);
      if (newChatroomUUID) {
        dispatch(fetchChatroomsThunk()); // Refresh chatrooms after creation
      }
      return newChatroomUUID;
    } catch (error) {
      return rejectWithValue("Failed to create chatroom");
    }
  }
);

export const deleteChatroomThunk = createAsyncThunk(
  "chatrooms/deleteChatroom",
  async (chatroomUUID: string, { getState, dispatch, rejectWithValue }) => {
    const state = getState() as RootState;
    const session = state.auth.session;

    if (!session) return rejectWithValue("No session found");

    try {
      await deleteChatroom(session, chatroomUUID);
      dispatch(fetchChatroomsThunk()); // Refresh chatrooms after deletion
    } catch (error) {
      return rejectWithValue("Failed to delete chatroom");
    }
  }
);

// Create Redux Slice
const chatroomSlice = createSlice({
  name: "chatrooms",
  initialState,
  reducers: {
    setSelectedChatroom: (state, action: PayloadAction<string>) => {
      state.currentChatroomID = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatroomsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatroomsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.chatroomMap = new Map<string, Chatroom>();
        action.payload.map(chatroom => state.chatroomMap.set(chatroom.CHATROOM_UUID, chatroom));
      })
      .addCase(fetchChatroomsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createChatroomThunk.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(deleteChatroomThunk.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(deleteChatroomThunk.fulfilled, (state, action) => {
        state.currentChatroomID = '';
      });
  },
});

export const { setSelectedChatroom } = chatroomSlice.actions;
export default chatroomSlice.reducer;
