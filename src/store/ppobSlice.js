import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "./api";

const getError = (error) => error?.response?.data?.message || "Terjadi kesalahan pada server.";

export const fetchProfile = createAsyncThunk("ppob/fetchProfile", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/profile");
    return response.data.data;
  } catch (error) {
    return rejectWithValue(getError(error));
  }
});

export const updateProfile = createAsyncThunk("ppob/updateProfile", async (payload, { rejectWithValue }) => {
  try {
    const response = await api.put("/profile/update", payload);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(getError(error));
  }
});

export const uploadProfileImage = createAsyncThunk("ppob/uploadProfileImage", async (file, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.put("/profile/image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.data;
  } catch (error) {
    return rejectWithValue(getError(error));
  }
});

export const fetchServices = createAsyncThunk("ppob/fetchServices", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/services");
    return response.data.data;
  } catch (error) {
    return rejectWithValue(getError(error));
  }
});

export const fetchBanners = createAsyncThunk("ppob/fetchBanners", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/banner");
    return response.data.data;
  } catch (error) {
    return rejectWithValue(getError(error));
  }
});

export const fetchBalance = createAsyncThunk("ppob/fetchBalance", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/balance");
    return response.data.data.balance;
  } catch (error) {
    return rejectWithValue(getError(error));
  }
});

export const topup = createAsyncThunk("ppob/topup", async (top_up_amount, { rejectWithValue }) => {
  try {
    const response = await api.post("/topup", { top_up_amount });
    return response.data.data.balance;
  } catch (error) {
    return rejectWithValue(getError(error));
  }
});

export const transaction = createAsyncThunk("ppob/transaction", async (service_code, { rejectWithValue }) => {
  try {
    const response = await api.post("/transaction", { service_code });
    return response.data.data;
  } catch (error) {
    return rejectWithValue(getError(error));
  }
});

export const fetchHistory = createAsyncThunk("ppob/fetchHistory", async (params, { rejectWithValue }) => {
  try {
    const { offset = 0, limit = 5, append = false } = params || {};
    const response = await api.get("/transaction/history", { params: { offset, limit } });
    return {
      records: response.data.data.records || [],
      offset,
      append,
    };
  } catch (error) {
    return rejectWithValue(getError(error));
  }
});

const ppobSlice = createSlice({
  name: "ppob",
  initialState: {
    profile: { email: "", first_name: "", last_name: "", profile_image: "" },
    services: [],
    banners: [],
    history: [],
    historyOffset: 0,
    balance: 0,
    balanceVisible: true,
    error: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      .addCase(uploadProfileImage.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.services = action.payload || [];
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.banners = action.payload || [];
      })
      .addCase(fetchBalance.fulfilled, (state, action) => {
        state.balance = Number(action.payload || 0);
      })
      .addCase(topup.fulfilled, (state, action) => {
        state.balance = Number(action.payload || 0);
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        if (action.payload.append) {
          state.history = [...state.history, ...action.payload.records];
        } else {
          state.history = action.payload.records;
        }
        state.historyOffset = action.payload.offset;
      })
      .addMatcher(
        (action) => action.type.startsWith("ppob/") && action.type.endsWith("/rejected"),
        (state, action) => {
          state.error = action.payload || "Terjadi kesalahan.";
        },
      );
  },
});

export default ppobSlice.reducer;

