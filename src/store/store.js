import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import ppobReducer from "./ppobSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ppob: ppobReducer,
  },
});

