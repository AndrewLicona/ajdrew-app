import React from "react";
import clsx from "clsx";

type CardTemplateProps = {
  image?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  titleClassName?: string;
  inactive?: boolean;
};

export const CardTemplate: React.FC<CardTemplateProps> = ({
  image,
  title,
  subtitle,
  actions,
  children,
  className,
  titleClassName = '',
  inactive = false,
}) => (
  <div
    className={clsx(
      "bg-[var(--color-card)] p-4 rounded-lg shadow hover:shadow-md transition-shadow duration-300 border border-[var(--color-primary)]/20 hover:border-[var(--color-primary)]/40",
      inactive && "opacity-75",
      className
    )}
  >
    <div className="flex items-start">
      {image && <div className="w-16 h-16 flex-shrink-0 mr-4">{image}</div>}
      <div className="flex-1 flex flex-col min-h-[5rem]">
        <div>
          <h3 className={clsx("font-bold text-lg text-text mb-1", titleClassName)}>{title}</h3>
          {subtitle && <div className="text-sm text-text-secondary">{subtitle}</div>}
        </div>
        <div className="flex-1">{children}</div>
        {actions && (
          <div className="flex justify-end mt-4">
            <div className="flex items-center gap-2">{actions}</div>
          </div>
        )}
      </div>
    </div>
  </div>
);