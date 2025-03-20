import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface AppState {
    fontSize: number;
    darkMode: boolean;
}

const initialState: AppState = {
    fontSize: Cookies.get("fontSize") ? parseInt(Cookies.get("fontSize") as string) : 16,
    darkMode: Cookies.get("darkMode") === "true",
};

// Create Redux Slice
const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setFontSize: (state, action: PayloadAction<number>) => {
            state.fontSize = action.payload;
            Cookies.set("fontSize", action.payload.toString());
        },
        setDarkMode: (state, action: PayloadAction<boolean>) => {
            state.darkMode = action.payload;
            Cookies.set("darkMode", action.payload.toString());
        },
    },
});

export const { setFontSize, setDarkMode } = appSlice.actions;
export default appSlice.reducer;
