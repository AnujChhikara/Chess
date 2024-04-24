import { configureStore } from "@reduxjs/toolkit";

import playerSlice from "./playerSlice";



const store = configureStore({
    reducer: {
        player:playerSlice.reducer
    }
})

export default store;