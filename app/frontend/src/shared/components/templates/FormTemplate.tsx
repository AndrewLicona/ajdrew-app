import React from "react";

type FormTemplateProps = {
  title?: string;
  error?: string | null;
  loading?: boolean;
  onSubmit: (e: React.FormEvent) => void;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
};

export const FormTemplate: React.FC<FormTemplateProps> = ({
  title,
  error,
  loading,
  onSubmit,
  children,
  actions,
  className,
}) => (
  <form onSubmit={onSubmit} className={`bg-card p-6 rounded-lg shadow space-y-6 relative ${className || 'max-w-lg mx-auto'}`}>
    {title && <h2 className="text-lg font-bold mb-4">{title}</h2>}
    {error && <div className="mb-2 text-error">{error}</div>}
    <div className="space-y-4">{children}</div>
    <div className="flex flex-wrap justify-center sm:justify-end gap-2 pt-4 border-t border-white/5">{actions}</div>
    {loading && (
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-10 rounded-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
      </div>
    )}
  </form>
);