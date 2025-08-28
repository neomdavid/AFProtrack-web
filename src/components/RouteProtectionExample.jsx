import React from "react";
import ProtectedRoute from "./ProtectedRoute";
import AccountConfirmationAccessDenied from "./AccountConfirmationAccessDenied";
import { PERMISSIONS } from "../utils/rolePermissions";

// Example of how to protect the Account Confirmation route
const RouteProtectionExample = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        Route Protection Implementation
      </h1>

      <div className="bg-white border rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Account Confirmation Route Protection
        </h2>
        <p className="text-gray-600 mb-4">
          This shows how to protect the Account Confirmation route so only users
          with approval permissions can access it.
        </p>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Implementation Code:</h3>
          <pre className="text-sm text-gray-700 overflow-x-auto">
            {`// In your routing file (e.g., App.jsx, index.js, or AdminLayout.jsx)
import ProtectedRoute from '../components/ProtectedRoute';
import AccountConfirmationAccessDenied from '../components/AccountConfirmationAccessDenied';
import { PERMISSIONS } from '../utils/rolePermissions';

// Protected route for Account Confirmation
<ProtectedRoute 
  requiredPermission={PERMISSIONS.CAN_APPROVE_USERS}
  fallback={<AccountConfirmationAccessDenied />}
>
  <AccountConfirmationPage />
</ProtectedRoute>

// Or if you want to redirect to login instead:
<ProtectedRoute 
  requiredPermission={PERMISSIONS.CAN_APPROVE_USERS}
  redirectTo="/login"
>
  <AccountConfirmationPage />
</ProtectedRoute>`}
          </pre>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Navigation Menu Protection
        </h2>
        <p className="text-gray-600 mb-4">
          Also protect the navigation menu item so users without permission
          don't see it.
        </p>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Navigation Implementation:</h3>
          <pre className="text-sm text-gray-700 overflow-x-auto">
            {`// In your navigation/sidebar component
import PermissionGuard from '../components/PermissionGuard';
import { PERMISSIONS } from '../utils/rolePermissions';

<PermissionGuard requiredPermission={PERMISSIONS.CAN_APPROVE_USERS}>
  <li className="nav-item">
    <Link to="/admin/account-confirmation" className="nav-link">
      <UserIcon className="nav-icon" />
      <span>Account Confirmation</span>
    </Link>
  </li>
</PermissionGuard>`}
          </pre>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Alternative: Multiple Permission Requirements
        </h2>
        <p className="text-gray-600 mb-4">
          You can also require multiple permissions for more sensitive
          operations.
        </p>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Multiple Permissions Example:</h3>
          <pre className="text-sm text-gray-700 overflow-x-auto">
            {`// Require ALL permissions (user must have both)
<ProtectedRoute 
  requiredPermissions={[
    PERMISSIONS.CAN_APPROVE_USERS, 
    PERMISSIONS.CAN_VIEW_ALL_USERS
  ]}
  requireAll={true}
  fallback={<AccountConfirmationAccessDenied />}
>
  <AccountConfirmationPage />
</ProtectedRoute>

// Require ANY permission (user can have either)
<ProtectedRoute 
  requiredPermissions={[
    PERMISSIONS.CAN_APPROVE_USERS, 
    PERMISSIONS.CAN_VIEW_ALL_USERS
  ]}
  requireAny={true}
  fallback={<AccountConfirmationAccessDenied />}
>
  <AccountConfirmationPage />
</ProtectedRoute>`}
          </pre>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">
          Benefits of This Approach
        </h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>
            <strong>Security:</strong> Route is completely protected at the
            routing level
          </li>
          <li>
            <strong>User Experience:</strong> Clear messaging about why access
            is denied
          </li>
          <li>
            <strong>Navigation:</strong> Menu items are hidden for users without
            permission
          </li>
          <li>
            <strong>Flexibility:</strong> Easy to customize fallback messages
            and actions
          </li>
          <li>
            <strong>Maintainability:</strong> Centralized permission logic
          </li>
        </ul>
      </div>
    </div>
  );
};

export default RouteProtectionExample;
