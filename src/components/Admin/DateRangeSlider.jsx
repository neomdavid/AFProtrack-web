import React from "react";
import { Range } from "react-range";

const STEP = 1;
const MIN = 0;
const MAX = 11;

const fullLabels = [
  "Jan 10, 2025",
  "Feb 14, 2025",
  "Mar 12, 2025",
  "Apr 9, 2025",
  "May 14, 2025",
  "Jun 11, 2025",
  "Jul 9, 2025",
  "Aug 13, 2025",
  "Sep 10, 2025",
  "Oct 15, 2025",
  "Nov 12, 2025",
  "Dec 10, 2025",
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
            className="h-10 bg-white border border-black/20 rounded-lg p-5 flex items-center"
          >
            <div
              ref={props.ref}
              className="h-2 w-full rounded-md"
              style={{
                background: `linear-gradient(
                  to right,
                  #d1d5db ${((range[0] / MAX) * 100).toFixed(2)}%,
                  #3e503a ${((range[0] / MAX) * 100).toFixed(2)}%,
                  #3e503a ${((range[1] / MAX) * 100).toFixed(2)}%,
                  #d1d5db ${((range[1] / MAX) * 100).toFixed(2)}%
                )`,
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
              className="h-5 w-5 bg-[#3e503a] rounded-full flex justify-center items-center mt-[-0.5px]"
            >
              <div className="absolute -bottom-6.5 left-1/2 transform -translate-x-1/2 bg-[#3e503a] text-white px-2 py-0.5 rounded text-xs sm:text-sm whitespace-nowrap">
                {label}
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}
