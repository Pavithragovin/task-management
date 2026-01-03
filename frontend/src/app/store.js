import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authslice";
import taskReducer from "../features/tasks/taskslice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: taskReducer,
  },
});
