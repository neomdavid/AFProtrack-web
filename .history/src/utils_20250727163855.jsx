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
  "2025-01-15",
  "2025-02-15",
  "2025-03-15",
  "2025-04-15",
  "2025-05-15",
  "2025-06-15",
  "2025-07-15",
  "2025-08-15",
  "2025-09-15",
];

const fullDatasets = [
  {
    type: "bar",
    label: "Trainings",
    data: [12, 19, 3, 5, 2, 3, 4, 6, 2, 8, 1, 5],
    backgroundColor: "#557CB7",
  },
  {
    type: "line",
    label: "Registered Trainees",
    data: [2, 3, 20, 5, 1, 4, 7, 9, 3, 6, 4, 2],
    borderColor: "#dcb207",
    backgroundColor: "#dcb10734",
    tension: 0.4,
    fill: true,
    pointBackgroundColor: "#FFFFFF",
    pointBorderColor: "#dcb207",
    pointRadius: 5,
    pointHoverRadius: 7,
  },
  {
    type: "line",
    label: "Total Completers",
    data: [5, 15, 8, 3, 10, 7, 9, 6, 4, 5, 3, 2],
    borderColor: "#3fa728",
    pointBackgroundColor: "#FFFFFF",
    pointBorderColor: "#3fa728",
    pointRadius: 5,
    pointHoverRadius: 7,
    fill: false,
    tension: 0.4,
  },
];

export { adminLinks, fullLabels, fullDatasets };
