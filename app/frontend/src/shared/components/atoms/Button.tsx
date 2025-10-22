import React from "react";
import clsx from "clsx";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "success"
  | "info"
  | "ghost"
  | "custom";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
  customColorClass?: string;
  children?: React.ReactNode;
};

export const Bt: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  customColorClass,
  className,
  children,
  disabled,
  ...props
}) => {
  const variantClasses: Record<ButtonVariant, string> = {
    primary: "bg-[var(--color-primary)] text-[var(--color-text-on-primary)] hover:bg-[var(--color-primary-dark)]", 
    secondary: "bg-transparent border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary-light)]", 
    danger: "bg-[var(--color-danger)] hover:bg-[var(--color-danger-hover)] text-[var(--color-on-danger)] disabled:bg-[var(--color-danger-disabled)]",
    success: "bg-[var(--color-success)] hover:bg-[var(--color-success-hover)] text-[var(--color-on-success)] disabled:bg-[var(--color-success-disabled)]",
    info: "bg-blue-500 text-white hover:bg-blue-700",
    ghost: "bg-transparent text-primary hover:bg-primary-light",
    custom: customColorClass || "",
  };

  const sizeClasses =
    size === "sm"
      ? "px-2 py-1 text-sm"
      : size === "lg"
      ? "px-6 py-3 text-lg"
      : "px-3 py-1.5 text-base";

  return (
    <button
      className={clsx(
        "rounded transition font-semibold flex items-center gap-2",
        sizeClasses,
        variantClasses[variant],
        {
          "opacity-50 cursor-not-allowed": disabled || loading,
        },
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        icon
      )}
      {children}
    </button>
  );
};

