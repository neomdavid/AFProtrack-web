import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { adminLinks } from "../utils";
import logo from "../assets/AFProTrack_logo.png";
const AdminLayout = () => {
  return (
    <main className="bg-base-400 h-screen ">
      <nav className="fixed text-white w-58  flex flex-col left-0 top-0 bottom-0 py-10 px-4 bg-primary bg-linear-to-b from-primary to-[#8DB684]">
        <div className="flex items-center flex-col mb-2">
          <img src={logo} className="w-33" />
        </div>

        <div className="flex flex-col text-sm gap-2">
          {adminLinks.map((link) => {
            return (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `flex py-2 px-3 rounded-md items-center gap-2 transition-all duration-200 hover:bg-gray-500/20 ${
                    isActive ? "bg-gray-500/30 text-white" : "text-gray-200"
                  }`
                }
              >
                {link.icon}
                <p>{link.name}</p>
              </NavLink>
            );
          })}
        </div>
      </nav>
      <div className="ml-58 p-8 h-screen bg-base-400">
        <Outlet />
      </div>
    </main>
  );
};

export default AdminLayout;
