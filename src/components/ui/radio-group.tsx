import { cn } from "@/lib/utils";
import * as React from "react";

interface RadioGroupContextType {
  value: string;
  onValueChange: (value: string) => void;
}

const RadioGroupContext = React.createContext<
  RadioGroupContextType | undefined
>(undefined);

interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  onValueChange?: (value: string) => void;
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, children, value = "", onValueChange, ...props }, ref) => {
    return (
      <RadioGroupContext.Provider
        value={{ value, onValueChange: onValueChange || (() => {}) }}
      >
        <div ref={ref} className={cn("grid gap-2", className)} {...props}>
          {children}
        </div>
      </RadioGroupContext.Provider>
    );
  }
);
RadioGroup.displayName = "RadioGroup";

interface RadioGroupItemProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
}

const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ value, ...props }, ref) => {
    const context = React.useContext(RadioGroupContext);
    if (!context) {
      throw new Error("RadioGroupItem must be used within a RadioGroup");
    }

    const { value: groupValue, onValueChange } = context;
    const checked = groupValue === value;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onValueChange(value);
      if (props.onChange) {
        props.onChange(e);
      }
    };

    return (
      <label className="inline-flex items-center cursor-pointer select-none">
        <input
          type="radio"
          ref={ref}
          value={value}
          checked={checked}
          onChange={handleChange}
          className="sr-only peer"
          {...props}
        />
        <span
          className={cn(
            "relative w-5 h-5 flex items-center justify-center mr-2 align-middle transition-all duration-150",
            checked
              ? "border-2 border-[#b689e0] bg-[#b689e0] shadow-md"
              : "border-2 border-[#e1e1e1] bg-white",
            "rounded-full peer-focus-visible:ring-2 peer-focus-visible:ring-[#b689e0]"
          )}
          style={{ fontFamily: "Poppins, Arial, sans-serif" }}
        >
          <span
            className={cn(
              "block rounded-full transition-all duration-150",
              checked ? "w-2.5 h-2.5 bg-white" : "w-0 h-0 bg-transparent"
            )}
          />
        </span>
      </label>
    );
  }
);
RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };
