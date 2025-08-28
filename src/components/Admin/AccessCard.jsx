import React, { useState } from "react";
import { InfoIcon, TrashIcon } from "@phosphor-icons/react";
import {
  useGetActiveUserByIdQuery,
  useDeleteUserMutation,
  useUpdateUserStatusMutation,
} from "../../features/api/adminEndpoints";
import { useAuth } from "../../hooks/useAuth";

const AccessCard = ({ person }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [deleteUser] = useDeleteUserMutation();
  const [updateUserStatus] = useUpdateUserStatusMutation();
  const { user: currentUser } = useAuth();

  // Check if this account belongs to the currently logged-in user
  const isOwnAccount =
    currentUser?.id === person.id || currentUser?._id === person.id;

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleArchiveAccount = async () => {
    if (isOwnAccount) {
      console.warn("Cannot archive own account");
      return;
    }

    try {
      await deleteUser(person.id).unwrap();
      setIsModalOpen(false);
    } catch (e) {
      console.error("Failed to archive user", e);
    }
  };

  const { data: userDetails } = useGetActiveUserByIdQuery(person.id, {
    skip: !isModalOpen,
  });

  // Normalize response: API may return the user object directly or as data.users[]
  const rawUsers = Array.isArray(userDetails?.users) ? userDetails.users : null;
  const details = rawUsers
    ? rawUsers.find((u) => (u.id || u._id) === person.id) || {}
    : userDetails || {};
  const fullName = details.fullName || person.name;
  const avatar = details.avatar || person.avatar;
  const afpId = details.serviceId || person.afpId;
  const email = details.email || person.email;
  const unit = details.unit || person.unit;
  const branch = details.branchOfService || person.branchOfService;
  const division = details.division || "";
  const rank = details.rank || "";
  const address = details.address || "";
  const contactNumber = details.contactNumber || "";
  const dateOfBirth = details.dateOfBirth || "";
  const role = details.role || "";

  return (
    <>
      <div
        className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer relative"
        onClick={handleCardClick}
      >
        {/* Own Account Indicator */}
        {isOwnAccount && (
          <div className="absolute top-4 right-4 bg-gray-300/90 text-gray-800 text-xs px-2 py-1 rounded-full font-medium">
            You
          </div>
        )}

        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
            {avatar}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-800 truncate">{fullName}</p>
            <p className="text-sm text-gray-600 truncate">{afpId}</p>
            <p className="text-sm text-gray-600 truncate">{email}</p>
            <p className="text-xs text-gray-500 truncate">{unit}</p>
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

            {/* AFP ID */}
            <p className="text-sm text-primary font-bold">{afpId}</p>
            {/* Rank */}
            <p className="text-md text-black font">{rank}</p>

            {/* Name */}
            <h3 className="font-bold text-2xl text-black">{fullName}</h3>

            {/* Email */}
            <p className="text-sm text-gray">{email}</p>
            {isOwnAccount && (
              <div className="flex items-start gap-2 bg-gray-100 p-2 rounded-md mt-4 mb-[-13px]">
                <InfoIcon size={16} className="text-gray-600 mt-[2px]" />
                <span className="text-[13px] text-gray-700">
                  You can’t change the status or archive your own account.
                </span>
              </div>
            )}

            {/* Status and Archive Container */}
            <div className="flex justify-between items-center w-full mt-6">
              <div className="flex flex-col items-start gap-2">
                <span className="text-sm font-semibold text-gray/90">
                  Account Status:
                </span>
                <label
                  className={`relative inline-flex items-center ${
                    isOwnAccount
                      ? "cursor-not-allowed opacity-60"
                      : "cursor-pointer"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={isActive}
                    onChange={async (e) => {
                      if (isOwnAccount) return; // Prevent own account manipulation
                      const next = e.target.checked;
                      setIsActive(next);
                      try {
                        await updateUserStatus({
                          userId: person.id,
                          accountStatus: next ? "active" : "inactive",
                        }).unwrap();
                      } catch (err) {
                        console.error("Failed to update status", err);
                        setIsActive(!next);
                      }
                    }}
                    disabled={isOwnAccount}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  <span className="ml-3 text-sm font-medium text-black">
                    {isActive ? "Active" : "Inactive"}
                  </span>
                </label>
              </div>
              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={handleArchiveAccount}
                  disabled={isOwnAccount}
                  className={`flex items-center text-[13px] px-2 py-1 rounded-md gap-2 ${
                    isOwnAccount
                      ? "bg-gray-200 text-gray-700 cursor-not-allowed"
                      : "bg-error text-white btn-hover"
                  }`}
                >
                  <TrashIcon size={16} />
                  Archive Account
                </button>
              </div>
            </div>

            {/* Additional Details Container */}
            <div className="w-full space-y-3 mt-6 text-left bg-gray/5 p-3 rounded-sm ">
              <div className="flex gap-2 items-center">
                <span className="text-sm font-semibold text-gray/90">
                  Unit:
                </span>
                <span className="text-black text-[15px]">{unit}</span>
              </div>
              <div className="flex gap-2 items-center">
                <span className="text-sm font-semibold text-gray/90">
                  Branch of Service:
                </span>
                <span className="text-black text-[15px]">{branch}</span>
              </div>
              <div className="flex gap-2 items-center">
                <span className="text-sm font-semibold text-gray/90">
                  Division:
                </span>
                <span className="text-black text-[15px]">{division}</span>
              </div>
              <div className="flex gap-2 items-center">
                <span className="text-sm font-semibold text-gray/90">
                  Date of Birth:
                </span>
                <span className="text-black text-[15px]">
                  {dateOfBirth && new Date(dateOfBirth).toLocaleDateString()}
                </span>
              </div>
              <div className="flex gap-2 items-center">
                <span className="text-sm font-semibold text-gray/90">
                  Phone:
                </span>
                <span className="text-black text-[15px]">{contactNumber}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray/90 mb-1">
                  Address:
                </span>
                <span className="text-black text-[15px]">{address}</span>
              </div>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default AccessCard;
