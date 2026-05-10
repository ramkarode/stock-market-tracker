// Starter file
"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginUser,
  logoutUser,
  registerUser,
  verifyLoginUser,
} from "@/services/apiCollections";

import toast from "react-hot-toast";

const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }

  return null;
};

const initialState = {
  user: null,
  token: getToken(),
  isLoggedIn: false,
  loading: true,
  error: null,
};

// REGISTER USER
export const register = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      const response = await registerUser(userData);

      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Registration Failed",
      );
    }
  },
);

// LOGIN USER
export const login = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      const response = await loginUser(userData);

      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Login Failed",
      );
    }
  },
);

// LOGOUT USER
export const logoutAsync = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      const response = await logoutUser();

      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Login Failed",
      );
    }
  },
);
// verify login USER
export const verifyLoginAsync = createAsyncThunk(
  "auth/verify-login",
  async (_, thunkAPI) => {
    try {
      const response = await verifyLoginUser();

      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Login Failed",
      );
    }
  },
);

// AUTH SLICE
const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }

      toast.success("Logged Out");
    },
  },

  extraReducers: (builder) => {
    builder

      // REGISTER
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(register.fulfilled, (state) => {
        state.loading = false;

        toast.success("Registration Successful");
      })

      .addCase(register.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload;

        toast.error(action.payload);
      })

      // LOGIN
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;

        state.user = action.payload.user;

        state.token = action.payload.token;
        state.isLoggedIn = true;
        if (typeof window !== "undefined") {
          localStorage.setItem("token", action.payload.token);
        }

        toast.success("Login Successful");
      })

      .addCase(login.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload;

        toast.error(action.payload);
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isLoggedIn = false;
      })
      .addCase(verifyLoginAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyLoginAsync.fulfilled, (state, action) => {
        state.user = action.payload.data.user;
        state.isLoggedIn = true;
        state.loading = false;
      })
      .addCase(verifyLoginAsync.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.isLoggedIn = false;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
