import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  uploadFile,
  fetchFiles,
  deleteFile,
  fetchFileDownload,
  parseFile,
  BackendFile,
  removeEmbedding,
} from "../../utils/api";
import { RootState } from "../store";

interface FileState {
  files: BackendFile[]; // Stores all uploaded files
  isUploading: boolean; // Indicates uploading state
  loading: boolean; // Indicates loading state
  error: string | null; // Stores any error messages
  fileListShowing: boolean;
}

const initialState: FileState = {
  files: [],
  isUploading: false,
  loading: false,
  error: null,
  fileListShowing: false
};

export const fetchFilesThunk = createAsyncThunk(
  "files/fetchFiles",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const session = state.auth.session;
    const currentChatroom = state.chatroom.currentChatroomID;

    if (!session || !currentChatroom)
      return rejectWithValue("No session or chatroom found");

    try {
      return await fetchFiles(currentChatroom, session);
    } catch (error) {
      return rejectWithValue("Failed to fetch files");
    }
  }
);

export const uploadFileThunk = createAsyncThunk(
  "files/uploadFile",
  async (file: File, { getState, dispatch, rejectWithValue }) => {
    const state = getState() as RootState;
    const session = state.auth.session;
    const currentChatroom = state.chatroom.currentChatroomID;

    if (!session || !currentChatroom)
      return rejectWithValue("No session or chatroom found");

    try {
      const fileParts = file.name.split(".");
      dispatch(setFileUploading(true));
      const uuid = await uploadFile(currentChatroom, session, file);
      await dispatch(parseFileThunk({fileUUID: uuid, fileType: fileParts[fileParts.length-1]?.toUpperCase() ?? "TXT"}))
      dispatch(fetchFilesThunk()); // Refresh file list after upload
    } catch (error) {
      return rejectWithValue("Failed to upload file");
    }
  }
);

export const deleteFileThunk = createAsyncThunk(
  "files/deleteFile",
  async (fileUUID: string, { getState, dispatch, rejectWithValue }) => {
    const state = getState() as RootState;
    const session = state.auth.session;
    const currentChatroom = state.chatroom.currentChatroomID;

    if (!session || !currentChatroom)
      return rejectWithValue("No session or chatroom found");

    try {
      await deleteFile(currentChatroom, session, fileUUID);
      dispatch(fetchFilesThunk()); // Refresh file list after deletion
    } catch (error) {
      return rejectWithValue("Failed to delete file");
    }
  }
);

export const removeEmbeddingThunk = createAsyncThunk(
  "files/deleteFile",
  async (fileUUID: string, { getState, dispatch, rejectWithValue }) => {
    const state = getState() as RootState;
    const session = state.auth.session;
    const currentChatroom = state.chatroom.currentChatroomID;

    if (!session || !currentChatroom)
      return rejectWithValue("No session or chatroom found");

    try {
      await removeEmbedding(currentChatroom, session, fileUUID);

    } catch (error) {
      return rejectWithValue("Failed to remove embedding");
    }
  }
);

export const fetchFileDownloadThunk = createAsyncThunk(
  "files/downloadFile",
  async (file: BackendFile, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const session = state.auth.session;
    const currentChatroom = state.chatroom.currentChatroomID;

    if (!session || !currentChatroom)
      return rejectWithValue("No session or chatroom found");

    try {
      await fetchFileDownload(currentChatroom, session, file);
    } catch (error) {
      return rejectWithValue("Failed to download file");
    }
  }
);

export const parseFileThunk = createAsyncThunk(
  "files/startParsing",
  async ({ fileUUID, fileType }: { fileUUID: string; fileType: string }, { getState, dispatch, rejectWithValue }) => {
    const state = getState() as RootState;
    const session = state.auth.session;
    const currentChatroom = state.chatroom.currentChatroomID;

    if (!session || !currentChatroom)
      return rejectWithValue("No session or chatroom found");

    try {
      await parseFile(currentChatroom, session, fileUUID, fileType);
      dispatch(setFileUploading(false));
    } catch (error) {
      return rejectWithValue("Failed to start file parsing");
    }
  }
);

const fileSlice = createSlice({
  name: "files",
  initialState,
  reducers: {
    setFileListShowing: (state, action: PayloadAction<boolean>) => {
      state.fileListShowing = action.payload;
    },
    setFileUploading: (state, action: PayloadAction<boolean>) => {
      state.isUploading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFilesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFilesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.files = action.payload;
      })
      .addCase(fetchFilesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(uploadFileThunk.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(deleteFileThunk.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(parseFileThunk.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { setFileListShowing, setFileUploading } = fileSlice.actions;
export default fileSlice.reducer;
