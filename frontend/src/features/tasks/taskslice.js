import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../services/api";

export const fetchTasks = createAsyncThunk(
  "tasks/fetch",
  async () => {
    const res = await API.get("/tasks");
    return res.data;
  }
);

export const addTask = createAsyncThunk(
  "tasks/add",
  async (task) => {
    const res = await API.post("/tasks", task);
    return res.data;
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    list: [],
    loading: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.list.push(action.payload);
      });
  },
});

export default taskSlice.reducer;
