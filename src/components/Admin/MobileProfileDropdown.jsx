import {
  UserCircleIcon,
  SignOutIcon,
  UserIcon,
  CaretDownIcon,
} from "@phosphor-icons/react";
import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const MobileProfileDropdown = ({ onOpenProfileModal }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  const handleViewProfile = () => {
    onOpenProfileModal();
    setIsDropdownOpen(false);
  };

  // Format role for display
  const getFormattedRole = () => {
    if (!user?.role) return "User";
    if (user.role === "admin") return "Admin";
    if (user.role === "training_staff") return "Training Staff";
    return user.role
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors duration-200"
      >
        <UserCircleIcon size={32} className="text-gray-700" />
        <CaretDownIcon
          size={16}
          className={`transition-transform duration-200 text-gray-600 ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          <div className="px-4 py-2 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <UserCircleIcon size={24} className="text-gray-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {user?.fullName || 'User'}
                </p>
                <p className="text-xs text-gray-500">{getFormattedRole()}</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleViewProfile}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:cursor-pointer flex items-center gap-2"
          >
            <UserIcon size={16} />
            View Profile
          </button>
          <div className="border-t border-gray-200 my-1"></div>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 hover:cursor-pointer flex items-center gap-2"
          >
            <SignOutIcon size={16} />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default MobileProfileDropdown;
