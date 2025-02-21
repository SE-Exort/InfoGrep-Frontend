import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { authenticateUser, getUUID } from "../../utils/api";
import { RootState } from "../store";

// Define the shape of the auth stat
interface AuthState {
  session: string;
  username: string;
  uuid: string;
  authError: string | null;
}

// Initialize the auth stat with default values
const initialState: AuthState = {
  session: Cookies.get("session") || "",
  username: "",
  uuid: "",
  authError: null,
};

// Async thuck used for user auth (login/register)
export const authenticateUserThunk = createAsyncThunk(
  "auth/authenticateUser",
  async (
    {
      type,
      username,
      password,
    }: { type: "login" | "register"; username: string; password: string },
    { rejectWithValue } // Allows returning a custom error response
  ) => {
    try {
      // Calls API to auth user
      const response = await authenticateUser(type, username, password);
      if (response.error) {
        return rejectWithValue(response.status);
      }
      return response.data || "";
    } catch (error) {
      return rejectWithValue("Authentication failed");
    }
  }
);

// Async thuck to fetch the user's UUID
export const fetchUUIDThunk = createAsyncThunk(
  "auth/fetchUUID",
  async (_, { getState }) => {
    const state = getState() as RootState; // Retrieve the current Reduc state
    const session = state.auth.session; // Extract seesion tocken from the auth state
    if (!session) throw new Error("No session found");

    return await getUUID();
  }
);

// Create the auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<string>) => {
      state.session = action.payload;
      Cookies.set("session", action.payload, { expires: 7 });
    },
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    setUUID: (state, action: PayloadAction<string>) => {
      state.uuid = action.payload;
    },
    clearAuthError: (state) => {
      state.authError = null;
    },
    // Reducer to handle logout
    logout: (state) => {
      state.session = "";
      state.username = "";
      state.uuid = "";
      state.authError = null;
      Cookies.remove("session");
    },
  },
  // Reducers to handle AsyncThunk
  extraReducers: (builder) => {
    builder
      // When authentication is successful, update the session and clear errors
      .addCase(authenticateUserThunk.fulfilled, (state, action) => {
        state.session = action.payload;
        Cookies.set("session", action.payload, { expires: 7 });
        state.authError = null;
      })
      // If authentication fails, store the error message
      .addCase(authenticateUserThunk.rejected, (state, action) => {
        state.authError = action.payload as string;
      })
      // When UUID fetching is successful, update the state with the UUID
      .addCase(fetchUUIDThunk.fulfilled, (state, action) => {
        state.uuid = action.payload || "";
      });
  },
});

export const { setSession, setUsername, setUUID, clearAuthError, logout } =
  authSlice.actions;
export default authSlice.reducer;
