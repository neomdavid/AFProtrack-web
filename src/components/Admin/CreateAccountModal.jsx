import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import {
  useCreatePendingUserMutation,
  useCreateWebUserMutation,
  useGetOrgStructureQuery,
  useGetRanksQuery,
} from "../../features/api/adminEndpoints";
import { toast } from "react-toastify";
import LabeledSelect from "./LabeledSelect";
import LabeledInput from "./LabeledInput";
import {
  validateCreateAccountForm,
  mapBackendErrorsToFields,
  deriveServiceCodeFromBranch,
} from "./createAccountUtils";

const CreateAccountModal = ({ open, onClose, accountType }) => {
  const { user } = useAuth();
  const [createPendingUser, { isLoading: isCreatingPending, error: apiError }] =
    useCreatePendingUserMutation();
  const [createWebUser, { isLoading: isCreatingWeb }] =
    useCreateWebUserMutation();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    suffix: "",
    serviceId: "AFP-",
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
  const isSubmitting = isCreatingPending || isCreatingWeb;

  // Fetch organization structure (branches -> divisions -> units)
  const { data: orgRes, isLoading: orgLoading } = useGetOrgStructureQuery();
  const branches = orgRes?.data?.branches || [];

  // Resolve selections from labels
  const selectedBranch = branches.find(
    (b) =>
      b.label === formData.branchOfService ||
      b.code === formData.branchOfService
  );
  const divisions = selectedBranch?.divisions || [];
  const selectedDivision = divisions.find(
    (d) => d.label === formData.division || d.code === formData.division
  );
  const units = selectedDivision?.units || [];

  // Rank fetching
  const rankServiceCode = formData.rankService || ""; // expects 'ARMY' or 'NAVY'
  const {
    data: ranksRes,
    isLoading: ranksLoading,
    isFetching: ranksFetching,
  } = useGetRanksQuery(rankServiceCode, {
    skip: !rankServiceCode,
  });
  const ranks = ranksRes?.data || [];

  // Role options based on current user's role
  const getAvailableRoles = () => {
    if (user?.role === "admin") {
      return [
        { value: "training_staff", label: "Training Staff" },
        { value: "admin", label: "Administrator" },
      ];
    } else if (user?.role === "training_staff") {
      return [{ value: "training_staff", label: "Training Staff" }];
    }
    return [];
  };

  const roles = getAvailableRoles();

  // Helper to show toast via react-toastify
  const showToast = (message, type = "info") => {
    if (type === "success") return toast.success(message);
    if (type === "error") return toast.error(message);
    if (type === "warning") return toast.warn(message);
    return toast.info(message);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Validation for names and suffix - no numbers allowed
    if (["firstName", "lastName", "suffix"].includes(name)) {
      const noNumbersRegex = /^[a-zA-Z\s\-'\.]*$/;
      if (value && !noNumbersRegex.test(value)) {
        return; // Don't update if numbers are entered
      }
    }

    // Service ID validation - start with AFP and max length
    if (name === "serviceId") {
      if (value && !value.startsWith("AFP")) {
        return; // Don't update if it doesn't start with AFP
      }
      if (value.length > 12) {
        // AFP-YYYY-XXX format = 12 characters
        return; // Don't update if too long
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // deriveServiceCodeFromBranch moved to utils

  const handleBranchChange = (e) => {
    const branchLabel = e.target.value;
    const svc = deriveServiceCodeFromBranch(branchLabel);
    setFormData((prev) => ({
      ...prev,
      branchOfService: branchLabel,
      division: "",
      unit: "",
      rankService: svc,
      rank: "",
    }));
    if (fieldErrors.branchOfService)
      setFieldErrors((prev) => ({ ...prev, branchOfService: "" }));
  };

  const handleDivisionChange = (e) => {
    const divisionLabel = e.target.value;
    setFormData((prev) => ({ ...prev, division: divisionLabel, unit: "" }));
    if (fieldErrors.division)
      setFieldErrors((prev) => ({ ...prev, division: "" }));
  };

  const handleUnitChange = (e) => {
    const unitLabel = e.target.value;
    setFormData((prev) => ({ ...prev, unit: unitLabel }));
    if (fieldErrors.unit) setFieldErrors((prev) => ({ ...prev, unit: "" }));
  };

  const handleRankServiceChange = (e) => {
    const code = e.target.value; // 'ARMY' | 'NAVY'
    setFormData((prev) => ({ ...prev, rankService: code, rank: "" }));
    if (fieldErrors.rank) setFieldErrors((prev) => ({ ...prev, rank: "" }));
  };

  const handleRankChange = (e) => {
    const label = e.target.value;
    setFormData((prev) => ({ ...prev, rank: label }));
    if (fieldErrors.rank) setFieldErrors((prev) => ({ ...prev, rank: "" }));
  };

  // Frontend validation via utils
  const validateForm = () => {
    const errors = validateCreateAccountForm(formData);
    const hasErrors = Object.keys(errors).length > 0;
    setFieldErrors(errors);
    if (hasErrors) {
      // Show the first specific error message instead of generic message
      const firstError = Object.values(errors)[0];
      showToast(firstError, "error");
    }
    return hasErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submission started");

    setError("");
    setSuccess("");

    // Frontend validation first
    if (validateForm()) {
      console.log("Frontend validation failed, returning early");
      return;
    }

    console.log("Frontend validation passed, making API call");
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

      console.log("Making API call with:", requestBody);
      const result = await (accountType === "web"
        ? createWebUser
        : createPendingUser)(requestBody).unwrap();

      console.log("API call completed with result:", result);
      if (result.success) {
        console.log("Showing success toast");
        showToast(
          "Account created successfully and is pending approval!",
          "success"
        );
        // Reset form after successful creation
        setTimeout(() => {
          handleClose();
        }, 1000);
      } else {
        console.log("API returned error:", result.message);
        const errorMsg = result.message || "Failed to create account";
        setError(errorMsg);
        showToast(errorMsg, "error");
      }
    } catch (error) {
      console.error("Error creating account:", error);

      if (
        error?.data?.message ||
        (error?.data?.errors && Array.isArray(error.data.errors))
      ) {
        const backendErrors = mapBackendErrorsToFields(error);
        if (Object.keys(backendErrors).length > 0) {
          setFieldErrors(backendErrors);
          // Show the first specific error message instead of generic message
          const firstError = Object.values(backendErrors)[0];
          showToast(firstError, "error");
        } else {
          const msg = error?.data?.message || "Validation failed";
          setError(msg);
          showToast(msg, "error");
        }
      } else {
        const errorMsg =
          error?.data?.message || "Network error. Please try again.";
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

  if (!open) {
    return null;
  }

  return (
    <>
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
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-bold text-2xl mb-1">
                  Create{" "}
                  {accountType === "web" ? "Training Staff" : "AFP Personnel"}{" "}
                  Account
                </h3>
                <p className="text-gray font-normal text-md">
                  {accountType === "web"
                    ? "Web Access Account"
                    : "Mobile Access Account"}
                </p>
              </div>
            </div>
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
                  <LabeledInput
                    label="First Name *"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    error={fieldErrors.firstName}
                    required
                  />
                  <LabeledInput
                    label="Last Name *"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    error={fieldErrors.lastName}
                    required
                  />
                  <LabeledInput
                    label="Suffix"
                    name="suffix"
                    value={formData.suffix}
                    onChange={handleInputChange}
                    placeholder="Jr., Sr., III, etc."
                  />
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
                        fieldErrors.serviceId ? "input-error" : "input-bordered"
                      }`}
                      placeholder="AFP-2024-XXX"
                      maxLength={12}
                      required
                    />
                    {fieldErrors.serviceId ? (
                      <p className="text-xs text-red-500 mt-1">
                        {fieldErrors.serviceId}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-500 mt-1">
                        Format: AFP-YYYY-XXX (e.g., AFP-2025-001)
                      </p>
                    )}
                  </div>
                  <LabeledInput
                    label="Email *"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={fieldErrors.email}
                    required
                  />
                </div>
              </div>

              {/* Organizational Information */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-3 text-base">
                  Organizational Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <LabeledSelect
                    label="Branch of Service *"
                    name="branchOfService"
                    value={formData.branchOfService}
                    onChange={handleBranchChange}
                    disabled={orgLoading}
                    options={branches.map((b) => ({
                      label: b.label,
                      value: b.label,
                      code: b.code,
                    }))}
                    placeholder="Select Branch"
                    error={fieldErrors.branchOfService}
                    required
                  />
                  <LabeledSelect
                    label="Division *"
                    name="division"
                    value={formData.division}
                    onChange={handleDivisionChange}
                    disabled={!selectedBranch || orgLoading}
                    options={divisions.map((d) => ({
                      label: d.label,
                      value: d.label,
                      code: d.code,
                    }))}
                    placeholder="Select Division"
                    error={fieldErrors.division}
                    required
                  />
                  <LabeledSelect
                    label="Unit *"
                    name="unit"
                    value={formData.unit}
                    onChange={handleUnitChange}
                    disabled={!selectedDivision || orgLoading}
                    options={units.map((u) => ({
                      label: u.label,
                      value: u.label,
                      code: u.code,
                    }))}
                    placeholder="Select Unit"
                    error={fieldErrors.unit}
                    required
                  />
                </div>
              </div>

              {/* Rank */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-3 text-base">Rank</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <LabeledSelect
                    label="Rank"
                    name="rank"
                    value={formData.rank}
                    onChange={handleRankChange}
                    disabled={
                      !formData.rankService || ranksLoading || ranksFetching
                    }
                    options={ranks.map((r) => ({
                      label: r.label,
                      value: r.label,
                      code: r.code,
                    }))}
                    placeholder="Select Rank"
                    error={fieldErrors.rank}
                  />
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
                        fieldErrors.address
                          ? "textarea-error"
                          : "textarea-bordered"
                      }`}
                      rows="2"
                      placeholder="Enter complete address"
                      required
                    />
                    {fieldErrors.address && (
                      <p className="text-xs text-red-500 mt-1">
                        {fieldErrors.address}
                      </p>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="label py-1">
                        <span className="label-text font-medium text-sm">
                          Contact Number *
                        </span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 select-none pointer-events-none z-10">
                          +63
                        </span>
                        <input
                          type="tel"
                          name="contactNumber"
                          value={(formData.contactNumber || "").replace(
                            /(\d{3})(\d{3})(\d{0,4})/,
                            (m, a, b, c) =>
                              c ? `${a} ${b} ${c}` : b ? `${a} ${b}` : a
                          )}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, ""); // digits only
                            if (
                              value.length <= 10 &&
                              (value === "" || value.startsWith("9"))
                            ) {
                              setFormData((prev) => ({
                                ...prev,
                                contactNumber: value,
                              }));
                            }
                            if (fieldErrors.contactNumber) {
                              setFieldErrors((prev) => ({
                                ...prev,
                                contactNumber: "",
                              }));
                            }
                          }}
                          className={`input w-full h-9 text-sm pl-14 relative z-0 ${
                            fieldErrors.contactNumber
                              ? "input-error"
                              : "input-bordered"
                          }`}
                          placeholder="9XX XXX XXXX"
                          required
                        />
                      </div>
                      {fieldErrors.contactNumber && (
                        <p className="text-xs text-red-500 mt-1">
                          {fieldErrors.contactNumber}
                        </p>
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
                          fieldErrors.dateOfBirth
                            ? "input-error"
                            : "input-bordered"
                        }`}
                        required
                      />
                      {fieldErrors.dateOfBirth && (
                        <p className="text-xs text-red-500 mt-1">
                          {fieldErrors.dateOfBirth}
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
                        className={`select w-full h-9 text-sm ${
                          fieldErrors.role ? "select-error" : "select-bordered"
                        }`}
                        required
                      >
                        {roles.map((role) => (
                          <option key={role.value} value={role.value}>
                            {role.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    {fieldErrors.role && (
                      <p className="text-xs text-red-500 mt-1">
                        {fieldErrors.role}
                      </p>
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
