import {
  CheckerboardIcon,
  ClipboardIcon,
  PresentationChartIcon,
} from "@phosphor-icons/react";

const adminLinks = [
  {
    name: "Dashboard",
    path: "admin/dashboard",
    icon: <CheckerboardIcon size={17} />,
  },
  {
    name: "Training Data Overview",
    path: "/training-data",
    icon: <PresentationChartIcon size={17} />,
  },
  {
    name: "Generate Reports",
    path: "/generate-reports",
    icon: <ClipboardIcon size={17} />,
  },
];

export { adminLinks };
