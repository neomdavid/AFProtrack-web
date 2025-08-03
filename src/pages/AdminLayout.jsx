import React, { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { adminLinks, getCurrentPage } from "../utils";
import logo from "../assets/AFProTrack_logo.png";
import { ShieldIcon, UserCircleIcon, ListIcon } from "@phosphor-icons/react";
import FloatingProfile from "../components/Admin/FloatingProfile";
import { useAuth } from "../context/AuthContext";

const AdminLayout = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
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
    <div className="drawer lg:drawer-open">
      <input 
        id="admin-drawer" 
        type="checkbox" 
        className="drawer-toggle"
        checked={drawerOpen}
        onChange={(e) => setDrawerOpen(e.target.checked)}
      />
      
      <div className="drawer-content flex flex-col">
        {/* Main Content - keeping original design */}
        <div className="flex-1 p-8 bg-base-400 relative min-h-screen">
          {/* Observer element - this should be at the top of the content */}
          <div ref={sectionRef} className="h-1" />
          
          <FloatingProfile isSticky={isSticky} />
          <div className="flex flex-col gap-1 mb-10">
            <h1 className="font-bold text-3xl">System Administration</h1>
            <p className="text-sm text-gray-600">
              AFProTrack Training Management System &nbsp;{">>"} &nbsp;
              {getCurrentPage(location).name}
            </p>
          </div>
          <Outlet />
        </div>
      </div>

      {/* Sidebar Drawer */}
      <div className="drawer-side">
        <label htmlFor="admin-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <div className="min-h-full w-65 bg-primary bg-gradient-to-b from-primary to-[#8DB684] text-white">
          <div className="flex flex-col h-full">
            {/* Logo Section */}
            <div className="flex items-center justify-center py-8 px-4">
              <img src={logo} className="w-32" alt="AFProTrack Logo" />
            </div>

            {/* Navigation Links */}
            <div className="flex-1 px-4">
              <div className="flex flex-col gap-2">
                {adminLinks.map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    onClick={() => setDrawerOpen(false)} // Close drawer on mobile
                    className={({ isActive }) =>
                      `flex py-3 px-4 rounded-lg items-center gap-3 transition-all duration-200 hover:bg-white/20 ${
                        isActive ? "bg-white/20 text-white" : "text-gray-100"
                      }`
                    }
                  >
                    {link.icon}
                    <span className="text-sm font-medium">{link.name}</span>
                  </NavLink>
                ))}
              </div>
            </div>

            {/* Footer */}
          
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
