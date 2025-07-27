// components/MetricsList.jsx
import MetricItem from "./MetricItem";

const MetricsList = () => {
  const metrics = [
    {
      title: "Performance Metrics",
      items: [
        { label: "Program Completion Rate", value: 89, color: "#3a77d2" },
        { label: "Attendance Rate", value: 76, color: "#10b981" },
      ],
    },
    {
      title: "Additional Metrics",
      items: [
        { label: "Dropout Rate", value: 19, color: "#f87171" },
        { label: "Satisfaction Score", value: 92, color: "#facc15" },
      ],
    },
  ];

  return (
    <section className="flex gap-8">
      {metrics.map((group, index) => (
        <div
          key={index}
          className="flex flex-1 flex-col gap-6 bg-white p-6 border-3 shadow-sm border-gray-200 rounded-sm"
        >
          <p className="text-xl font-semibold mb-1">{group.title}</p>
          {group.items.map((item, i) => (
            <MetricItem
              key={i}
              label={item.label}
              value={item.value}
              color={item.color}
            />
          ))}
        </div>
      ))}
    </section>
  );
};

export default MetricsList;
