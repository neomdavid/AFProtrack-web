import React, { useState } from "react";
import { Range } from "react-range";

const labels = [
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

const STEP = 1;
const MIN = 0;
const MAX = labels.length - 1;
const WINDOW_SIZE = 6;

export default function DateRangeSlider() {
  const [range, setRange] = useState([0, WINDOW_SIZE]);

  return (
    <div className="w-full px-4 mt-8">
      <Range
        values={range}
        step={STEP}
        min={MIN}
        max={MAX}
        allowOverlap={false}
        draggableTrack={true}
        onChange={(values) => {
          // Prevent out-of-bounds dragging
          const windowSize = values[1] - values[0];
          if (values[0] < MIN || values[1] > MAX) return;
          setRange(values);
        }}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: "36px",
              display: "flex",
              width: "100%",
            }}
          >
            <div
              ref={props.ref}
              className="w-full h-2 rounded bg-gray-300 relative"
            >
              {children}
            </div>
          </div>
        )}
        renderThumb={({ props, index, isDragged }) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: "24px",
              width: "24px",
              backgroundColor: "#3e503a",
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            {/* Tooltip above thumb */}
            <div
              style={{
                position: "absolute",
                top: "-35px",
                color: "#fff",
                backgroundColor: "#3e503a",
                padding: "4px 8px",
                borderRadius: "4px",
                fontSize: "12px",
                whiteSpace: "nowrap",
              }}
            >
              {labels[range[index]]}
            </div>
          </div>
        )}
      />
    </div>
  );
}
