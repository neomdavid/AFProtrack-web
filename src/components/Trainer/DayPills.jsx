import React from "react";

const DayPills = ({ sessions, selectedKey, onDateSelect, sessionMeta }) => {
  const today = new Date();
  const formatDayLabel = (d) =>
    d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  const formatYMD = (d) => d.toISOString().slice(0, 10);

  const getTooltipText = (ymd) => {
    const isCancelled = (sessionMeta[ymd]?.status || "active") === "cancelled";
    const isCompleted = !!sessionMeta[ymd]?.completed;

    if (isCancelled) {
      const reason = sessionMeta[ymd]?.reason;
      return reason ? `Cancelled: ${reason}` : "Cancelled";
    }
    if (isCompleted) {
      return "Completed";
    }
    return undefined;
  };

  return (
    <div className="overflow-x-auto sticky top-0 z-10 bg-white/90 backdrop-blur">
      <div className="flex gap-2 py-1">
        {sessions.map((d) => {
          const ymd = formatYMD(d);
          const isActive = ymd === selectedKey;
          const isToday = formatYMD(today) === ymd;
          const isCancelled =
            (sessionMeta[ymd]?.status || "active") === "cancelled";
          const isCompleted = !!sessionMeta[ymd]?.completed;

          return (
            <button
              key={ymd}
              onClick={() => onDateSelect(ymd)}
              className={`relative px-3 py-1.5 rounded-full border text-sm whitespace-nowrap ${
                isActive
                  ? "border-primary text-primary bg-primary/10"
                  : "border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
              title={getTooltipText(ymd)}
            >
              {formatDayLabel(d)}
              {isToday ? " • Today" : ""}
              {(isCancelled || isCompleted) && (
                <span
                  className={`absolute -right-1 -top-1 w-2.5 h-2.5 rounded-full ${
                    isCancelled ? "bg-red-500" : "bg-green-500"
                  }`}
                ></span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DayPills;
