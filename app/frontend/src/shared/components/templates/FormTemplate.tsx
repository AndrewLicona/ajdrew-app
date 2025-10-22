import React from "react";

type FormTemplateProps = {
  title?: string;
  error?: string | null;
  loading?: boolean;
  onSubmit: (e: React.FormEvent) => void;
  children: React.ReactNode;
  actions?: React.ReactNode;
};

export const FormTemplate: React.FC<FormTemplateProps> = ({
  title,
  error,
  loading,
  onSubmit,
  children,
  actions,
}) => (
  <form onSubmit={onSubmit} className="bg-card p-6 rounded-lg shadow max-w-lg mx-auto space-y-6 relative">
    {title && <h2 className="text-lg font-bold mb-4">{title}</h2>}
    {error && <div className="mb-2 text-error">{error}</div>}
    <div className="space-y-4">{children}</div>
    <div className="flex justify-end gap-2">{actions}</div>
    {loading && (
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-10 rounded-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
      </div>
    )}
  </form>
);