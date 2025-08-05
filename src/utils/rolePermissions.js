// Role-based permissions and capabilities
export const ROLES = {
  ADMIN: 'admin',
  TRAINING_STAFF: 'training_staff',
  PARTICIPANT: 'participant',
  VIEWER: 'viewer'
};

// Define what each role can do
export const ROLE_CAPABILITIES = {
  [ROLES.ADMIN]: {
    canCreatePrograms: true,
    canEditPrograms: true,
    canDeletePrograms: true,
    canViewAllPrograms: true,
    canManageUsers: true,
    canViewReports: true,
    canEditAllFields: true,
    editableFields: ['name', 'startDate', 'endDate', 'time', 'instructor', 'venue', 'participants', 'additionalDetails']
  },
  [ROLES.TRAINING_STAFF]: {
    canCreatePrograms: false,
    canEditPrograms: true,
    canDeletePrograms: false,
    canViewAllPrograms: true,
    canManageUsers: false,
    canViewReports: true,
    canEditAllFields: false,
    editableFields: ['instructor', 'venue', 'time', 'additionalDetails']
  },
  [ROLES.PARTICIPANT]: {
    canCreatePrograms: false,
    canEditPrograms: false,
    canDeletePrograms: false,
    canViewAllPrograms: false,
    canManageUsers: false,
    canViewReports: false,
    canEditAllFields: false,
    editableFields: []
  },
  [ROLES.VIEWER]: {
    canCreatePrograms: false,
    canEditPrograms: false,
    canDeletePrograms: false,
    canViewAllPrograms: true,
    canManageUsers: false,
    canViewReports: true,
    canEditAllFields: false,
    editableFields: []
  }
};

// Helper functions
export const hasPermission = (userRole, permission) => {
  const capabilities = ROLE_CAPABILITIES[userRole];
  return capabilities ? capabilities[permission] : false;
};

export const canEditField = (userRole, fieldName) => {
  const capabilities = ROLE_CAPABILITIES[userRole];
  return capabilities ? capabilities.editableFields.includes(fieldName) : false;
};

export const getEditableFields = (userRole) => {
  const capabilities = ROLE_CAPABILITIES[userRole];
  return capabilities ? capabilities.editableFields : [];
};

export const canPerformAction = (userRole, action) => {
  const actionMap = {
    'create_program': 'canCreatePrograms',
    'edit_program': 'canEditPrograms',
    'delete_program': 'canDeletePrograms',
    'view_all_programs': 'canViewAllPrograms',
    'manage_users': 'canManageUsers',
    'view_reports': 'canViewReports'
  };
  
  const permission = actionMap[action];
  return permission ? hasPermission(userRole, permission) : false;
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