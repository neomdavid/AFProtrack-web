import React from "react";
import { NavLink } from "react-router-dom";
import { HorseIcon, CheckerboardIcon } from "@phosphor-icons/react";
import { adminLinks } from "../utils";
const AdminLayout = () => {
  return (
    <main className="bg-base-400">
      x
      <nav className="fixed text-white w-60 gap-10 flex flex-col left-0 top-0 bottom-0 py-10 px-4 bg-primary">
        <div className="flex flex-col">
          <img />
          <p className="font-semibold text-lg text-center">AFProTrack</p>
        </div>
        {adminLinks.map(() => {
          return (
            <div className="flex flex-col text-md">
              <NavLink
                to="/dashboard"
                className="flex py-2 px-3 rounded-md items-center gap-2 hover:bg-gray-500/20 transition-all duration-200"
              ></NavLink>
            </div>
          );
        })}
        <div className="flex flex-col text-md">
          <NavLink
            to="/dashboard"
            className="flex py-2 px-3 rounded-md items-center gap-2 hover:bg-gray-500/20 transition-all duration-200"
          >
            <CheckerboardIcon size={21} />
            <p>Dashboard</p>
          </NavLink>
        </div>
      </nav>
    </main>
  );
};

export default AdminLayout;
