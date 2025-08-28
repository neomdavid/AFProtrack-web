import {
  CheckerboardIcon,
  ClipboardIcon,
  PresentationChartIcon,
  UsersIcon,
  CheckCircleIcon,
} from "@phosphor-icons/react";

const adminLinks = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: <CheckerboardIcon size={17} />,
  },
  {
    name: "Training Data Overview",
    path: "/admin/training_data_overview",
    icon: <PresentationChartIcon size={17} />,
  },
  {
    name: "Account Management",
    path: "/admin/accounts",
    icon: <UsersIcon size={17} />,
  },
  {
    name: "Account Confirmation",
    path: "/admin/account_confirmation",
    icon: <CheckCircleIcon size={17} />,
    requiredPermission: "canApproveUsers", // Add permission requirement
  },
];

const fullLabels = [
  "Jan 10, 2025",
  "Feb 14, 2025",
  "Mar 12, 2025",
  "Apr 9, 2025",
  "May 14, 2025",
  "Jun 11, 2025",
  "Jul 9, 2025",
  "Aug 13, 2025",
  "Sep 10, 2025",
  "Oct 15, 2025",
  "Nov 12, 2025",
  "Dec 10, 2025",
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

// Dummy personnel data for WebAccessTab
const personnelData = [
  {
    id: 1,
    afpId: "AFP-2024-001",
    name: "Neo David",
    email: "neodavid@gmail.com",
    unit: "1st Infantry Division",
    branchOfService: "Army",
    avatar: "ND",
  },
  {
    id: 2,
    afpId: "AFP-2024-002",
    name: "Maria Santos",
    email: "msantos@afp.mil.ph",
    unit: "2nd Infantry Division",
    branchOfService: "Army",
    avatar: "MS",
  },
  {
    id: 3,
    afpId: "AFP-2024-003",
    name: "Juan Dela Cruz",
    email: "jdelacruz@afp.mil.ph",
    unit: "3rd Infantry Division",
    branchOfService: "Army",
    avatar: "JC",
  },
  {
    id: 4,
    afpId: "AFP-2024-004",
    name: "Ana Reyes",
    email: "areyes@afp.mil.ph",
    unit: "1st Infantry Division",
    branchOfService: "Army",
    avatar: "AR",
  },
  {
    id: 5,
    afpId: "AFP-2024-005",
    name: "Pedro Martinez",
    email: "pmartinez@afp.mil.ph",
    unit: "2nd Infantry Division",
    branchOfService: "Army",
    avatar: "PM",
  },
  {
    id: 6,
    afpId: "AFP-2024-006",
    name: "Carmen Lopez",
    email: "clopez@afp.mil.ph",
    unit: "3rd Infantry Division",
    branchOfService: "Army",
    avatar: "CL",
  },
  {
    id: 7,
    afpId: "AFP-2024-007",
    name: "Roberto Garcia",
    email: "rgarcia@afp.mil.ph",
    unit: "1st Infantry Division",
    branchOfService: "Army",
    avatar: "RG",
  },
  {
    id: 8,
    afpId: "AFP-2024-008",
    name: "Isabel Torres",
    email: "itorres@afp.mil.ph",
    unit: "2nd Infantry Division",
    branchOfService: "Army",
    avatar: "IT",
  },
  {
    id: 9,
    afpId: "AFP-2024-009",
    name: "Miguel Rodriguez",
    email: "mrodriguez@afp.mil.ph",
    unit: "3rd Infantry Division",
    branchOfService: "Army",
    avatar: "MR",
  },
  {
    id: 10,
    afpId: "AFP-2024-010",
    name: "Elena Fernandez",
    email: "efernandez@afp.mil.ph",
    unit: "1st Infantry Division",
    branchOfService: "Army",
    avatar: "EF",
  },
];

function getCurrentPage(location) {
  return adminLinks.find((link) => location.pathname.includes(link.path));
}

// Formats a date string (YYYY-MM-DD or ISO) to 'Aug 23, 2025'
function formatDateShort(dateInput) {
  if (!dateInput) return "";
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export {
  adminLinks,
  fullLabels,
  fullDatasets,
  trainingData,
  personnelData,
  getCurrentPage,
  formatDateShort,
};
