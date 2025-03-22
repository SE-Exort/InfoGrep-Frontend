import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AppState {
    fontSize: number;
    darkMode: boolean;
}

const getFontSizeFromStorage = (): number => {
    const storedValue = localStorage.getItem("fontSize");
    return storedValue ? parseInt(storedValue, 10) : 16;
};

const getDarkModeFromStorage = (): boolean => {
    const storedValue = localStorage.getItem("darkMode");
    return storedValue ? storedValue === "true" : false;
};

const initialState: AppState = {
    fontSize: getFontSizeFromStorage(),
    darkMode: getDarkModeFromStorage(),
};

// Create Redux Slice
const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setFontSize: (state, action: PayloadAction<number>) => {
            state.fontSize = action.payload;
            localStorage.setItem("fontSize", action.payload.toString());
        },
        setDarkMode: (state, action: PayloadAction<boolean>) => {
            state.darkMode = action.payload;
            localStorage.setItem("darkMode", action.payload.toString());
        },
    },
});

export const { setFontSize, setDarkMode } = appSlice.actions;
export default appSlice.reducer;
