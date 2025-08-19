import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks for authentication actions
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ serviceId, password }, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ serviceId, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Login failed');
      }

      if (data.success && data.data) {
        const userData = {
          id: data.data.user._id,
          serviceId: data.data.user.serviceId,
          firstName: data.data.user.firstName,
          lastName: data.data.user.lastName,
          fullName: data.data.user.fullName,
          email: data.data.user.email,
          role: data.data.user.role,
          accountType: data.data.user.accountType,
          unit: data.data.user.unit,
          branchOfService: data.data.user.branchOfService,
          division: data.data.user.division,
          accountStatus: data.data.user.accountStatus,
          isActive: data.data.user.isActive,
          isVerified: data.data.user.isVerified,
          lastLogin: data.data.user.lastLogin,
          avatar: data.data.user.avatar,
        };

        // Store user data and token in localStorage
        localStorage.setItem("afprotrack_user", JSON.stringify(userData));
        localStorage.setItem("afprotrack_token", data.data.token);

        return userData;
      } else {
        return rejectWithValue(data.message || 'Login failed');
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async () => {
    localStorage.removeItem("afprotrack_user");
    localStorage.removeItem("afprotrack_token");
    return null;
  }
);

export const checkAuthStatus = createAsyncThunk(
  'auth/checkStatus',
  async (_, { rejectWithValue }) => {
    try {
      const storedUser = localStorage.getItem("afprotrack_user");
      const token = localStorage.getItem("afprotrack_token");
      
      if (storedUser && token) {
        const userData = JSON.parse(storedUser);
        return userData;
      }
      return null;
    } catch (error) {
      localStorage.removeItem("afprotrack_user");
      localStorage.removeItem("afprotrack_token");
      return rejectWithValue("Invalid stored user data");
    }
  }
);

export const requestPasswordReset = createAsyncThunk(
  'auth/requestPasswordReset',
  async (email, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (email && email.includes("@")) {
        const mockOTP = Math.floor(100000 + Math.random() * 900000).toString();
        console.log("Mock OTP for testing:", mockOTP);
        
        return {
          success: true,
          message: "OTP sent successfully",
          otp: mockOTP,
        };
      } else {
        throw new Error("Valid email address is required");
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (email && otp && otp.length === 6) {
        const mockToken = Math.random().toString(36).substring(2, 15) +
          Math.random().toString(36).substring(2, 15);

        return {
          success: true,
          message: "OTP verified successfully",
          token: mockToken,
        };
      } else {
        throw new Error("Invalid OTP");
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, newPassword }, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (token && newPassword) {
        return { success: true, message: "Password reset successfully" };
      } else {
        throw new Error("Invalid token or password");
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  passwordReset: {
    isLoading: false,
    error: null,
    success: false,
  },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearPasswordResetState: (state) => {
      state.passwordReset = {
        isLoading: false,
        error: null,
        success: false,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      // Check Auth Status
      .addCase(checkAuthStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.user = action.payload;
          state.isAuthenticated = true;
        }
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      // Password Reset
      .addCase(requestPasswordReset.pending, (state) => {
        state.passwordReset.isLoading = true;
        state.passwordReset.error = null;
      })
      .addCase(requestPasswordReset.fulfilled, (state, action) => {
        state.passwordReset.isLoading = false;
        state.passwordReset.success = true;
        state.passwordReset.error = null;
      })
      .addCase(requestPasswordReset.rejected, (state, action) => {
        state.passwordReset.isLoading = false;
        state.passwordReset.error = action.payload;
      })
      // Verify OTP
      .addCase(verifyOTP.pending, (state) => {
        state.passwordReset.isLoading = true;
        state.passwordReset.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.passwordReset.isLoading = false;
        state.passwordReset.success = true;
        state.passwordReset.error = null;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.passwordReset.isLoading = false;
        state.passwordReset.error = action.payload;
      })
      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.passwordReset.isLoading = true;
        state.passwordReset.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.passwordReset.isLoading = false;
        state.passwordReset.success = true;
        state.passwordReset.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.passwordReset.isLoading = false;
        state.passwordReset.error = action.payload;
      });
  },
});

export const { clearError, clearPasswordResetState } = authSlice.actions;

// Selectors
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;
export const selectPasswordResetState = (state) => state.auth.passwordReset;

export default authSlice.reducer;
