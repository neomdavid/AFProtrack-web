import React, { useState } from "react";
import { CaretDownIcon } from "@phosphor-icons/react";
import { useAuth } from "../../hooks/useAuth";
import { useCreatePendingUserMutation, useCreateWebUserMutation, useGetOrgStructureQuery, useGetRanksQuery } from "../../features/api/adminEndpoints";
import CustomToast from "./CustomToast";

const CreateAccountModal = ({ open, onClose, accountType }) => {
  const { user } = useAuth();
  const [createPendingUser, { isLoading: isCreatingPending, error: apiError }] = useCreatePendingUserMutation();
  const [createWebUser, { isLoading: isCreatingWeb }] = useCreateWebUserMutation();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    suffix: "",
    serviceId: "",
    email: "",
    unit: "",
    branchOfService: "",
    division: "",
    rank: "",
    rankService: "", // ARMY or NAVY
    address: "",
    contactNumber: "",
    dateOfBirth: "",
    role: "training_staff",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [toast, setToast] = useState(null);
  const isSubmitting = isCreatingPending || isCreatingWeb;

  // Fetch organization structure (branches -> divisions -> units)
  const { data: orgRes, isLoading: orgLoading } = useGetOrgStructureQuery();
  const branches = orgRes?.data?.branches || [];

  // Resolve selections from labels
  const selectedBranch = branches.find(
    (b) => b.label === formData.branchOfService || b.code === formData.branchOfService
  );
  const divisions = selectedBranch?.divisions || [];
  const selectedDivision = divisions.find(
    (d) => d.label === formData.division || d.code === formData.division
  );
  const units = selectedDivision?.units || [];

  // Rank fetching
  const rankServiceCode = formData.rankService || ""; // expects 'ARMY' or 'NAVY'
  const { data: ranksRes, isLoading: ranksLoading, isFetching: ranksFetching } = useGetRanksQuery(rankServiceCode, {
    skip: !rankServiceCode,
  });
  const ranks = ranksRes?.data || [];

  // Role options based on current user's role
  const getAvailableRoles = () => {
    if (user?.role === 'admin') {
      return [
        { value: "training_staff", label: "Training Staff" },
        { value: "admin", label: "Administrator" },
      ];
    } else if (user?.role === 'training_staff') {
      return [
        { value: "training_staff", label: "Training Staff" },
      ];
    }
    return [];
  };

  const roles = getAvailableRoles();

  // Helper function to show toasts
  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const deriveServiceCodeFromBranch = (branchLabel) => {
    const v = (branchLabel || '').toLowerCase();
    if (v.includes('navy')) return 'NAVY';
    if (v.includes('air')) return 'AIRFORCE';
    if (v.includes('army')) return 'ARMY';
    return '';
  };

  const handleBranchChange = (e) => {
    const branchLabel = e.target.value;
    const svc = deriveServiceCodeFromBranch(branchLabel);
    setFormData((prev) => ({ ...prev, branchOfService: branchLabel, division: "", unit: "", rankService: svc, rank: "" }));
    if (fieldErrors.branchOfService) setFieldErrors((prev)=>({ ...prev, branchOfService: "" }));
  };

  const handleDivisionChange = (e) => {
    const divisionLabel = e.target.value;
    setFormData((prev) => ({ ...prev, division: divisionLabel, unit: "" }));
    if (fieldErrors.division) setFieldErrors((prev)=>({ ...prev, division: "" }));
  };

  const handleUnitChange = (e) => {
    const unitLabel = e.target.value;
    setFormData((prev) => ({ ...prev, unit: unitLabel }));
    if (fieldErrors.unit) setFieldErrors((prev)=>({ ...prev, unit: "" }));
  };

  const handleRankServiceChange = (e) => {
    const code = e.target.value; // 'ARMY' | 'NAVY'
    setFormData((prev) => ({ ...prev, rankService: code, rank: "" }));
    if (fieldErrors.rank) setFieldErrors((prev)=>({ ...prev, rank: "" }));
  };

  const handleRankChange = (e) => {
    const label = e.target.value;
    setFormData((prev) => ({ ...prev, rank: label }));
    if (fieldErrors.rank) setFieldErrors((prev)=>({ ...prev, rank: "" }));
  };

  // Frontend validation - FIXED to show all errors at once
  const validateForm = () => {
    const errors = {};
    let hasErrors = false;

    // Service ID format validation
    const serviceIdPattern = /^AFP-\d{4}-\d{3}$/;
    if (!formData.serviceId.trim()) {
      errors.serviceId = "Service ID is required";
      hasErrors = true;
    } else if (!serviceIdPattern.test(formData.serviceId)) {
      errors.serviceId = "Service ID must be in format AFP-YYYY-XXX";
      hasErrors = true;
    }

    // Age validation (must be at least 18)
    if (!formData.dateOfBirth) {
      errors.dateOfBirth = "Date of Birth is required";
      hasErrors = true;
    } else {
      const today = new Date();
      const birthDate = new Date(formData.dateOfBirth);
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (age < 18 || (age === 18 && monthDiff < 0)) {
        errors.dateOfBirth = "Age must be at least 18 years old";
        hasErrors = true;
      }
    }

    // Required fields validation - ALL AT ONCE
    if (!formData.firstName.trim()) {
      errors.firstName = "First Name is required";
      hasErrors = true;
    }
    if (!formData.lastName.trim()) {
      errors.lastName = "Last Name is required";
      hasErrors = true;
    }
    if (!formData.email.trim()) {
      errors.email = "Email is required";
      hasErrors = true;
    }
    if (!formData.unit) {
      errors.unit = "Unit is required";
      hasErrors = true;
    }
    if (!formData.branchOfService) {
      errors.branchOfService = "Branch of Service is required";
      hasErrors = true;
    }
    if (!formData.division) {
      errors.division = "Division is required";
      hasErrors = true;
    }
    if (!formData.address.trim()) {
      errors.address = "Address is required";
      hasErrors = true;
    }
    if (!formData.contactNumber.trim()) {
      errors.contactNumber = "Contact Number is required";
      hasErrors = true;
    }
    if (!formData.role) {
      errors.role = "Role is required";
      hasErrors = true;
    }

    // Set ALL errors at once
    setFieldErrors(errors);
    
    // Show toast for validation errors
    if (hasErrors) {
      showToast("Please fix the validation errors below", "error");
    }
    
    return hasErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Frontend validation first
    if (validateForm()) {
      return;
    }

    try {
      // Prepare the request body according to the API specification
      const requestBody = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        serviceId: formData.serviceId,
        email: formData.email,
        unit: formData.unit,
        branchOfService: formData.branchOfService,
        division: formData.division,
        rank: formData.rank,
        address: formData.address,
        contactNumber: formData.contactNumber,
        dateOfBirth: formData.dateOfBirth,
        role: formData.role,
        createdBy: user?.id || user?._id,
      };

      const result = await (accountType === 'web' ? createWebUser : createPendingUser)(requestBody).unwrap();

      if (result.success) {
        showToast("Account created successfully and is pending approval!", "success");
        // Reset form after successful creation
        setTimeout(() => {
          handleClose();
        }, 1000);
      } else {
        const errorMsg = result.message || "Failed to create account";
        setError(errorMsg);
        showToast(errorMsg, "error");
      }
    } catch (error) {
      console.error("Error creating account:", error);
    
      if (error?.data?.message) {
        const msg = error.data.message;
        const backendErrors = {};
    
        if (msg.includes("Service ID already exists")) backendErrors.serviceId = "Service ID already exists";
        else if (msg.includes("Email already exists")) backendErrors.email = "Email already exists";
        else if (msg.includes("Service ID")) backendErrors.serviceId = msg;
        else if (msg.includes("Email")) backendErrors.email = msg;
        else if (msg.includes("Age")) backendErrors.dateOfBirth = msg;
        else if (msg.includes("Role")) backendErrors.role = msg;
        else if (msg.includes("First Name")) backendErrors.firstName = msg;
        else if (msg.includes("Last Name")) backendErrors.lastName = msg;
        else if (msg.includes("Unit")) backendErrors.unit = msg;
        else if (msg.includes("Branch")) backendErrors.branchOfService = msg;
        else if (msg.includes("Division")) backendErrors.division = msg;
        else if (msg.includes("Address")) backendErrors.address = msg;
        else if (msg.includes("Contact")) backendErrors.contactNumber = msg;
    
        if (Object.keys(backendErrors).length > 0) {
          setFieldErrors(backendErrors);
          showToast("Please fix the validation errors below", "error");
        } else {
          setError(msg);
          showToast(msg, "error");
        }
      } else if (error?.data?.errors && Array.isArray(error.data.errors)) {
        const backendErrors = {};
        error.data.errors.forEach(err => {
          if (err.includes("Service ID")) backendErrors.serviceId = err;
          else if (err.includes("Email")) backendErrors.email = err;
          else if (err.includes("Age")) backendErrors.dateOfBirth = err;
          else if (err.includes("Role")) backendErrors.role = err;
          else if (err.includes("First Name")) backendErrors.firstName = err;
          else if (err.includes("Last Name")) backendErrors.lastName = err;
          else if (err.includes("Unit")) backendErrors.unit = err;
          else if (err.includes("Branch")) backendErrors.branchOfService = err;
          else if (err.includes("Division")) backendErrors.division = err;
          else if (err.includes("Address")) backendErrors.address = err;
          else if (err.includes("Contact")) backendErrors.contactNumber = err;
        });
        setFieldErrors(backendErrors);
        showToast("Please fix the validation errors below", "error");
      } else {
        const errorMsg = error?.data?.message || "Network error. Please try again.";
        setError(errorMsg);
        showToast(errorMsg, "error");
      }
    }
  };

  const handleClose = () => {
    setFormData({
      firstName: "",
      lastName: "",
      suffix: "",
      serviceId: "",
      email: "",
      unit: "",
      branchOfService: "",
      division: "",
      rank: "",
      rankService: "",
      address: "",
      contactNumber: "",
      dateOfBirth: "",
      role: "training_staff",
    });
    setError("");
    setSuccess("");
    setFieldErrors({});
    
    // Don't show toast when closing - let it stay if it exists
    onClose();
  };

  // Toast container - OUTSIDE the modal
  const toastContainer = (
    <>
      {toast && (
        <CustomToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );

  if (!open) {
    // Return only the toast when modal is closed
    return toastContainer;
  }

  return (
    <>
      {/* Toast container - OUTSIDE the modal */}
      {toastContainer}
      
      {/* Modal */}
      <dialog open={open} className="modal z-10000000">
        <div className="modal-box w-11/12 max-w-4xl relative bg-white p-6 max-h-[90vh] overflow-hidden flex flex-col">
          {/* X Close Button */}
          <form method="dialog" className="absolute top-3 right-3 z-10">
            <button
              className="btn btn-sm btn-circle btn-ghost"
              onClick={handleClose}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </form>

          {/* Sticky Header */}
          <div className="sticky top-0 bg-white pt-2 pb-3 border-b border-gray-200 mb-4 z-5">
            <h3 className="font-bold text-2xl mb-1">
              Create {accountType === "web" ? "Training Staff" : "AFP Personnel"}{" "}
              Account
            </h3>
            <p className="text-gray font-normal text-md">
              {accountType === "web"
                ? "Web Access Account"
                : "Mobile Access Account"}
            </p>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="mx-6 mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {success}
            </div>
          )}
          
          {error && (
            <div className="mx-6 mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* Scrollable Form Content */}
          <div className="flex-1 overflow-y-auto px-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Personal Information */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-3 text-base">
                  Personal Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="label py-1">
                      <span className="label-text font-medium text-sm">
                        First Name *
                      </span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`input w-full h-9 text-sm ${
                        fieldErrors.firstName ? 'input-error' : 'input-bordered'
                      }`}
                      required
                    />
                    {fieldErrors.firstName && (
                      <p className="text-xs text-red-500 mt-1">{fieldErrors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="label py-1">
                      <span className="label-text font-medium text-sm">
                        Last Name *
                      </span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`input w-full h-9 text-sm ${
                        fieldErrors.lastName ? 'input-error' : 'input-bordered'
                      }`}
                      required
                    />
                    {fieldErrors.lastName && (
                      <p className="text-xs text-red-500 mt-1">{fieldErrors.lastName}</p>
                    )}
                  </div>
                  <div>
                    <label className="label py-1">
                      <span className="label-text font-medium text-sm">
                        Suffix
                      </span>
                    </label>
                    <input
                      type="text"
                      name="suffix"
                      value={formData.suffix}
                      onChange={handleInputChange}
                      className="input input-bordered w-full h-9 text-sm"
                      placeholder="Jr., Sr., III, etc."
                    />
                  </div>
                </div>
              </div>

              {/* Service Information */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-3 text-base">
                  Service Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="label py-1">
                      <span className="label-text font-medium text-sm">
                        Service ID *
                      </span>
                    </label>
                    <input
                      type="text"
                      name="serviceId"
                      value={formData.serviceId}
                      onChange={handleInputChange}
                      className={`input w-full h-9 text-sm ${
                        fieldErrors.serviceId ? 'input-error' : 'input-bordered'
                      }`}
                      placeholder="AFP-2024-XXX"
                      required
                    />
                    {fieldErrors.serviceId ? (
                      <p className="text-xs text-red-500 mt-1">{fieldErrors.serviceId}</p>
                    ) : (
                      <p className="text-xs text-gray-500 mt-1">
                        Format: AFP-YYYY-XXX (e.g., AFP-2025-001)
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="label py-1">
                      <span className="label-text font-medium text-sm">
                        Email *
                      </span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`input w-full h-9 text-sm ${
                        fieldErrors.email ? 'input-error' : 'input-bordered'
                      }`}
                      required
                    />
                    {fieldErrors.email && (
                      <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Organizational Information */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-3 text-base">
                  Organizational Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="label py-1">
                      <span className="label-text font-medium text-sm">
                        Branch of Service *
                      </span>
                    </label>
                    <div className="relative">
                      <select
                        name="branchOfService"
                        value={formData.branchOfService}
                        onChange={handleBranchChange}
                        disabled={orgLoading}
                        className={`select w-full h-9 text-sm appearance-none ${
                          fieldErrors.branchOfService ? 'select-error' : 'select-bordered'
                        }`}
                        required
                      >
                        <option value="">Select Branch</option>
                        {branches.map((b) => (
                          <option key={b.code} value={b.label}>
                            {b.label}
                          </option>
                        ))}
                      </select>
                      <CaretDownIcon
                        weight="bold"
                        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none h-4 w-4"
                      />
                    </div>
                    {fieldErrors.branchOfService && (
                      <p className="text-xs text-red-500 mt-1">{fieldErrors.branchOfService}</p>
                    )}
                  </div>
                  <div>
                    <label className="label py-1">
                      <span className="label-text font-medium text-sm">
                        Division *
                      </span>
                    </label>
                    <div className="relative">
                      <select
                        name="division"
                        value={formData.division}
                        onChange={handleDivisionChange}
                        disabled={!selectedBranch || orgLoading}
                        className={`select w-full h-9 text-sm appearance-none ${
                          fieldErrors.division ? 'select-error' : 'select-bordered'
                        }`}
                        required
                      >
                        <option value="">Select Division</option>
                        {divisions.map((d) => (
                          <option key={d.code} value={d.label}>
                            {d.label}
                          </option>
                        ))}
                      </select>
                      <CaretDownIcon
                        weight="bold"
                        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none h-4 w-4"
                      />
                    </div>
                    {fieldErrors.division && (
                      <p className="text-xs text-red-500 mt-1">{fieldErrors.division}</p>
                    )}
                  </div>
                  <div>
                    <label className="label py-1">
                      <span className="label-text font-medium text-sm">
                        Unit *
                      </span>
                    </label>
                    <div className="relative">
                      <select
                        name="unit"
                        value={formData.unit}
                        onChange={handleUnitChange}
                        disabled={!selectedDivision || orgLoading}
                        className={`select w-full h-9 text-sm appearance-none ${
                          fieldErrors.unit ? 'select-error' : 'select-bordered'
                        }`}
                        required
                      >
                        <option value="">Select Unit</option>
                        {units.map((u) => (
                          <option key={u.code} value={u.label}>
                            {u.label}
                          </option>
                        ))}
                      </select>
                      <CaretDownIcon
                        weight="bold"
                        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none h-4 w-4"
                      />
                    </div>
                    {fieldErrors.unit && (
                      <p className="text-xs text-red-500 mt-1">{fieldErrors.unit}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Rank */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-3 text-base">Rank</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="label py-1">
                      <span className="label-text font-medium text-sm">Rank</span>
                    </label>
                    <div className="relative">
                      <select
                        name="rank"
                        value={formData.rank}
                        onChange={handleRankChange}
                        disabled={!formData.rankService || ranksLoading || ranksFetching}
                        className={`select w-full h-9 text-sm appearance-none ${
                          fieldErrors.rank ? 'select-error' : 'select-bordered'
                        }`}
                      >
                        <option value="">Select Rank</option>
                        {ranks.map((r)=> (
                          <option key={r.code} value={r.label}>{r.label}</option>
                        ))}
                      </select>
                      <CaretDownIcon
                        weight="bold"
                        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none h-4 w-4"
                      />
                    </div>
                    {fieldErrors.rank && (
                      <p className="text-xs text-red-500 mt-1">{fieldErrors.rank}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-3 text-base">
                  Contact Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex flex-col">
                    <label className="label py-1">
                      <span className="label-text font-medium text-sm">
                        Address *
                      </span>
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={`textarea w-full h-full text-sm ${
                        fieldErrors.address ? 'textarea-error' : 'textarea-bordered'
                      }`}
                      rows="2"
                      placeholder="Enter complete address"
                      required
                    />
                    {fieldErrors.address && (
                      <p className="text-xs text-red-500 mt-1">{fieldErrors.address}</p>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="label py-1">
                        <span className="label-text font-medium text-sm">
                          Contact Number *
                        </span>
                      </label>
                      <input
                        type="tel"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleInputChange}
                        className={`input w-full h-9 text-sm ${
                          fieldErrors.contactNumber ? 'input-error' : 'input-bordered'
                        }`}
                        placeholder="+63 XXX XXX XXXX"
                        required
                      />
                      {fieldErrors.contactNumber && (
                        <p className="text-xs text-red-500 mt-1">{fieldErrors.contactNumber}</p>
                      )}
                    </div>
                    <div>
                      <label className="label py-1">
                        <span className="label-text font-medium text-sm">
                          Date of Birth *
                        </span>
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        className={`input w-full h-9 text-sm ${
                          fieldErrors.dateOfBirth ? 'input-error' : 'input-bordered'
                        }`}
                        required
                      />
                      {fieldErrors.dateOfBirth ? (
                        <p className="text-xs text-red-500 mt-1">{fieldErrors.dateOfBirth}</p>
                      ) : (
                        <p className="text-xs text-gray-500 mt-1">
                          Must be at least 18 years old
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Settings */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-3 text-base">
                  Account Settings
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="label py-1">
                      <span className="label-text font-medium text-sm">
                        Role *
                      </span>
                    </label>
                    <div className="relative">
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className={`select w-full h-9 text-sm appearance-none ${
                          fieldErrors.role ? 'select-error' : 'select-bordered'
                        }`}
                        required
                      >
                        {roles.map((role) => (
                          <option key={role.value} value={role.value}>
                            {role.label}
                          </option>
                        ))}
                      </select>
                      <CaretDownIcon
                        weight="bold"
                        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none h-4 w-4"
                      />
                    </div>
                    {fieldErrors.role && (
                      <p className="text-xs text-red-500 mt-1">{fieldErrors.role}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-3 pb-6">
                <button
                  type="button"
                  onClick={handleClose}
                  className="btn btn-outline btn-sm"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary btn-sm"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      Creating...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default CreateAccountModal;