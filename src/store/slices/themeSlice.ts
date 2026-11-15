import { createSlice } from "@reduxjs/toolkit";

type ThemeState = "dark" | "light";

const getInitialTheme = (): ThemeState => {
    const savedTheme = localStorage.getItem("theme");

    return savedTheme === "light" ? "light" : "dark";
};

const themeSlice = createSlice({
    name: "theme",
    initialState: getInitialTheme(),

    reducers: {
        toggleTheme: (state) => {
            const newTheme = state === "dark" ? "light" : "dark";

            localStorage.setItem("theme", newTheme);

            return newTheme;
        },
    },
});

export const { toggleTheme } = themeSlice.actions;

export default themeSlice.reducer;