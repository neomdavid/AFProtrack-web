import {
  ShieldIcon,
  UserCircleIcon,
  SignOutIcon,
  UserIcon,
  CaretDownIcon,
} from "@phosphor-icons/react";
import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
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
    navigate("/login");
    setIsDropdownOpen(false);
  };

  const handleViewProfile = () => {
    console.log("View Profile clicked!");
    onOpenProfileModal();
    setIsDropdownOpen(false);
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
          <UserCircleIcon size={39} />
          <div className="flex flex-col gap-1">
            <p className="text-xs text-gray-700 mb-[-3px]">Lt.</p>
            <p className="text-sm flex font-light">Surname, FN</p>
            <div className="flex items-center gap-0.5 text-success-content text-xs bg-base-success px-2 py-1 ml-[-3px] border border-success-content rounded-2xl">
              <ShieldIcon size={13} weight="bold" />
              <p className="mb-[-2px] text-[11px]">Admin Access</p>
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
