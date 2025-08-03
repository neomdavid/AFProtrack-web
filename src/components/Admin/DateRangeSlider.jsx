import React from "react";
import { Range } from "react-range";

const STEP = 1;
const MIN = 0;
const MAX = 11;

const fullLabels = [
  "2025-01-10",
  "2025-02-14",
  "2025-03-12",
  "2025-04-09",
  "2025-05-14",
  "2025-06-11",
  "2025-07-09",
  "2025-08-13",
  "2025-09-10",
  "2025-10-15",
  "2025-11-12",
  "2025-12-10",
];

export default function DateRangeSlider({ range, setRange }) {
  return (
    <div className="w-full max-w-  px-2">
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
              backgroundColor: "white",
              border: "solid 1px #00000038",
              borderRadius: "6px",
              padding: "20px",
              display: "flex",
              width: "100%",
              alignItems: "center", // ✅ Align thumbs vertically
            }}
          >
            <div
              ref={props.ref}
              style={{
                height: "7px",
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
          const label = fullLabels[range[index]] ?? "";
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
                marginTop: "-1px",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  bottom: "-30px",
                  left: "50%",
                  transform: "translateX(-50%)",
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
