import React from 'react';

interface StructuredData {
  [key: string]: unknown;
  "@context"?: string;
  "@type"?: string | string[];
}

interface Props {
  data: StructuredData | StructuredData[];
}

export const StructuredData: React.FC<Props> = ({ data }) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
  />
);
