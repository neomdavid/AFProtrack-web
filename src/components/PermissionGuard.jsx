import React from "react";
import { useAuth } from "../hooks/useAuth";

// PermissionGuard component for conditional rendering based on permissions
const PermissionGuard = ({
  children,
  fallback = null,
  requiredPermission = null,
  requiredPermissions = [],
  requireAny = false,
  requireAll = false,
  showIfNoPermission = false, // If true, shows children when user has NO permission
}) => {
  const { checkPermission, checkAnyPermission, checkAllPermissions } =
    useAuth();

  // If no permission requirements, just render children
  if (!requiredPermission && requiredPermissions.length === 0) {
    return children;
  }

  let hasAccess = false;

  // Check single permission
  if (requiredPermission) {
    hasAccess = checkPermission(requiredPermission);
  }
  // Check multiple permissions
  else if (requiredPermissions.length > 0) {
    if (requireAll) {
      hasAccess = checkAllPermissions(requiredPermissions);
    } else if (requireAny) {
      hasAccess = checkAnyPermission(requiredPermissions);
    } else {
      // Default to requiring all permissions
      hasAccess = checkAllPermissions(requiredPermissions);
    }
  }

  // If showIfNoPermission is true, invert the logic
  const shouldShow = showIfNoPermission ? !hasAccess : hasAccess;

  if (shouldShow) {
    return children;
  }

  return fallback;
};

export default PermissionGuard;
