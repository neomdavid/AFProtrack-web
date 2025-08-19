import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  selectUser,
  selectIsAuthenticated,
  selectIsLoading,
  selectAuthError,
  selectPasswordResetState,
  loginUser,
  logoutUser,
  checkAuthStatus,
  requestPasswordReset,
  verifyOTP,
  resetPassword,
  clearError,
  clearPasswordResetState,
} from '../features/auth/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectAuthError);
  const passwordResetState = useSelector(selectPasswordResetState);

  // Check auth status on mount
  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  const login = async (serviceId, password) => {
    const result = await dispatch(loginUser({ serviceId, password }));
    if (loginUser.fulfilled.match(result)) {
      return { success: true };
    } else {
      return { success: false, error: result.payload };
    }
  };

  const logout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  const requestPasswordResetAction = async (email) => {
    const result = await dispatch(requestPasswordReset(email));
    if (requestPasswordReset.fulfilled.match(result)) {
      return result.payload;
    } else {
      return { success: false, error: result.payload };
    }
  };

  const verifyOTPAction = async (email, otp) => {
    const result = await dispatch(verifyOTP({ email, otp }));
    if (verifyOTP.fulfilled.match(result)) {
      return result.payload;
    } else {
      return { success: false, error: result.payload };
    }
  };

  const resetPasswordAction = async (token, newPassword) => {
    const result = await dispatch(resetPassword({ token, newPassword }));
    if (resetPassword.fulfilled.match(result)) {
      return result.payload;
    } else {
      return { success: false, error: result.payload };
    }
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  const clearPasswordReset = () => {
    dispatch(clearPasswordResetState());
  };

  return {
    user,
    setUser: null, // Not needed with Redux - use dispatch instead
    isAuthenticated,
    isLoading,
    error,
    passwordResetState,
    login,
    logout,
    requestPasswordReset: requestPasswordResetAction,
    verifyOTP: verifyOTPAction,
    resetPassword: resetPasswordAction,
    clearError: clearAuthError,
    clearPasswordResetState: clearPasswordReset,
  };
};
