// MixedChart.jsx
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { toPadding } from "chart.js/helpers";
import { Chart } from "react-chartjs-2";

// Register required components
ChartJS.register(
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler,
  Tooltip,
  Legend
);

const MixedChart = () => {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        type: "bar",
        label: "Bar Dataset",
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: "#3e503a",
      },
      {
        type: "line",
        label: "Line Dataset",
        data: [2, 3, 20, 5, 1, 4],
        borderColor: "#dcb207",
        tension: 0.4,
        fill: false,
      },
      {
        type: "line", // Use line for area chart too, with fill enabled
        label: "Area Dataset",
        data: [5, 15, 8, 3, 10, 7],
        borderColor: "#8DB684",
        backgroundColor: "#8DB68490", // translucent for area
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    stacked: false,
    plugins: {
      legend: {
        align: "end",
        labels: {
          color: "#000000",
          boxWidth: 20,
          boxHeight: 20,
          useBorderRadius: true,
          borderRadius: 3,
          toPadding: 20,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Chart type="bar" data={data} options={options} />;
};

export default MixedChart;
