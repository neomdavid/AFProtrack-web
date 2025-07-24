import { CheckerboardIcon, PresentationChartIcon } from "@phosphor-icons/react";

const adminLinks = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: <CheckerboardIcon size={21} />,
  },
  {
    name: "Training Data Overview",
    path: "/training-data",
    icon: <PresentationChartIcon />,
  },
];

export { adminLinks };
