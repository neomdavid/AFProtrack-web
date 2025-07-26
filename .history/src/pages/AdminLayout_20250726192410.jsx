import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { adminLinks } from "../utils";
import logo from "../assets/AFProTrack_logo.png";
import {
  ShieldIcon,
  UserCircleCheckIcon,
  UserCircleIcon,
} from "@phosphor-icons/react";
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
                  `flex py-2 px-3 rounded-md items-center gap-2 transition-all duration-200 hover:bg-white/20 ${
                    isActive ? "bg-white/20 text-white" : "text-gray-100"
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
      <div className="ml-58 p-8 relative bg-base-400">
        <Outlet />
        <section className="fixed flex items-center gap-1.5 right-12 top-7">
          <UserCircleIcon size={40} />
          <div className="flex flex-col gap-[1.5px]">
            <p className="text-xs text-gray-700">Lt.</p>
            <p className="text-sm flex font-light">Surname, FN</p>
            <div className="flex items-center gap-0.5 text-xs text-success bg-base-success px-2 py-1 ml-[-2px] rounded-2xl">
              <ShieldIcon size={15} />
              <p>Admin Access</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default AdminLayout;
