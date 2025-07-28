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
    path: "training-data-overview",
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

// Dummy training data for AdTrainingOverview
const trainingData = [
  {
    id: 1,
    name: "Neo David",
    email: "neodavid@gmail.com",
    rank: "Student (SDNT)",
    trainingsAttended: 28,
    avatar: "ND",
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "msantos@afp.mil.ph",
    rank: "Lieutenant",
    trainingsAttended: 35,
    avatar: "MS",
  },
  {
    id: 3,
    name: "Juan Dela Cruz",
    email: "jdelacruz@afp.mil.ph",
    rank: "Captain",
    trainingsAttended: 42,
    avatar: "JC",
  },
  {
    id: 4,
    name: "Ana Reyes",
    email: "areyes@afp.mil.ph",
    rank: "Major",
    trainingsAttended: 38,
    avatar: "AR",
  },
  {
    id: 5,
    name: "Pedro Martinez",
    email: "pmartinez@afp.mil.ph",
    rank: "Colonel",
    trainingsAttended: 51,
    avatar: "PM",
  },
  {
    id: 6,
    name: "Carmen Lopez",
    email: "clopez@afp.mil.ph",
    rank: "Brigadier General",
    trainingsAttended: 45,
    avatar: "CL",
  },
  {
    id: 7,
    name: "Roberto Garcia",
    email: "rgarcia@afp.mil.ph",
    rank: "Lieutenant Colonel",
    trainingsAttended: 33,
    avatar: "RG",
  },
  {
    id: 8,
    name: "Isabel Torres",
    email: "itorres@afp.mil.ph",
    rank: "Major",
    trainingsAttended: 29,
    avatar: "IT",
  },
  {
    id: 9,
    name: "Miguel Rodriguez",
    email: "mrodriguez@afp.mil.ph",
    rank: "Captain",
    trainingsAttended: 36,
    avatar: "MR",
  },
  {
    id: 10,
    name: "Elena Fernandez",
    email: "efernandez@afp.mil.ph",
    rank: "Lieutenant",
    trainingsAttended: 31,
    avatar: "EF",
  },
];

function getCurrentPage(location) {
  return adminLinks.find((link) => location.pathname.includes(link.path));
}

export { adminLinks, fullLabels, fullDatasets, trainingData, getCurrentPage };
