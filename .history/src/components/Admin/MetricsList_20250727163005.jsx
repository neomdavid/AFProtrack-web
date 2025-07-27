import MetricItem from "./MetricItem";

const MetricsList = ({ metrics }) => {
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
