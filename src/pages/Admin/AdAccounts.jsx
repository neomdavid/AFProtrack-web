import React, { useState } from "react";
import WebAccessTab from "../../components/Admin/WebAccessTab";
import MobileAccessTab from "../../components/Admin/MobileAccessTab";

const AdAccounts = () => {
  const [activeTab, setActiveTab] = useState("web");
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap mb-8">
        <button
          onClick={() => setActiveTab("web")}
          className={` w-70 flex justify-center border-3 shadow-sm rounded-md bg-white py-2 px-2  border-gray-200 ${
            activeTab === "web"
              ? "border-[3px] border-primary text-primary z-4 font-bold"
              : "hover:bg-gray-100 transition-all duration-100 hover:cursor-pointer"
          }`}
        >
          Training Staff (Web Access)
        </button>

        <button
          onClick={() => setActiveTab("mobile")}
          className={` w-70 flex justify-center border-3 shadow-sm rounded-md bg-white py-2 px-2  border-gray-200 ml-[-4px] ${
            activeTab === "mobile"
              ? "border-[3px] border-primary text-primary z-4 font-bold"
              : "hover:bg-gray-100 transition-all duration-100 hover:cursor-pointer"
          }`}
        >
          AFP Personnel (Mobile Access)
        </button>
      </div>
      {activeTab === "web" ? <WebAccessTab /> : <MobileAccessTab />}
    </div>
  );
};

export default AdAccounts;
