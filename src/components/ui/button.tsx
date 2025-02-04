import React from "react";

type Variant = "primary" | "secondary" | "destructive" | "ghost";
type ButtonSize = "default" | "sm" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: ButtonSize;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "default", children, ...props },
    ref,
  ) => {
    const variantStyles: Record<Variant, string> = {
      primary:
        "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 cursor-pointer",
      secondary:
        "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-blue-500 cursor-pointer",
      destructive:
        "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 cursor-pointer",
      ghost: "text-gray-700 focus:ring-blue-500 cursor-pointer",
    };

    const sizeStyles: Record<ButtonSize, string> = {
      default: "px-4 py-2",
      sm: "px-3 py-1.5 text-sm",
      lg: "px-6 py-3 text-base",
    };

    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center rounded-md font-medium focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${variantStyles[variant]} ${sizeStyles[size]} ${className} `}
        {...props}
      >
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";
