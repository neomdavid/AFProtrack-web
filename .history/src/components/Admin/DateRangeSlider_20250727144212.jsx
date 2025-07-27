import React from "react";
import { Range } from "react-range";

const STEP = 1;
const MIN = 0;
const MAX = 11;

const monthLabels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function DateRangeSlider({ range, setRange }) {
  return (
    <div className="w-full px-2 mt-4 mb-6">
      <Range
        values={range}
        step={STEP}
        min={MIN}
        max={MAX}
        draggableTrack={true}
        onChange={(values) => setRange(values)}
        renderTrack={({ props, children }) => (
          <div
            onMouseDown={props.onMouseDown}
            onTouchStart={props.onTouchStart}
            style={{
              ...props.style,
              height: "40px",
              display: "flex",
              width: "100%",
              alignItems: "center", // ✅ Align thumbs vertically
            }}
          >
            <div
              ref={props.ref}
              style={{
                height: "6px",
                width: "100%",
                background: `linear-gradient(
                  to right,
                  #d1d5db ${((range[0] / MAX) * 100).toFixed(2)}%,
                  #3e503a ${((range[0] / MAX) * 100).toFixed(2)}%,
                  #3e503a ${((range[1] / MAX) * 100).toFixed(2)}%,
                  #d1d5db ${((range[1] / MAX) * 100).toFixed(2)}%
                )`,
                borderRadius: "4px",
              }}
            >
              {children}
            </div>
          </div>
        )}
        renderThumb={({ props, index }) => {
          const label = monthLabels[range[index]] ?? "";
          return (
            <div
              {...props}
              style={{
                ...props.style,
                height: "20px",
                width: "20px",
                backgroundColor: "#3e503a",
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                top: "20px", // ✅ Remove offset that makes right thumb lower
              }}
            >
              {/* Tooltip */}
              <div
                style={{
                  position: "absolute",
                  top: "-30px",
                  backgroundColor: "#3e503a",
                  color: "#fff",
                  padding: "3px 8px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  whiteSpace: "nowrap",
                }}
              >
                {label}
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}
