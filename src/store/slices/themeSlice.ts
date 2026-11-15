import { createSlice } from "@reduxjs/toolkit";

type ThemeState = "dark" | "light";

const themeSlice = createSlice({
    name: "theme",

    initialState: "dark" as ThemeState,

    reducers: {
        toggleTheme: (state) => {
            const newTheme = state === "dark" ? "light" : "dark";

            document.documentElement.classList.toggle(
                "dark",
                newTheme === "dark"
            );

            return newTheme;
        },
    },
});

export const { toggleTheme } = themeSlice.actions;

export default themeSlice.reducer;