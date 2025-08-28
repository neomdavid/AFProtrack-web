import React from "react";
import { NavLink } from "react-router-dom";
import { adminLinks } from "../../utils";
import logo from "../../assets/AFProTrack_logo.png";
import { ShieldIcon } from "@phosphor-icons/react";
import PermissionGuard from "../PermissionGuard";
import { PERMISSIONS } from "../../utils/rolePermissions";

const Sidebar = ({ drawerOpen, setDrawerOpen }) => {
  return (
    <div className="drawer-side z-[1000]">
      <label
        htmlFor="admin-drawer"
        aria-label="close sidebar"
        className="drawer-overlay"
      ></label>
      <div className="min-h-full w-65 bg-primary bg-gradient-to-b from-primary to-[#8DB684] text-white">
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex items-center justify-center py-8 px-4">
            <img src={logo} className="w-32" alt="AFProTrack Logo" />
          </div>

          {/* Navigation Links */}
          <div className="flex-1 px-4">
            <div className="flex flex-col gap-2">
              {adminLinks.map((link) => {
                // If link has permission requirement, wrap with PermissionGuard
                if (link.requiredPermission === "canApproveUsers") {
                  return (
                    <PermissionGuard
                      key={link.name}
                      requiredPermission={PERMISSIONS.CAN_APPROVE_USERS}
                    >
                      <NavLink
                        to={link.path}
                        onClick={() => setDrawerOpen(false)} // Close drawer on mobile
                        className={({ isActive }) =>
                          `flex py-3 px-4 rounded-lg items-center gap-3 transition-all duration-200 hover:bg-white/20 ${
                            isActive
                              ? "bg-white/20 text-white"
                              : "text-gray-100"
                          }`
                        }
                      >
                        {link.icon}
                        <span className="text-sm font-medium">{link.name}</span>
                      </NavLink>
                    </PermissionGuard>
                  );
                }

                // Regular link without permission requirement
                return (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    onClick={() => setDrawerOpen(false)} // Close drawer on mobile
                    className={({ isActive }) =>
                      `flex py-3 px-4 rounded-lg items-center gap-3 transition-all duration-200 hover:bg-white/20 ${
                        isActive ? "bg-white/20 text-white" : "text-gray-100"
                      }`
                    }
                  >
                    {link.icon}
                    <span className="text-sm font-medium">{link.name}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
