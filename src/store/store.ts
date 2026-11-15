import { configureStore } from "@reduxjs/toolkit";
import themeReducer from '@/store/slices/themeSlice'

const store = configureStore({
    reducer:{
        theme:themeReducer
    }
})
// store. 

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store