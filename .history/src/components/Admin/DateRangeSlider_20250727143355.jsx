import React from "react";
import { Range } from "react-range";

const STEP = 1;
const MIN = 0;
const MAX = 11;
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

export default function DateRangeSlider({ range, setRange }) {
  return (
    <div className="w-full px-2 mt-4 mb-6">
      <Range
        values={range}
        step={STEP}
        min={MIN}
        max={MAX}
        draggableTrack={true}
        onChange={(values) => {
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
            <div ref={props.ref} className="w-full h-2 bg-gray-300 rounded">
              {children}
            </div>
          </div>
        )}
        renderThumb={({ props, index }) => (
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
            <div
              style={{
                position: "absolute",
                top: "-35px",
                color: "#fff",
                backgroundColor: "#3e503a",
                padding: "4px 8px",
                borderRadius: "4px",
                fontSize: "12px",
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
