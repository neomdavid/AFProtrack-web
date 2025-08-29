import React from "react";

const LabeledSelect = ({
  label,
  name,
  value,
  onChange,
  options,
  placeholder = "Select...",
  error,
  disabled,
  required,
  className = "select w-full h-9 text-sm appearance-none",
}) => (
  <div>
    <label className="label py-1">
      <span className="label-text font-medium text-sm">{label}</span>
    </label>
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`${className} ${error ? "select-error" : "select-bordered"}`}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option
            key={opt.value ?? opt.code ?? opt.label}
            value={opt.value ?? opt.label}
          >
            {opt.label}
          </option>
        ))}
      </select>
    </div>
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

export default LabeledSelect;
