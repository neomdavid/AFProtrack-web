import React, { useEffect, useRef, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { adminLinks } from "../utils";
import logo from "../assets/AFProTrack_logo.png";
import { ShieldIcon, UserCircleIcon } from "@phosphor-icons/react";

const AdminLayout = () => {
  const [isSticky, setIsSticky] = useState(false);
  const sectionRef = useRef();
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsSticky(!entry.isIntersecting),
      { threshold: 1.0 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  return (
    <main className="bg-base-400 h-screen flex">
      {/* Sidebar */}
      <nav className="fixed text-white w-58 flex flex-col top-0 bottom-0 py-10 px-4 bg-primary bg-gradient-to-b from-primary to-[#8DB684]">
        <div className="flex items-center flex-col mb-2">
          <img src={logo} className="w-33" />
        </div>

        <div className="flex flex-col text-sm gap-2">
          {adminLinks.map((link) => (
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
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <div className="ml-58 flex-1 p-8 bg-base-400 relative">
        {/* Spacer to detect scroll */}
        <div ref={sectionRef} className="h-1 bg-red-100" />

        {/* Sticky User Section */}
        <div
          className={` top-0 z-50 flex justify-end transition-all duration-300 ${
            isSticky
              ? "sticky backdrop-blur-md bg-white/70 shadow border border-gray-200 rounded-md"
              : "absolute right-0 top-10"
          }`}
        >
          <div className="flex items-center gap-1.5 px-4 py-2">
            <UserCircleIcon size={40} />
            <div className="flex flex-col gap-1">
              <p className="text-xs text-gray-700 mb-[-3px]">Lt.</p>
              <p className="text-sm flex font-light">Surname, FN</p>
              <div className="flex items-center gap-0.5 text-success text-xs bg-base-success px-2 py-1 ml-[-3px] border border-success rounded-2xl">
                <ShieldIcon size={13} weight="bold" />
                <p className="mb-[-2px] text-[11px]">Admin Access</p>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <Outlet />
      </div>
    </main>
  );
};

export default AdminLayout;
