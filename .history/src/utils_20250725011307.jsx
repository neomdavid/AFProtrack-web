import { CheckerboardIcon, PresentationChartIcon } from "@phosphor-icons/react";

const adminLinks = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: <CheckerboardIcon size={18} />,
  },
  {
    name: "Training Data Overview",
    path: "/training-data",
    icon: <PresentationChartIcon size={18} />,
  },
];

export { adminLinks };
