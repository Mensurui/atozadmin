import React, { useEffect, useState } from "react";

interface FormFieldProps {
  htmlFor: string;
  label: string;
  type?: string;
  value: any;
  onChange?: (...args: any) => any;
  error: string;
  className?: string;
  accept?: string; // Add accept prop for specifying accepted file types
}

export function FormField({
  htmlFor,
  label,
  type = "text",
  value,
  onChange = () => {},
  className,
  error = "",
  accept, // Accept accept prop for specifying accepted file types
}: FormFieldProps) {
  const [errorText, setErrorText] = useState(error);
  useEffect(() => {
    setErrorText(error);
  }, [error]);

  return (
    <>
      <label htmlFor={htmlFor} className={`text-black font-semibold ${className || ''}`}>
        {label}
      </label>
      {type === "file" ? ( // Check if the field type is "file"
        <input
          onChange={(e) => {
            onChange(e);
            setErrorText("");
          }}
          type={type}
          id={htmlFor}
          name={htmlFor}
          accept={accept} // Pass the accept prop to specify accepted file types
          className={className || ''}
        />
      ) : (
        <input
          onChange={(e) => {
            onChange(e);
            setErrorText("");
          }}
          type={type}
          id={htmlFor}
          name={htmlFor}
          value={value}
          className={className || ''} 
        />
      )}
      <div className={`text-xs font-semibold text-center tracking-wide text-red-500 w-full ${className || ''}`}>
        {errorText || ''}
      </div>
    </>
  );
}
