import { cn } from "@/lib/utils";
import * as React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  onValueChange?: (value: string) => void;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, onValueChange, ...props }, ref) => {
    return (
      <select
        className={cn(
          "flex h-10 w-full rounded-[0.75rem] border border-[#e0d7f3] bg-[#f4eae6] px-3 py-2 text-sm font-sans text-[#1a1a1a] placeholder:text-[#bfaecb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37] focus-visible:border-[#d4af37] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none transition-colors duration-200",
          className
        )}
        ref={ref}
        onChange={(e) => onValueChange?.(e.target.value)}
        {...props}
      >
        {children}
      </select>
    );
  }
);
Select.displayName = "Select";

const SelectItem = React.forwardRef<
  HTMLOptionElement,
  React.OptionHTMLAttributes<HTMLOptionElement>
>(({ className, ...props }, ref) => (
  <option
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
      className
    )}
    ref={ref}
    {...props}
  />
));
SelectItem.displayName = "SelectItem";

const SelectValue = ({ placeholder }: { placeholder?: string }) => (
  <option value="" disabled hidden>
    {placeholder}
  </option>
);

export { Select, SelectItem, SelectValue };
