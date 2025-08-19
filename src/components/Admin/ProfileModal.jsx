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
import { useAuth } from "../../context/AuthContext";

const ProfileModal = ({ isOpen, onClose }) => {
  const { user, setUser } = useAuth();
  const modalRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    serviceId: "",
    role: "",
    rank: "",
    dateEnlisted: "",
    unit: "",
    branch: "",
    currentBase: "",
    phoneNumber: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form data when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        serviceId: user.serviceId || "",
        role: user.role || "",
        rank: user.rank || "Sergeant (SGT)",
        dateEnlisted: user.dateEnlisted || "February 15, 2020",
        unit: user.unit || "Special Forces Regiment",
        branch: user.branch || "Philippine Army",
        currentBase: user.currentBase || "Fort Bonifacio, Taguig",
        phoneNumber: user.phoneNumber || "(+63) 912-345-6789",
      });
    }
  }, [user]);

  // Handle resize events and prevent modal from closing
  useEffect(() => {
    const handleResize = () => {
      // Prevent the modal from closing on resize
      if (modalRef.current && isOpen) {
        // Force the modal to stay open
        modalRef.current.showModal?.();
      }
    };

    if (isOpen) {
      window.addEventListener("resize", handleResize);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("resize", handleResize);
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

      // Update user data in context and localStorage
      const updatedUser = { ...user, ...formData };
      setUser(updatedUser);
      localStorage.setItem("afprotrack_user", JSON.stringify(updatedUser));

      setIsEditing(false);
      // You could add a toast notification here for success
    } catch (error) {
      console.error("Error updating profile:", error);
      // You could add a toast notification here for error
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original user data
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        serviceId: user.serviceId || "",
        role: user.role || "",
        rank: user.rank || "Sergeant (SGT)",
        dateEnlisted: user.dateEnlisted || "February 15, 2020",
        unit: user.unit || "Special Forces Regiment",
        branch: user.branch || "Philippine Army",
        currentBase: user.currentBase || "Fort Bonifacio, Taguig",
        phoneNumber: user.phoneNumber || "(+63) 912-345-6789",
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

  console.log("ProfileModal render - isOpen:", isOpen, "User:", user);
  if (!isOpen) return null;

  return (
    <dialog ref={modalRef} open={isOpen} className="modal z-[10000]">
      <div className="modal-box w-11/12 max-w-2xl lg:max-w-4xl relative bg-white p-3 sm:p-4 md:p-6 lg:p-8 max-h-[90vh] overflow-y-auto">
        {/* X Close Button */}
        <form method="dialog" className="absolute top-4 right-4">
          <button className="btn btn-sm btn-circle btn-ghost" onClick={onClose}>
            <XIcon size={16} />
          </button>
        </form>

        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <h3 className="font-bold text-lg sm:text-xl lg:text-2xl text-black">
            Profile Information
          </h3>
        </div>

        {/* Profile Content */}
        <div className="space-y-4">
          {/* Profile Picture Section */}
          <div className="flex justify-center mb-6">
            <div className="avatar">
              <div className="w-20 h-20 rounded-full overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format"
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to initials if image fails to load
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                <div
                  className="w-full h-full bg-primary text-primary-content rounded-full flex items-center justify-center text-2xl font-bold"
                  style={{ display: "none" }}
                >
                  {user?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase() || "U"}
                </div>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Personal Information Section */}
            <div>
              <h4 className="font-semibold text-lg mb-4 text-black">
                Personal Information
              </h4>
              <div className="space-y-4">
                {/* Full Name Field */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Full Name</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="input input-bordered w-full"
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <div className="input input-bordered w-full bg-base-200 flex items-center gap-2">
                      <UserIcon size={16} />
                      {formData.name || "Not specified"}
                    </div>
                  )}
                </div>

                {/* Rank Field */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Rank</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="rank"
                      value={formData.rank}
                      onChange={handleInputChange}
                      className="input input-bordered w-full"
                      placeholder="Enter your rank"
                    />
                  ) : (
                    <div className="input input-bordered w-full bg-base-200 flex items-center gap-2">
                      <StarIcon size={16} />
                      {formData.rank || "Not specified"}
                    </div>
                  )}
                </div>

                {/* Service ID Field */}
                <div className="form-control">
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
                      {formData.serviceId || "Not specified"}
                    </div>
                  )}
                </div>

                {/* Date Enlisted Field */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Date Enlisted
                    </span>
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      name="dateEnlisted"
                      value={formData.dateEnlisted}
                      onChange={handleInputChange}
                      className="input input-bordered w-full"
                    />
                  ) : (
                    <div className="input input-bordered w-full bg-base-200 flex items-center gap-2">
                      <CalendarIcon size={16} />
                      {formData.dateEnlisted || "Not specified"}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Service Information Section */}
            <div>
              <h4 className="font-semibold text-lg mb-4 text-black">
                Service Information
              </h4>
              <div className="space-y-4">
                {/* Unit Field */}
                <div className="form-control">
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
                      {formData.unit || "Not specified"}
                    </div>
                  )}
                </div>

                {/* Branch Field */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Branch</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="branch"
                      value={formData.branch}
                      onChange={handleInputChange}
                      className="input input-bordered w-full"
                      placeholder="Enter your branch"
                    />
                  ) : (
                    <div className="input input-bordered w-full bg-base-200 flex items-center gap-2">
                      <FlagIcon size={16} />
                      {formData.branch || "Not specified"}
                    </div>
                  )}
                </div>

                {/* Current Base Field */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Current Base
                    </span>
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="currentBase"
                      value={formData.currentBase}
                      onChange={handleInputChange}
                      className="input input-bordered w-full"
                      placeholder="Enter your current base"
                    />
                  ) : (
                    <div className="input input-bordered w-full bg-base-200 flex items-center gap-2">
                      <MapPinIcon size={16} />
                      {formData.currentBase || "Not specified"}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div>
              <h4 className="font-semibold text-lg mb-4 text-black">
                Contact Information
              </h4>
              <div className="space-y-4">
                {/* Email Field */}
                <div className="form-control">
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
                      {formData.email || "Not specified"}
                    </div>
                  )}
                </div>

                {/* Phone Number Field */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Phone Number
                    </span>
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="input input-bordered w-full"
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <div className="input input-bordered w-full bg-base-200 flex items-center gap-2">
                      <PhoneIcon size={16} />
                      {formData.phoneNumber || "Not specified"}
                    </div>
                  )}
                </div>

                {/* Role Field */}
                <div className="form-control">
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
                      {getRoleDisplayName(formData.role) || "Not specified"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="modal-action">
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
                <button onClick={onClose} className="btn btn-outline">
                  Close
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-primary"
                >
                  <PencilIcon size={16} />
                  Edit Profile
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default ProfileModal;
