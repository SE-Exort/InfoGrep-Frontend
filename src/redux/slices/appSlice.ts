import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AppState {
    fontSize: number;
    darkMode: boolean;
}

const initialState: AppState = {
    fontSize: 16,
    darkMode: false
};

// Create Redux Slice
const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setFontSize: (state, action: PayloadAction<number>) => {
            state.fontSize = action.payload;
        },
        setDarkMode: (state, action: PayloadAction<boolean>) => {
            state.darkMode = action.payload;
        },
    },
});

export const { setFontSize, setDarkMode } = appSlice.actions;
export default appSlice.reducer;
