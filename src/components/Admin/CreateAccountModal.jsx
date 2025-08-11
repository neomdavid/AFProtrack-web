import React, { useState } from "react";
import { CaretDownIcon } from "@phosphor-icons/react";

const CreateAccountModal = ({ open, onClose, accountType }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    suffix: "",
    serviceId: "",
    email: "",
    unit: "",
    branchOfService: "",
    division: "",
    address: "",
    contactNumber: "",
    dateOfBirth: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Sample data for dropdowns
  const units = [
    "1st Infantry Division",
    "2nd Infantry Division",
    "3rd Infantry Division",
    "4th Infantry Division",
    "5th Infantry Division",
    "6th Infantry Division",
    "7th Infantry Division",
    "8th Infantry Division",
  ];

  const branchesOfService = [
    "Army",
    "Air Force",
    "Navy",
    "Marine Corps",
    "Coast Guard",
  ];

  const divisions = [
    "Infantry",
    "Artillery",
    "Armor",
    "Engineer",
    "Signal",
    "Medical",
    "Logistics",
    "Intelligence",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      // Prepare data for API
      const userData = {
        ...formData,
        accountType: accountType,
        role: accountType === "web" ? "training_staff" : "personnel",
      };

      // Remove empty suffix
      if (!userData.suffix.trim()) {
        delete userData.suffix;
      }

      // Convert date format from DD/MM/YYYY to YYYY-MM-DD
      if (userData.dateOfBirth) {
        // Check if it's already in YYYY-MM-DD format (from HTML date input)
        if (userData.dateOfBirth.includes("-")) {
          // Already in correct format, no conversion needed
        } else if (userData.dateOfBirth.includes("/")) {
          // Convert from DD/MM/YYYY to YYYY-MM-DD
          const [day, month, year] = userData.dateOfBirth.split("/");
          if (day && month && year) {
            userData.dateOfBirth = `${year}-${month.padStart(
              2,
              "0"
            )}-${day.padStart(2, "0")}`;
          }
        }
      }

      // Add default password for new accounts
      userData.password = "defaultPassword123";

      const response = await fetch(
        "http://localhost:5000/api/users/pending/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...userData,
            createdBy: "admin", // This should come from authenticated user context
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        setSuccess(
          "Account created successfully! The account is now pending approval."
        );
        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          suffix: "",
          serviceId: "",
          email: "",
          unit: "",
          branchOfService: "",
          division: "",
          address: "",
          contactNumber: "",
          dateOfBirth: "",
        });
        // Close modal after 3 seconds
        setTimeout(() => {
          onClose();
          setSuccess("");
        }, 3000);
      } else {
        setError(result.message || "Failed to create account");
      }
    } catch (err) {
      console.error("Error creating account:", err);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
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
      address: "",
      contactNumber: "",
      dateOfBirth: "",
    });
    setError("");
    setSuccess("");
    onClose();
  };

  if (!open) return null;

  return (
    <dialog open={open} className="modal z-[10000]">
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

        {/* Alert Messages */}
        {error && (
          <div className="alert alert-error mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert alert-success mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{success}</span>
          </div>
        )}

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto pr-2">
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
                    className="input input-bordered w-full h-9 text-sm"
                    required
                    disabled={isLoading}
                  />
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
                    className="input input-bordered w-full h-9 text-sm"
                    required
                    disabled={isLoading}
                  />
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
                    disabled={isLoading}
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
                    className="input input-bordered w-full h-9 text-sm"
                    placeholder="AFP-2024-XXX"
                    required
                    disabled={isLoading}
                  />
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
                    className="input input-bordered w-full h-9 text-sm"
                    required
                    disabled={isLoading}
                  />
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
                      Unit *
                    </span>
                  </label>
                  <div className="relative">
                    <select
                      name="unit"
                      value={formData.unit}
                      onChange={handleInputChange}
                      className="select select-bordered w-full h-9 text-sm appearance-none"
                      required
                      disabled={isLoading}
                    >
                      <option value="">Select Unit</option>
                      {units.map((unit) => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>
                    <CaretDownIcon
                      weight="bold"
                      className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none h-4 w-4"
                    />
                  </div>
                </div>
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
                      onChange={handleInputChange}
                      className="select select-bordered w-full h-9 text-sm appearance-none"
                      required
                      disabled={isLoading}
                    >
                      <option value="">Select Branch</option>
                      {branchesOfService.map((branch) => (
                        <option key={branch} value={branch}>
                          {branch}
                        </option>
                      ))}
                    </select>
                    <CaretDownIcon
                      weight="bold"
                      className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none h-4 w-4"
                    />
                  </div>
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
                      required
                      value={formData.division}
                      onChange={handleInputChange}
                      className="select select-bordered w-full h-9 text-sm appearance-none"
                      disabled={isLoading}
                    >
                      <option value="">Select Division</option>
                      {divisions.map((division) => (
                        <option key={division} value={division}>
                          {division}
                        </option>
                      ))}
                    </select>
                    <CaretDownIcon
                      weight="bold"
                      className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none h-4 w-4"
                    />
                  </div>
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
                    className="textarea textarea-bordered w-full h-full text-sm"
                    rows="2"
                    placeholder="Enter complete address"
                    required
                    disabled={isLoading}
                  />
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
                      className="input input-bordered w-full h-9 text-sm"
                      placeholder="+63 XXX XXX XXXX"
                      required
                      disabled={isLoading}
                    />
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
                      className="input input-bordered w-full h-9 text-sm"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-3 pb-2">
              <button
                type="button"
                onClick={handleClose}
                className="btn btn-outline btn-sm"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
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
  );
};

export default CreateAccountModal;
