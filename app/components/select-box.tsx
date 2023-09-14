import React from "react";

interface SelectBoxProps {
  options: string[];
  className?: string;
  containerClassName?: string;
  id?: string;
  name?: string;
  label?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function SelectBox({
  options = [],
  onChange = () => {},
  className = '',
  containerClassName = '',
  name,
  id,
  value,
  label,
}: SelectBoxProps) {
  return (
    <div>
      <label htmlFor={id} className="text-blue-600 font-semibold">
        {label}
      </label>
      <div className={`flex items-center ${containerClassName} my-2`}>
        <select
          className={`${className} appearance-none`}
          id={id}
          name={name}
          onChange={onChange}
          value={value || ''}
        >
          <option value="">Select an option</option>
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
        <svg
          className="w-4 h-4 fill-current text-gray-400 -ml-7 mt-1 pointer-events-none"
          viewBox="0 0 140 140"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* ... SVG path data */}
        </svg>
      </div>
    </div>
  );
}
