import React from "react";
import { ListIcon } from "@phosphor-icons/react";
import MobileProfileDropdown from "./MobileProfileDropdown";

const TopNavigation = ({ onOpenProfileModal }) => {
  return (
    <div className="lg:hidden navbar flex justify-between items-center bg-base-100 shadow-sm fixed top-0 left-0 right-0 z-30">
      <div className="a">
        <label htmlFor="admin-drawer" className="btn btn-square btn-ghost">
          <ListIcon size={24} />
        </label>
      </div>
      <div className="text-primary font-bold text-lg">AFProTrack</div>
      <div className="flex-none">
        <MobileProfileDropdown onOpenProfileModal={onOpenProfileModal} />
      </div>
    </div>
  );
};

export default TopNavigation;
