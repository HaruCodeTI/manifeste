import * as React from "react";

export type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <label className="inline-flex items-center cursor-pointer select-none">
        <input
          type="checkbox"
          ref={ref}
          className={`appearance-none w-5 h-5 border-2 border-[#b689e0] rounded-md checked:bg-[#b689e0] checked:border-[#b689e0] focus:ring-2 focus:ring-[#b689e0] transition-all duration-150 mr-2 align-middle ${className}`}
          style={{ fontFamily: "Poppins, Arial, sans-serif" }}
          {...props}
        />
        <span className="w-5 h-5 flex items-center justify-center pointer-events-none -ml-7">
          {props.checked && (
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="text-white"
            >
              <path
                d="M4 8.5L7 11.5L12 5.5"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
      </label>
    );
  }
);
Checkbox.displayName = "Checkbox";
