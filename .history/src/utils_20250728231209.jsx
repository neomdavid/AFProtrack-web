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
  "2025-01-10",
  "2025-02-14",
  "2025-03-12",
  "2025-04-09",
  "2025-05-14",
  "2025-06-11",
  "2025-07-09",
  "2025-08-13",
  "2025-09-10",
  "2025-10-15",
  "2025-11-12",
  "2025-12-10",
];

const fullDatasets = [
  {
    type: "bar",
    label: "Trainings",
    data: [8, 12, 10, 14, 13, 9, 11, 15, 13, 12, 10, 9],
    backgroundColor: "#557CB7",
  },
  {
    type: "line",
    label: "Registered Trainees",
    data: [30, 42, 39, 45, 40, 36, 41, 48, 44, 46, 38, 40],
    borderColor: "#dcb207",
    backgroundColor: "#dcb10734",
    tension: 0.4,
    fill: true,
    pointBackgroundColor: "#ffffff",
    pointBorderColor: "#dcb207",
    pointRadius: 6,
    pointHoverRadius: 8,
  },
  {
    type: "line",
    label: "Total Completers",
    data: [22, 35, 30, 38, 33, 29, 32, 39, 36, 34, 30, 31],
    borderColor: "#3fa728",
    backgroundColor: "#3fa7284c",
    pointBackgroundColor: "#ffffff",
    pointBorderColor: "#3fa728",
    pointRadius: 6,
    pointHoverRadius: 8,
    fill: false,
    tension: 0.4,
  },
];

function getCurrentPage(location) {
  return adminLinks.find((link) => location.pathname.includes(link.path));
}

export { adminLinks, fullLabels, fullDatasets, getCurrentPage };
