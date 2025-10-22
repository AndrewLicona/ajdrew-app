import React from 'react';

interface DashboardTemplateProps {
  title: string;
  children: React.ReactNode;
}

const DashboardTemplate: React.FC<DashboardTemplateProps> = ({ title, children }) => (
  <div className="h-full min-h-screen bg-[var(--color-bg)]">
    <div className="max-w-6xl mx-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
      <h1 className="text-2xl font-bold text-white mb-4">{title}</h1>
      {children}
    </div>
  </div>
);

export default DashboardTemplate;
