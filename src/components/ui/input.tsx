import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "ghost";
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", variant = "default", ...props }, ref) => {
    const variantStyles = {
      default: `
          block w-full rounded-md border border-gray-300 
          px-3 py-2
          focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500
        `,
      ghost: `
          block w-full border-none bg-transparent 
          px-3 py-2 
          focus:outline-none focus:ring-0
        `,
    };

    return (
      <input
        type={type}
        ref={ref}
        className={`${variantStyles[variant]} ${className}`}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";
