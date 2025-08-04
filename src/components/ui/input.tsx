import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-[0.75rem] border border-[#e0d7f3] bg-[#f4eae6] px-3 py-2 text-sm text-[#1a1a1a] placeholder:text-[#bfaecb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37] focus-visible:border-[#d4af37] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
