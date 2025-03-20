import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { authenticateUser, changePassword,  checkUser } from "../../utils/api";
import { RootState } from "../store";

// Define the shape of the auth stat
interface AuthState {
  session: string;
  uuid: string;
  username: string;
  authError: string | null;
  isAdmin: boolean;
}

// Initialize the auth stat with default values
const initialState: AuthState = {
  session: Cookies.get("session") || "",
  uuid: "",
  username: '', // not returned by /check rn
  authError: null,
  isAdmin: false
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

// Async thuck to fetch the user's UUID and admin status
export const checkUserThunk = createAsyncThunk(
  "auth/checkUser",
  async (_, { getState }) => {
    const state = getState() as RootState; // Retrieve the current Reduc state
    const session = state.auth.session; // Extract session tocken from the auth state
    if (!session) throw new Error("No session found");

    return await checkUser(session);
  }
);
// Async thuck to change password
export const changePasswordThunk = createAsyncThunk(
  "auth/changePassword",
  async (
    {
      newPassword,
    }: { newPassword: string },
    { getState }
  ) => {
    const state = getState() as RootState; // Retrieve the current Reduc state
    const session = state.auth.session; // Extract seesion tocken from the auth state
    const response = await changePassword(session, newPassword);
    return response;
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
      // When User check is successful, update the state with the UUID
      .addCase(checkUserThunk.fulfilled, (state, action) => {
        const {id, is_admin} = action.payload;
      if (!action.payload || !id || (is_admin !== true && is_admin !== false)) {
          Cookies.remove('session');
          state = initialState;
          return;
        }
        state.uuid = id;
        state.isAdmin = is_admin;
      })
      // When User check is successful, update the state with the UUID
      .addCase(checkUserThunk.rejected, (state, action) => {
        state.session = '';
        Cookies.remove("session");
      });
  },
});

export const { setSession, setUsername, setUUID, clearAuthError, logout } =
  authSlice.actions;
export default authSlice.reducer;
