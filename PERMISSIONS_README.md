# AFProTrack Permission System

This document describes the comprehensive permission system implemented in AFProTrack that works with the backend permissions response.

## Overview

The permission system is designed to work with the backend's granular permissions structure, where each user has a `permissions` object containing boolean flags and arrays for different capabilities.

## Backend Permissions Structure

The backend returns permissions in this format:

```json
{
  "permissions": {
    "canViewAllUsers": true,
    "canApproveUsers": false,
    "canCreateUsers": ["admin", "training_staff"],
    "canCreateTrainingPrograms": true,
    "canViewAnalytics": false
    // ... more permissions
  }
}
```

## Core Components

### 1. `rolePermissions.js` - Permission Constants and Utilities

Located at `src/utils/rolePermissions.js`, this file contains:

- **Permission Constants**: All available permissions as constants
- **Helper Functions**: Functions to check permissions
- **Permission Groups**: Logical groupings of related permissions

#### Key Functions:

```javascript
import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  canCreateUserType,
  hasPermissionGroup,
} from "../utils/rolePermissions";

// Check single permission
const canViewUsers = hasPermission(userPermissions, "canViewAllUsers");

// Check if user has ANY of the specified permissions
const canViewData = hasAnyPermission(userPermissions, [
  "canViewAnalytics",
  "canGenerateReports",
]);

// Check if user has ALL of the specified permissions
const canManagePrograms = hasAllPermissions(userPermissions, [
  "canCreateTrainingPrograms",
  "canUpdateTrainingPrograms",
]);

// Check if user can create specific user type
const canCreateAdmin = canCreateUserType(userPermissions, "admin");

// Check permission group
const hasUserManagement = hasPermissionGroup(
  userPermissions,
  "USER_MANAGEMENT"
);
```

### 2. `useAuth` Hook - Enhanced with Permission Functions

The `useAuth` hook now includes permission checking functions:

```javascript
import { useAuth } from "../hooks/useAuth";

const {
  checkPermission,
  checkAnyPermission,
  checkAllPermissions,
  checkCanCreateUserType,
  checkPermissionGroup,
  PERMISSIONS,
  PERMISSION_GROUPS,
} = useAuth();

// Usage examples
const canViewUsers = checkPermission(PERMISSIONS.CAN_VIEW_ALL_USERS);
const canCreatePrograms = checkPermission(
  PERMISSIONS.CAN_CREATE_TRAINING_PROGRAMS
);
```

### 3. `PermissionGuard` Component - Conditional Rendering

Use `PermissionGuard` to conditionally render content based on permissions:

```javascript
import PermissionGuard from '../components/PermissionGuard';
import { PERMISSIONS } from '../utils/rolePermissions';

// Single permission required
<PermissionGuard requiredPermission={PERMISSIONS.CAN_VIEW_ANALYTICS}>
  <AnalyticsDashboard />
</PermissionGuard>

// Multiple permissions required (ALL)
<PermissionGuard
  requiredPermissions={[PERMISSIONS.CAN_VIEW_USERS, PERMISSIONS.CAN_APPROVE_USERS]}
  requireAll={true}
>
  <UserApprovalPanel />
</PermissionGuard>

// Multiple permissions required (ANY)
<PermissionGuard
  requiredPermissions={[PERMISSIONS.CAN_VIEW_REPORTS, PERMISSIONS.CAN_EXPORT_DATA]}
  requireAny={true}
>
  <ReportsSection />
</PermissionGuard>

// Custom fallback
<PermissionGuard
  requiredPermission={PERMISSIONS.CAN_MANAGE_SYSTEM}
  fallback={<AccessDeniedMessage />}
>
  <SystemSettings />
</PermissionGuard>
```

### 4. `ProtectedRoute` Component - Route Protection

Use `ProtectedRoute` to protect entire routes based on permissions:

```javascript
import ProtectedRoute from '../components/ProtectedRoute';

// Single permission required
<ProtectedRoute requiredPermission={PERMISSIONS.CAN_VIEW_ANALYTICS}>
  <AnalyticsPage />
</ProtectedRoute>

// Multiple permissions with custom fallback
<ProtectedRoute
  requiredPermissions={[PERMISSIONS.CAN_VIEW_USERS, PERMISSIONS.CAN_APPROVE_USERS]}
  requireAll={true}
  fallback={<UserAccessDenied />}
>
  <UserManagementPage />
</ProtectedRoute>
```

## Available Permissions

### User Management

- `CAN_VIEW_ALL_USERS` - View all users in the system
- `CAN_APPROVE_USERS` - Approve user account requests
- `CAN_APPROVE_TRAINEE_ACCOUNTS` - Approve trainee accounts
- `CAN_APPROVE_ADMIN_ACCOUNTS` - Approve admin accounts
- `CAN_APPROVE_TRAINING_STAFF_ACCOUNTS` - Approve training staff accounts
- `CAN_CREATE_USERS` - Array of user types that can be created
- `CAN_DELETE_USERS` - Delete user accounts
- `CAN_UPDATE_USER_STATUS` - Update user account status
- `CAN_VIEW_USER_DETAILS` - View detailed user information

### Training Programs

- `CAN_CREATE_TRAINING_PROGRAMS` - Create new training programs
- `CAN_UPDATE_TRAINING_PROGRAMS` - Modify existing training programs
- `CAN_DELETE_TRAINING_PROGRAMS` - Delete training programs
- `CAN_VIEW_ALL_TRAINING_PROGRAMS` - View all training programs

### Attendance Management

- `CAN_MANAGE_ENROLLMENTS` - Manage program enrollments
- `CAN_VIEW_ATTENDANCE` - View attendance records
- `CAN_RECORD_ATTENDANCE` - Record individual attendance
- `CAN_BULK_RECORD_ATTENDANCE` - Record attendance in bulk

### Session Management

- `CAN_UPDATE_SESSION_METADATA` - Update session information
- `CAN_MARK_DAY_COMPLETED` - Mark training days as completed
- `CAN_REOPEN_COMPLETED_DAY` - Reopen completed training days
- `CAN_UPDATE_PROGRAM_END_DATE` - Modify program end dates

### Reports and Analytics

- `CAN_EXPORT_ATTENDANCE` - Export attendance data
- `CAN_VIEW_ATTENDANCE_SUMMARY` - View attendance summaries
- `CAN_VIEW_SESSION_METADATA` - View session metadata
- `CAN_VIEW_ANALYTICS` - Access analytics dashboard
- `CAN_GENERATE_REPORTS` - Generate system reports

### System Access

- `CAN_VIEW_DASHBOARD` - Access main dashboard
- `CAN_MANAGE_SYSTEM_SETTINGS` - Modify system configuration
- `CAN_VIEW_LOGS` - View system logs
- `CAN_MANAGE_ROLES` - Manage user roles and permissions

## Permission Groups

The system includes predefined permission groups for common operations:

- **USER_MANAGEMENT**: All user-related permissions
- **TRAINING_MANAGEMENT**: Training program permissions
- **ATTENDANCE_MANAGEMENT**: Attendance-related permissions
- **REPORTING**: Reporting and analytics permissions

## Usage Examples

### Basic Permission Checking

```javascript
import { useAuth } from "../hooks/useAuth";
import { PERMISSIONS } from "../utils/rolePermissions";

const MyComponent = () => {
  const { checkPermission } = useAuth();

  if (checkPermission(PERMISSIONS.CAN_CREATE_TRAINING_PROGRAMS)) {
    return <CreateProgramButton />;
  }

  return <ReadOnlyView />;
};
```

### Conditional UI Elements

```javascript
const AdminPanel = () => {
  const { checkPermission, PERMISSIONS } = useAuth();

  return (
    <div>
      <h1>Admin Panel</h1>

      {checkPermission(PERMISSIONS.CAN_VIEW_ALL_USERS) && (
        <UserManagementSection />
      )}

      {checkPermission(PERMISSIONS.CAN_VIEW_ANALYTICS) && <AnalyticsSection />}

      {checkPermission(PERMISSIONS.CAN_MANAGE_SYSTEM_SETTINGS) && (
        <SystemSettingsSection />
      )}
    </div>
  );
};
```

### Form Field Permissions

```javascript
const TrainingProgramForm = () => {
  const { checkPermission, PERMISSIONS } = useAuth();

  return (
    <form>
      <input name="name" placeholder="Program Name" />

      {checkPermission(PERMISSIONS.CAN_UPDATE_PROGRAM_END_DATE) && (
        <input type="date" name="endDate" />
      )}

      {checkPermission(PERMISSIONS.CAN_UPDATE_SESSION_METADATA) && (
        <textarea name="notes" placeholder="Session Notes" />
      )}

      <div className="actions">
        {checkPermission(PERMISSIONS.CAN_CREATE_TRAINING_PROGRAMS) && (
          <button type="submit">Create Program</button>
        )}

        {checkPermission(PERMISSIONS.CAN_UPDATE_TRAINING_PROGRAMS) && (
          <button type="button">Update Program</button>
        )}
      </div>
    </form>
  );
};
```

### Navigation with Permissions

```javascript
const Navigation = () => {
  const { checkPermission, PERMISSIONS } = useAuth();

  return (
    <nav>
      <ul>
        {checkPermission(PERMISSIONS.CAN_VIEW_DASHBOARD) && (
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
        )}

        {checkPermission(PERMISSIONS.CAN_VIEW_ALL_USERS) && (
          <li>
            <Link to="/users">User Management</Link>
          </li>
        )}

        {checkPermission(PERMISSIONS.CAN_VIEW_ALL_TRAINING_PROGRAMS) && (
          <li>
            <Link to="/programs">Training Programs</Link>
          </li>
        )}

        {checkPermission(PERMISSIONS.CAN_VIEW_ATTENDANCE) && (
          <li>
            <Link to="/attendance">Attendance</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};
```

## Best Practices

1. **Use Permission Constants**: Always use the constants from `PERMISSIONS` instead of hardcoded strings
2. **Check Permissions Early**: Check permissions at the component level before rendering expensive content
3. **Provide Fallbacks**: Always provide meaningful fallback content when permissions are denied
4. **Group Related Permissions**: Use permission groups for complex permission checks
5. **Test Permission Scenarios**: Test your components with different permission combinations

## Migration from Old System

If you're migrating from the old role-based system:

1. Replace `hasPermission(userRole, permission)` with `checkPermission(permission)`
2. Replace `canEditField(userRole, fieldName)` with `checkPermission(PERMISSIONS.CAN_UPDATE_TRAINING_PROGRAMS)`
3. Update your components to use the new permission constants
4. Use `PermissionGuard` and `ProtectedRoute` for conditional rendering and route protection

## Testing

The system includes example components that demonstrate all the features:

- `PermissionExample.jsx` - Basic permission checking examples
- `UsageExamples.jsx` - Comprehensive usage patterns
- `ProtectedRoute.jsx` - Route protection examples
- `PermissionGuard.jsx` - Conditional rendering examples

## Troubleshooting

### Common Issues

1. **Permissions not working**: Ensure the backend is returning the `permissions` object in the user data
2. **Permission constants undefined**: Check that you're importing from the correct path
3. **Route protection not working**: Verify that `ProtectedRoute` is properly configured with the required permissions

### Debug Tips

1. Use the `PermissionExample` component to see your current permissions
2. Check the browser console for permission-related warnings
3. Verify that the `useAuth` hook is properly connected to your Redux store

## Support

For questions or issues with the permission system, refer to:

- The example components in `src/components/`
- The permission utilities in `src/utils/rolePermissions.js`
- The enhanced `useAuth` hook in `src/hooks/useAuth.js`
