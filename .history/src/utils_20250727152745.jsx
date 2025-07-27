import {
  CheckerboardIcon,
  ClipboardIcon,
  PresentationChartIcon,
} from "@phosphor-icons/react";

const adminLinks = [
  {
    name: "Dashboard",
    path: "dashboard",
    icon: <CheckerboardIcon size={17} />,
  },
  {
    name: "Training Data Overview",
    path: "training-data",
    icon: <PresentationChartIcon size={17} />,
  },
  {
    name: "Generate Reports",
    path: "generate-reports",
    icon: <ClipboardIcon size={17} />,
  },
];

const fullLabels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const fullDatasets = [
  {
    type: "bar",
    label: "Trainings",
    data: [12, 19, 3, 5, 2, 3, 4, 6, 2, 8, 1, 5],
    backgroundColor: "#3a3abe",
  },
  {
    type: "line",
    label: "Registered Trainees",
    data: [2, 3, 20, 5, 1, 4, 7, 9, 3, 6, 4, 2],
    borderColor: "#dcb207",
    tension: 0.4,
    fill: false,
  },
  {
    type: "line",
    label: "Total Completers",
    data: [5, 15, 8, 3, 10, 7, 9, 6, 4, 5, 3, 2],
    borderColor: "#8DB684",
    backgroundColor: "#8DB68490",
    fill: true,
    tension: 0.4,
  },
];

export { adminLinks, fullLabels, fullDatasets };
