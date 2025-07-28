import { ShieldIcon, UserCircleIcon } from "@phosphor-icons/react";
import React from "react";

const FloatingProfile = ({ sectionRef, isSticky }) => {
  return (
    <>
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
    </>
  );
};

export default FloatingProfile;
