import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchChatrooms,
  createChatroom,
  deleteChatroom,
  Chatroom,
} from "../../utils/api";
import { RootState } from "../store";

// **Define Chatroom State**
interface ChatroomState {
  chatrooms: Chatroom[];
  currentChatroom: string;
  minimized: boolean; //ui state for minimizing panel
}

const initialState: ChatroomState = {
  chatrooms: [],
  currentChatroom: "",
  minimized: false, // Default state is expanded
};

// **Thunk to Fetch Chatrooms**
export const fetchChatroomsThunk = createAsyncThunk(
  "chatroom/fetchChatrooms",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const session = state.auth.session;

    if (!session) return rejectWithValue("No session found");

    try {
      return await fetchChatrooms(session);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// **Thunk to Create a Chatroom**
export const createChatroomThunk = createAsyncThunk(
  "chatroom/createChatroom",
  async (_, { getState, dispatch, rejectWithValue }) => {
    const state = getState() as RootState;
    const session = state.auth.session;

    if (!session) return rejectWithValue("No session found");

    try {
      const newChatroomUUID = await createChatroom(session);
      dispatch(fetchChatroomsThunk()); // Refresh chatroom list after creation
      return newChatroomUUID;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// **Thunk to Delete a Chatroom**
export const deleteChatroomThunk = createAsyncThunk(
  "chatroom/deleteChatroom",
  async (chatroomUUID: string, { getState, dispatch, rejectWithValue }) => {
    const state = getState() as RootState;
    const session = state.auth.session;

    if (!session) return rejectWithValue("No session found");

    try {
      await deleteChatroom(chatroomUUID, session);
      dispatch(fetchChatroomsThunk()); // Refresh chatroom list after deletion
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const chatroomSlice = createSlice({
  name: "chatroom",
  initialState,
  reducers: {
    setCurrentChatroom: (state, action: PayloadAction<string>) => {
      state.currentChatroom = action.payload;
    },
    toggleMinimize: (state) => {
      state.minimized = !state.minimized;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatroomsThunk.fulfilled, (state, action) => {
        state.chatrooms = action.payload;
      })
      .addCase(fetchChatroomsThunk.rejected, (_, action) => {
        console.error("Fetch Chatrooms Error:", action.payload);
      })
      .addCase(createChatroomThunk.rejected, (_, action) => {
        console.error("Create Chatroom Error:", action.payload);
      })
      .addCase(deleteChatroomThunk.rejected, (_, action) => {
        console.error("Delete Chatroom Error:", action.payload);
      });
  },
});

export const { setCurrentChatroom, toggleMinimize } = chatroomSlice.actions;
export default chatroomSlice.reducer;
