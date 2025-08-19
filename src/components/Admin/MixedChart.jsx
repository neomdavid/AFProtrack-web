import { Chart } from "react-chartjs-2";
import {
  Chart as ChartJS, BarElement, LineElement, PointElement,
  CategoryScale, LinearScale, Filler, Tooltip, Legend
} from "chart.js";

ChartJS.register(BarElement, LineElement, PointElement, CategoryScale, LinearScale, Filler, Tooltip, Legend);

const MixedChart = ({ labels, datasets }) => {
  const data = { labels, datasets };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // important for height control
    interaction: { mode: "index", intersect: false },
    stacked: false,
    plugins: {
      legend: {
        align: "end",
        labels: {
          color: "#00000097",
          boxWidth: 20,
          boxHeight: 20,
          useBorderRadius: true,
          borderRadius: 3,
        },
      },
    },
    scales: { y: { beginAtZero: true } },
  };

  return (
    <div className="w-full h-64 sm:h-72 md:h-80 lg:h-[420px] xl:h-[480px]">
      <Chart type="bar" data={data} options={options} />
    </div>
  );
};

export default MixedChart;