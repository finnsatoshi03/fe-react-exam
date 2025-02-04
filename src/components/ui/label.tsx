import React from "react";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children?: React.ReactNode;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, ...props }, ref) => (
    <label
      ref={ref}
      className={`block font-semibold text-gray-700 ${className}`}
      {...props}
    >
      {children}
    </label>
  ),
);
Label.displayName = "Label";
