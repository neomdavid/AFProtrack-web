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
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
    // You can add API call here
    onClose();
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
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary btn-sm">
                Create Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default CreateAccountModal;
