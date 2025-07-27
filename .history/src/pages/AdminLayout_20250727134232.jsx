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

      <div className="ml-58 flex-1  bg-base-400 relative ">
        <div ref={sectionRef} className="h-1" />

        <div className="fixed top-6 right-8 z-50">
          <div
            className={`
        transition-all duration-300 ease-in-out px-4 py-3 flex items-center gap-1.5 rounded-3xl
        ${isSticky ? "backdrop-blur-sm shadow  bg-white/20" : "bg-transparent"}
      `}
          >
            <UserCircleIcon size={39} />
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

        <Outlet />
      </div>
    </main>
  );
};

export default AdminLayout;
