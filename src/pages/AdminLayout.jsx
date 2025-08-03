import React, { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { adminLinks, getCurrentPage } from "../utils";
import logo from "../assets/AFProTrack_logo.png";
import { ShieldIcon, UserCircleIcon } from "@phosphor-icons/react";
import FloatingProfile from "../components/Admin/FloatingProfile";
import { useAuth } from "../context/AuthContext";

const AdminLayout = () => {
  const [isSticky, setIsSticky] = useState(false);
  const sectionRef = useRef();
  const navigate = useNavigate();
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const newStickyState = !entry.isIntersecting;
        setIsSticky(newStickyState);
        console.log('isSticky changed:', newStickyState);
      },
      { threshold: 1.0 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
      console.log('Observer set up for sectionRef');
    }
    
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);
  const location = useLocation();
  console.log(location);
  return (
    <main className="bg-base-400 flex">
      {/* Sidebar */}
      <nav className="fixed text-white w-[230px] z-[10000] flex flex-col top-0 bottom-0 py-10 px-4 bg-primary bg-gradient-to-b from-primary to-[#8DB684]">
        <div className="flex items-center flex-col mb-2">
          <img src={logo} className="w-33" />
        </div>

        <div className="flex flex-col text-sm  justify-between  h-full">
          <div className="flex flex-col gap-2">
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
        </div>
      </nav>

      <div className="ml-58 flex-1 p-8 bg-base-400 relative min-h-screen admin-content">
        {/* Observer element - this should be at the top of the content */}
        <div ref={sectionRef} className="h-1" />
        
        <FloatingProfile isSticky={isSticky} />
        <div className="flex flex-col gap-1 mb-10">
          <h1 className="font-bold text-3xl">System Administration</h1>
          <p className="text-sm  text-gray-600">
            AFProTrack Training Management System &nbsp;{">>"} &nbsp;
            {getCurrentPage(location).name}
          </p>
        </div>
        <Outlet />
      </div>
    </main>
  );
};

export default AdminLayout;
