import React from "react";

const LabeledInput = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  error,
  required,
  className = "input w-full h-9 text-sm",
}) => (
  <div>
    <label className="label py-1">
      <span className="label-text font-medium text-sm">{label}</span>
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={`${className} ${error ? "input-error" : "input-bordered"}`}
    />
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

export default LabeledInput;
