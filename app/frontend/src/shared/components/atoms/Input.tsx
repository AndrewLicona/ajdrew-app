import React from "react";
import clsx from "clsx";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean;
};

export const Input: React.FC<InputProps> = ({ error, className, ...props }) => (
  <input
    className={clsx(
      // Responsivo: padding y fuente
      "block w-full px-3 py-2 rounded border transition bg-card text-text placeholder:text-text-secondary",
      "focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none",
      error ? "border-error" : "border-[var(--color-primary-light)]",
      className
    )}
    {...props}
  />
);
