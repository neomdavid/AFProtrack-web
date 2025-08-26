import React, { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { adminLinks, getCurrentPage } from "../utils";
import logo from "../assets/AFProTrack_logo.png";
import FloatingProfile from "../components/Admin/FloatingProfile";
import TopNavigation from "../components/Admin/TopNavigation";
import Sidebar from "../components/Admin/Sidebar";
import ProfileModal from "../components/Admin/ProfileModal";
import { useAuth } from "../hooks/useAuth";

const AdminLayout = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const sectionRef = useRef();
  const navigate = useNavigate();
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const newStickyState = !entry.isIntersecting;
        setIsSticky(newStickyState);
        console.log("isSticky changed:", newStickyState);
      },
      { threshold: 1.0 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
      console.log("Observer set up for sectionRef");
    }

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);
  const location = useLocation();
  console.log(location);
  const current = getCurrentPage(location);
  const breadcrumbName =
    current?.name ||
    (location.pathname.includes("/attendance") ? "Attendance" : "");

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
        {/* Mobile Top Navigation */}
        <TopNavigation onOpenProfileModal={() => setIsProfileModalOpen(true)} />

        {/* Main Content - keeping original design */}
        <div className="flex-1 p-4 sm:p-8 bg-base-400 relative min-h-screen lg:pt-8 pt-20">
          {/* Observer element - this should be at the top of the content */}
          <div ref={sectionRef} className="h-1" />

          {/* Desktop Floating Profile */}
          <div className="hidden lg:block">
            <FloatingProfile
              isSticky={isSticky}
              onOpenProfileModal={() => setIsProfileModalOpen(true)}
            />
          </div>

          <div className="flex flex-col gap-1 mb-6 sm:mb-10">
            <h1 className="font-bold text-xl sm:text-3xl">
              System Administration
            </h1>
            <p className="text-xs  sm:text-sm text-gray-600">
              AFProTrack Training Management System &nbsp;{">>"} &nbsp;
              {breadcrumbName || "Admin"}
            </p>
          </div>
          <Outlet />
        </div>
      </div>

      {/* Sidebar Drawer */}
      <Sidebar drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />

      {/* Profile Modal - Outside drawer system */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </div>
  );
};

export default AdminLayout;
