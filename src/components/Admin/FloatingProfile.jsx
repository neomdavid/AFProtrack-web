import {
  ShieldIcon,
  UserCircleIcon,
  SignOutIcon,
  UserIcon,
  CaretDownIcon,
} from "@phosphor-icons/react";
import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const FloatingProfile = ({ isSticky, onOpenProfileModal }) => {
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
    console.log("View Profile clicked!");
    onOpenProfileModal();
    setIsDropdownOpen(false);
  };

  // Get user's rank from user data or use default
  const getUserRank = () => {
    if (user?.rank) return user.rank;
    if (user?.role === "admin") return "System";
    if (user?.role === "trainer") return "Lt.";
    return "User";
  };

  // Get display name
  const getDisplayName = () => {
    if (user?.fullName) return user.fullName;
    if (user?.firstName && user?.lastName)
      return `${user.firstName} ${user.lastName}`;
    return "User";
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
    <>
      <div className="fixed top-6 right-8 z-20" ref={dropdownRef}>
        <div
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`
transition-all duration-300 ease-in-out px-4 py-3 flex items-center gap-1.5 rounded-3xl cursor-pointer hover:bg-white/10
${
  isSticky || isDropdownOpen
    ? "backdrop-blur-lg shadow bg-white/20"
    : "bg-transparent"
}
`}
        >
          {user?.avatar ? (
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">
              {user.avatar}
            </div>
          ) : (
            <UserCircleIcon size={39} />
          )}
          <div className="flex flex-col items-start gap-1">
            <p className="text-xs text-gray-700 mb-[-3px]">{getUserRank()}</p>
            <p className="text-sm flex font-light">{getDisplayName()}</p>
            <div className="flex items-center gap-0.5 text-success-content text-xs bg-base-success px-2 py-1 ml-[-3px] border border-success-content rounded-2xl">
              <ShieldIcon size={13} weight="bold" />
              <p className="mb-[-2px] text-[11px] capitalize">
                {getFormattedRole()}
              </p>
            </div>
          </div>
          <CaretDownIcon
            size={16}
            className={`transition-transform duration-200 ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </div>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
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
    </>
  );
};

export default FloatingProfile;
