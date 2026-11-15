
import { createSlice } from "@reduxjs/toolkit";


//types of theme:
type ThemeState = "dark" | "light";

// Get saved theme
const getInitialTheme = (): ThemeState => {
    const savedTheme = localStorage.getItem("theme");

    return savedTheme === "light" ? "light" : "dark";
};

// Apply theme to HTML
const applyTheme = (theme: ThemeState) => {
    document.documentElement.classList.toggle(
        "dark",
        theme === "dark"
    );
};

const themeSlice = createSlice({
    name: "theme",

    initialState: getInitialTheme(),

    reducers: {
        toggleTheme: (state) => {
            const newTheme: ThemeState =
                state === "dark" ? "light" : "dark";

            localStorage.setItem("theme", newTheme);

            applyTheme(newTheme);

            return newTheme;
        },
    },
});

export const { toggleTheme } = themeSlice.actions;

export default themeSlice.reducer;
