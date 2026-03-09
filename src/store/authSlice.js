import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "./api";

const getError = (error) => error?.response?.data?.message || "Terjadi kesalahan pada server.";

export const register = createAsyncThunk("auth/register", async (payload, { rejectWithValue }) => {
  try {
    const response = await api.post("/registration", payload);
    return response.data;
  } catch (error) {
    return rejectWithValue(getError(error));
  }
});

export const login = createAsyncThunk("auth/login", async (payload, { rejectWithValue }) => {
  try {
    const response = await api.post("/login", payload);
    return response.data.data.token;
  } catch (error) {
    return rejectWithValue(getError(error));
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: localStorage.getItem("ppob_token"),
    loading: false,
    error: "",
  },
  reducers: {
    clearAuth: (state) => {
      state.token = null;
      state.error = "";
      localStorage.removeItem("ppob_token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload;
        localStorage.setItem("ppob_token", action.payload);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAuth } = authSlice.actions;
export default authSlice.reducer;

