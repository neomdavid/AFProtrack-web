import React from "react";
import { CaretDownIcon } from "@phosphor-icons/react";

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
      <CaretDownIcon
        weight="bold"
        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none h-4 w-4"
      />
    </div>
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

export default LabeledSelect;
