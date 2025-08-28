// Role-based permissions and capabilities
export const ROLES = {
  ADMIN: 'admin',
  TRAINING_STAFF: 'training_staff',
  PARTICIPANT: 'participant',
  VIEWER: 'viewer'
};

// Permission constants for easy reference
export const PERMISSIONS = {
  // User Management
  CAN_VIEW_ALL_USERS: 'canViewAllUsers',
  CAN_APPROVE_USERS: 'canApproveUsers',
  CAN_APPROVE_TRAINEE_ACCOUNTS: 'canApproveTraineeAccounts',
  CAN_DECLINE_TRAINEE_ACCOUNTS: 'canDeclineTraineeAccounts',
  CAN_APPROVE_ADMIN_ACCOUNTS: 'canApproveAdminAccounts',
  CAN_DECLINE_ADMIN_ACCOUNTS: 'canDeclineAdminAccounts',
  CAN_APPROVE_TRAINING_STAFF_ACCOUNTS: 'canApproveTrainingStaffAccounts',
  CAN_DECLINE_TRAINING_STAFF_ACCOUNTS: 'canDeclineTrainingStaffAccounts',
  CAN_CREATE_USERS: 'canCreateUsers',
  CAN_DELETE_USERS: 'canDeleteUsers',
  CAN_UPDATE_USER_STATUS: 'canUpdateUserStatus',
  CAN_VIEW_USER_DETAILS: 'canViewUserDetails',

  // Training Programs
  CAN_CREATE_TRAINING_PROGRAMS: 'canCreateTrainingPrograms',
  CAN_UPDATE_TRAINING_PROGRAMS: 'canUpdateTrainingPrograms',
  CAN_DELETE_TRAINING_PROGRAMS: 'canDeleteTrainingPrograms',
  CAN_VIEW_ALL_TRAINING_PROGRAMS: 'canViewAllTrainingPrograms',

  // Enrollments and Attendance
  CAN_MANAGE_ENROLLMENTS: 'canManageEnrollments',
  CAN_VIEW_ATTENDANCE: 'canViewAttendance',
  CAN_RECORD_ATTENDANCE: 'canRecordAttendance',
  CAN_BULK_RECORD_ATTENDANCE: 'canBulkRecordAttendance',

  // Session Management
  CAN_UPDATE_SESSION_METADATA: 'canUpdateSessionMetadata',
  CAN_MARK_DAY_COMPLETED: 'canMarkDayCompleted',
  CAN_REOPEN_COMPLETED_DAY: 'canReopenCompletedDay',
  CAN_UPDATE_PROGRAM_END_DATE: 'canUpdateProgramEndDate',

  // Reports and Analytics
  CAN_EXPORT_ATTENDANCE: 'canExportAttendance',
  CAN_VIEW_ATTENDANCE_SUMMARY: 'canViewAttendanceSummary',
  CAN_VIEW_SESSION_METADATA: 'canViewSessionMetadata',
  CAN_VIEW_ANALYTICS: 'canViewAnalytics',
  CAN_GENERATE_REPORTS: 'canGenerateReports',

  // System
  CAN_VIEW_DASHBOARD: 'canViewDashboard',
  CAN_MANAGE_SYSTEM_SETTINGS: 'canManageSystemSettings',
  CAN_VIEW_LOGS: 'canViewLogs',
  CAN_MANAGE_ROLES: 'canManageRoles'
};

// Helper functions for permission checking
export const hasPermission = (userPermissions, permission) => {
  if (!userPermissions) return false;
  return userPermissions[permission] === true;
};

export const hasAnyPermission = (userPermissions, permissions) => {
  if (!userPermissions) return false;
  return permissions.some(permission => userPermissions[permission] === true);
};

export const hasAllPermissions = (userPermissions, permissions) => {
  if (!userPermissions) return false;
  return permissions.every(permission => userPermissions[permission] === true);
};

export const canCreateUserType = (userPermissions, userType) => {
  if (!userPermissions || !userPermissions.canCreateUsers) return false;
  return Array.isArray(userPermissions.canCreateUsers) && 
         userPermissions.canCreateUsers.includes(userType);
};

export const canCreateAnyUserType = (userPermissions) => {
  if (!userPermissions || !userPermissions.canCreateUsers) return false;
  return Array.isArray(userPermissions.canCreateUsers) && 
         userPermissions.canCreateUsers.length > 0;
};

// Role-based UI helpers
export const getRoleDisplayName = (role) => {
  const displayNames = {
    [ROLES.ADMIN]: 'Administrator',
    [ROLES.TRAINING_STAFF]: 'Training Staff',
    [ROLES.PARTICIPANT]: 'Participant',
    [ROLES.VIEWER]: 'Viewer'
  };
  return displayNames[role] || role;
};

export const getRoleColor = (role) => {
  const colors = {
    [ROLES.ADMIN]: 'badge-primary',
    [ROLES.TRAINING_STAFF]: 'badge-secondary',
    [ROLES.PARTICIPANT]: 'badge-accent',
    [ROLES.VIEWER]: 'badge-ghost'
  };
  return colors[role] || 'badge-ghost';
};

// Permission groups for common operations
export const PERMISSION_GROUPS = {
  USER_MANAGEMENT: [
    PERMISSIONS.CAN_VIEW_ALL_USERS,
    PERMISSIONS.CAN_APPROVE_USERS,
    PERMISSIONS.CAN_CREATE_USERS,
    PERMISSIONS.CAN_DELETE_USERS,
    PERMISSIONS.CAN_UPDATE_USER_STATUS,
    PERMISSIONS.CAN_VIEW_USER_DETAILS
  ],
  TRAINING_MANAGEMENT: [
    PERMISSIONS.CAN_CREATE_TRAINING_PROGRAMS,
    PERMISSIONS.CAN_UPDATE_TRAINING_PROGRAMS,
    PERMISSIONS.CAN_DELETE_TRAINING_PROGRAMS,
    PERMISSIONS.CAN_VIEW_ALL_TRAINING_PROGRAMS
  ],
  ATTENDANCE_MANAGEMENT: [
    PERMISSIONS.CAN_VIEW_ATTENDANCE,
    PERMISSIONS.CAN_RECORD_ATTENDANCE,
    PERMISSIONS.CAN_BULK_RECORD_ATTENDANCE,
    PERMISSIONS.CAN_VIEW_ATTENDANCE_SUMMARY
  ],
  REPORTING: [
    PERMISSIONS.CAN_GENERATE_REPORTS,
    PERMISSIONS.CAN_EXPORT_ATTENDANCE,
    PERMISSIONS.CAN_VIEW_ANALYTICS
  ]
};

// Check if user has any permission from a group
export const hasPermissionGroup = (userPermissions, groupName) => {
  const group = PERMISSION_GROUPS[groupName];
  if (!group) return false;
  return hasAnyPermission(userPermissions, group);
};

// Legacy compatibility functions (keeping for backward compatibility)
export const canEditField = (userRole, fieldName) => {
  // This function is now deprecated - use hasPermission instead
  console.warn('canEditField is deprecated. Use hasPermission instead.');
  return false;
};

export const getEditableFields = (userRole) => {
  // This function is now deprecated - use hasPermission instead
  console.warn('getEditableFields is deprecated. Use hasPermission instead.');
  return [];
};

export const canPerformAction = (userRole, action) => {
  // This function is now deprecated - use hasPermission instead
  console.warn('canPerformAction is deprecated. Use hasPermission instead.');
  return false;
}; 