import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
} from "../features/auth/authSlice";
import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  canCreateUserType,
  canCreateAnyUserType,
  hasPermissionGroup,
  PERMISSIONS,
  PERMISSION_GROUPS,
} from "../utils/rolePermissions";

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
    // Always check auth status on mount to handle direct navigation to protected routes
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
    navigate("/login");
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

  // Permission checking functions
  const checkPermission = (permission) => {
    return hasPermission(user?.permissions, permission);
  };

  const checkAnyPermission = (permissions) => {
    return hasAnyPermission(user?.permissions, permissions);
  };

  const checkAllPermissions = (permissions) => {
    return hasAllPermissions(user?.permissions, permissions);
  };

  const checkCanCreateUserType = (userType) => {
    return canCreateUserType(user?.permissions, userType);
  };

  const checkCanCreateAnyUserType = () => {
    return canCreateAnyUserType(user?.permissions);
  };

  const checkPermissionGroup = (groupName) => {
    return hasPermissionGroup(user?.permissions, groupName);
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
    // Permission checking functions
    checkPermission,
    checkAnyPermission,
    checkAllPermissions,
    checkCanCreateUserType,
    checkCanCreateAnyUserType,
    checkPermissionGroup,
    // Permission constants
    PERMISSIONS,
    PERMISSION_GROUPS,
  };
};
