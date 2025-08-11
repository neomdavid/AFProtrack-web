import React, { useState } from "react";
import { TrashIcon } from "@phosphor-icons/react";

const AccessCard = ({ person }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isActive, setIsActive] = useState(person.isActive !== false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleArchiveAccount = async () => {
    if (!confirm("Are you sure you want to archive this account?")) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/users/${person._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (result.success) {
        setIsActive(false);
        alert("Account archived successfully");
        handleCloseModal();
        // You might want to refresh the parent component's data here
        window.location.reload(); // Simple refresh for now
      } else {
        alert("Failed to archive account: " + result.message);
      }
    } catch (error) {
      console.error("Error archiving account:", error);
      alert("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    try {
      setIsLoading(true);
      const newStatus = !isActive;

      const response = await fetch(
        `http://localhost:5000/api/users/${person._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isActive: newStatus }),
        }
      );

      const result = await response.json();

      if (result.success) {
        setIsActive(newStatus);
        alert(
          `Account ${newStatus ? "activated" : "deactivated"} successfully`
        );
      } else {
        alert("Failed to update account status: " + result.message);
      }
    } catch (error) {
      console.error("Error updating account status:", error);
      alert("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get full name
  const fullName = person.suffix
    ? `${person.firstName} ${person.lastName} ${person.suffix}`
    : `${person.firstName} ${person.lastName}`;

  // Get avatar initials
  const avatar = `${person.firstName.charAt(0)}${person.lastName.charAt(0)}`;

  return (
    <>
      <div
        className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
            {avatar}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-800 truncate">{fullName}</p>
            <p className="text-sm text-gray-600 truncate">{person.serviceId}</p>
            <p className="text-sm text-gray-600 truncate">{person.email}</p>
            <p className="text-xs text-gray-500 truncate">{person.unit}</p>
          </div>
        </div>
      </div>

      {/* Modal */}
      <dialog open={isModalOpen} className="modal z-[10000]">
        <div className="modal-box w-11/12 max-w-md relative bg-white p-8">
          {/* X Close Button in form */}
          <form method="dialog" className="absolute top-4 right-4">
            <button
              className="btn btn-sm btn-circle btn-ghost"
              onClick={handleCloseModal}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
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

          {/* Vertical Layout */}
          <div className="flex flex-col items-center text-center space-y-1">
            {/* Avatar */}
            <div className="w-24 h-24 bg-primary text-white rounded-full flex mb-3 items-center justify-center text-3xl font-bold">
              {avatar}
            </div>

            {/* Service ID */}
            <p className="text-sm text-primary font-bold">{person.serviceId}</p>
            {/* Role */}
            <p className="text-md text-black font">
              {person.role === "training_staff"
                ? "Training Staff"
                : person.role}
            </p>

            {/* Name */}
            <h3 className="font-bold text-2xl text-black">{fullName}</h3>

            {/* Email */}
            <p className="text-sm text-gray">{person.email}</p>

            {/* Status and Archive Container */}
            <div className="flex justify-between items-center w-full mt-6">
              <div className="flex flex-col items-start gap-2">
                <span className="text-sm font-semibold text-gray/90">
                  Account Status:
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={isActive}
                    onChange={handleToggleStatus}
                    disabled={isLoading}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  <span className="ml-3 text-sm font-medium text-black">
                    {isActive ? "Active" : "Inactive"}
                  </span>
                </label>
              </div>
              <button
                onClick={handleArchiveAccount}
                disabled={isLoading}
                className="flex items-center text-[13px] px-2 py-1 rounded-md gap-2 bg-error text-white btn-hover disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="loading loading-spinner loading-xs"></span>
                ) : (
                  <TrashIcon size={16} />
                )}
                Archive Account
              </button>
            </div>

            {/* Additional Details Container */}
            <div className="w-full space-y-3 mt-6 text-left bg-gray/5 p-3 rounded-sm ">
              <div className="flex gap-2 items-center">
                <span className="text-sm font-semibold text-gray/90">
                  Unit:
                </span>
                <span className="text-black text-[15px]">{person.unit}</span>
              </div>
              <div className="flex gap-2 items-center">
                <span className="text-sm font-semibold text-gray/90">
                  Branch of Service:
                </span>
                <span className="text-black text-[15px]">
                  {person.branchOfService}
                </span>
              </div>
              <div className="flex gap-2 items-center">
                <span className="text-sm font-semibold text-gray/90">
                  Division:
                </span>
                <span className="text-black text-[15px]">
                  {person.division}
                </span>
              </div>
              <div className="flex gap-2 items-center">
                <span className="text-sm font-semibold text-gray/90">
                  Date of Birth:
                </span>
                <span className="text-black text-[15px]">
                  {formatDate(person.dateOfBirth)}
                </span>
              </div>
              <div className="flex gap-2 items-center">
                <span className="text-sm font-semibold text-gray/90">
                  Phone:
                </span>
                <span className="text-black text-[15px]">
                  {person.contactNumber}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray/90 mb-1">
                  Address:
                </span>
                <span className="text-black text-[15px]">{person.address}</span>
              </div>
              <div className="flex gap-2 items-center">
                <span className="text-sm font-semibold text-gray/90">
                  Account Type:
                </span>
                <span className="text-black text-[15px]">
                  {person.accountType === "web"
                    ? "Web Access"
                    : "Mobile Access"}
                </span>
              </div>
              <div className="flex gap-2 items-center">
                <span className="text-sm font-semibold text-gray/90">
                  Created:
                </span>
                <span className="text-black text-[15px]">
                  {formatDate(person.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default AccessCard;
