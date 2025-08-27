import React, { useState, useEffect, useRef } from "react";
import {
  UserIcon,
  EnvelopeIcon,
  ShieldIcon,
  PencilIcon,
  CheckIcon,
  XIcon,
  StarIcon,
  BriefcaseIcon,
  CalendarIcon,
  FlagIcon,
  MapPinIcon,
  PhoneIcon,
} from "@phosphor-icons/react";
import { useAuth } from "../../hooks/useAuth";

const ProfileModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const modalRef = useRef(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    serviceId: "",
    role: "",
    firstName: "",
    lastName: "",
    unit: "",
    branchOfService: "",
    division: "",
    avatar: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Debug: Log user data
  useEffect(() => {
    console.log("ProfileModal - User data:", user);
  }, [user]);

  // Initialize form data when user data is available
  useEffect(() => {
    if (user) {
      console.log("ProfileModal - Setting form data with user:", user);
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        serviceId: user.serviceId || "",
        role: user.role || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        unit: user.unit || "",
        branchOfService: user.branchOfService || "",
        division: user.division || "",
        avatar: user.avatar || "",
      });
    }
  }, [user]);

  // Handle body overflow when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call to update user profile
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original user data
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        serviceId: user.serviceId || "",
        role: user.role || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        unit: user.unit || "",
        branchOfService: user.branchOfService || "",
        division: user.division || "",
        avatar: user.avatar || "",
      });
    }
    setIsEditing(false);
  };

  const getRoleDisplayName = (role) => {
    const roleMap = {
      admin: "Administrator",
      user: "User",
      staff: "Staff",
    };
    return roleMap[role] || role;
  };

  console.log(
    "ProfileModal render - isOpen:",
    isOpen,
    "User:",
    user,
    "FormData:",
    formData
  );
  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className={`fixed inset-0 z-100000 flex items-center justify-center ${
        isOpen ? "block" : "hidden"
      }`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative w-11/12 max-w-2xl lg:max-w-4xl bg-white rounded-lg shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* X Close Button */}
        <button
          className="absolute top-3 sm:top-5 right-4 z-20 btn btn-sm btn-circle btn-ghost"
          onClick={onClose}
        >
          <XIcon size={20} weight="bold" className="text-black" />
        </button>

        {/* Header - Sticky Top */}
        <div className="sticky top-0 bg-white z-10 px-6 py-4 sm:py-6 border-b border-gray-200">
          <h3 className="font-bold text-md sm:text-lg sm:text-2xl lg:text-2xl text-black">
            Profile Information
          </h3>
        </div>

        {/* Profile Content - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {/* Profile Picture Section */}
          <div className="flex justify-center mb-6">
            <div className="avatar">
              <div className="w-20 h-20 rounded-full overflow-hidden">
                <div className="w-full h-full bg-primary text-primary-content rounded-full flex items-center justify-center text-2xl font-bold">
                  {user?.avatar ||
                    user?.fullName
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase() ||
                    "U"}
                </div>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Personal Information Section */}
            <div>
              <h4 className="font-semibold text-md sm:text-lg mb-4 text-black flex items-center gap-2">
                <UserIcon size={20} />
                Personal Information
              </h4>
              <div className="space-y-4 text-sm sm:text-md">
                {/* First Name & Last Name Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-control text-sm sm:text-md">
                    <label className="label">
                      <span className="label-text font-semibold">
                        First Name
                      </span>
                    </label>
                    <div className="input input-bordered w-full bg-base-200 flex items-center gap-2">
                      <UserIcon size={16} />
                      {formData.firstName || "undefined"}
                    </div>
                  </div>

                  <div className="form-control text-sm sm:text-md">
                    <label className="label">
                      <span className="label-text font-semibold">
                        Last Name
                      </span>
                    </label>
                    <div className="input input-bordered w-full bg-base-200 flex items-center gap-2">
                      <UserIcon size={16} />
                      {formData.lastName || "undefined"}
                    </div>
                  </div>
                </div>

                {/* Service ID Field */}
                <div className="form-control text-sm sm:text-md">
                  <label className="label">
                    <span className="label-text font-semibold">Service ID</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="serviceId"
                      value={formData.serviceId}
                      onChange={handleInputChange}
                      className="input input-bordered w-full"
                      placeholder="Enter your service ID"
                    />
                  ) : (
                    <div className="input input-bordered w-full bg-base-200 flex items-center gap-2">
                      <BriefcaseIcon size={16} />
                      {formData.serviceId || "undefined"}
                    </div>
                  )}
                </div>

                {/* Avatar Field */}
                <div className="form-control text-sm sm:text-md">
                  <label className="label">
                    <span className="label-text font-semibold">Avatar</span>
                  </label>
                  <div className="input input-bordered w-full bg-base-200 flex items-center gap-2">
                    <UserIcon size={16} />
                    {formData.avatar || "undefined"}
                  </div>
                </div>
              </div>
            </div>

            {/* Service Information Section */}
            <div>
              <h4 className="font-semibold text-md sm:text-lg mb-4 text-black flex items-center gap-2">
                <ShieldIcon size={20} />
                Service Information
              </h4>
              <div className="space-y-4">
                {/* Unit Field */}
                <div className="form-control text-sm sm:text-md">
                  <label className="label">
                    <span className="label-text font-semibold">Unit</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="unit"
                      value={formData.unit}
                      onChange={handleInputChange}
                      className="input input-bordered w-full"
                      placeholder="Enter your unit"
                    />
                  ) : (
                    <div className="input input-bordered w-full bg-base-200 flex items-center gap-2">
                      <ShieldIcon size={16} />
                      {formData.unit || "undefined"}
                    </div>
                  )}
                </div>

                {/* Branch of Service Field */}
                <div className="form-control text-sm sm:text-md">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Branch of Service
                    </span>
                  </label>
                  <div className="input input-bordered w-full bg-base-200 flex items-center gap-2">
                    <FlagIcon size={16} />
                    {formData.branchOfService || "undefined"}
                  </div>
                </div>

                {/* Division Field */}
                <div className="form-control text-sm sm:text-md">
                  <label className="label">
                    <span className="label-text font-semibold">Division</span>
                  </label>
                  <div className="input input-bordered w-full bg-base-200 flex items-center gap-2">
                    <MapPinIcon size={16} />
                    {formData.division || "undefined"}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div>
              <h4 className="font-semibold text-md sm:text-lg mb-4 text-black flex items-center gap-2">
                <EnvelopeIcon size={20} />
                Contact Information
              </h4>
              <div className="space-y-4">
                {/* Email Field */}
                <div className="form-control text-sm sm:text-md">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Email Address
                    </span>
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="input input-bordered w-full"
                      placeholder="Enter your email address"
                    />
                  ) : (
                    <div className="input input-bordered w-full bg-base-200 flex items-center gap-2">
                      <EnvelopeIcon size={16} />
                      {formData.email || "undefined"}
                    </div>
                  )}
                </div>

                {/* Role Field */}
                <div className="form-control text-sm sm:text-md">
                  <label className="label">
                    <span className="label-text font-semibold">Role</span>
                  </label>
                  {isEditing ? (
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="select select-bordered w-full"
                    >
                      <option value="user">User</option>
                      <option value="staff">Staff</option>
                      <option value="admin">Administrator</option>
                    </select>
                  ) : (
                    <div className="input input-bordered w-full bg-base-200 flex items-center gap-2">
                      <ShieldIcon size={16} />
                      {getRoleDisplayName(formData.role) || "undefined"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons - Sticky Bottom */}
        <div className="sticky bottom-0 bg-white z-10 px-6 py-4 border-t border-gray-200">
          <div className="flex justify-end gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="btn btn-outline"
                  disabled={isLoading}
                >
                  <XIcon size={16} />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <CheckIcon size={16} />
                  )}
                  Save Changes
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onClose}
                  className="btn btn-sm sm:btn-md btn-outline"
                >
                  Close
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-sm sm:btn-md btn-primary"
                >
                  <PencilIcon size={16} />
                  Edit Profile
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
