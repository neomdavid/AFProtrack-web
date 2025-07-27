const MetricItem = ({ label, value, color = "#3a77d2" }) => {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between">
        <p>{label}</p>
        <p>{value}%</p>
      </div>
      <div className="h-5 w-full rounded-full bg-gray-200 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
};

export default MetricItem;
