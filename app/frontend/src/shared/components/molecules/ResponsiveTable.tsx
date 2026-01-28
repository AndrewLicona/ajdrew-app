import React, { ReactNode } from 'react';

interface ResponsiveTableProps {
    headers: string[];
    children: ReactNode;
    className?: string;
}

/**
 * Responsive Table Component
 * 
 * Desktop: Normal table
 * Mobile: Horizontal scroll with sticky first column
 */
export const ResponsiveTable: React.FC<ResponsiveTableProps> = ({ headers, children, className = '' }) => {
    return (
        <div className="w-full overflow-x-auto -mx-4 md:mx-0">
            <div className="inline-block min-w-full align-middle px-4 md:px-0">
                <table className={`min-w-full divide-y divide-[var(--color-primary)]/10 ${className}`}>
                    <thead className="bg-[var(--color-card)]">
                        <tr>
                            {headers.map((header, index) => (
                                <th
                                    key={index}
                                    scope="col"
                                    className={`
                                        px-3 md:px-6 py-3 md:py-4 
                                        text-left text-xs md:text-sm font-bold text-[var(--color-primary)] 
                                        uppercase tracking-wider
                                        ${index === 0 ? 'sticky left-0 z-10 bg-[var(--color-card)] md:static' : ''}
                                    `}
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-[var(--color-bg)] divide-y divide-[var(--color-primary)]/5">
                        {children}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

interface ResponsiveTableRowProps {
    children: ReactNode;
    onClick?: () => void;
    className?: string;
}

export const ResponsiveTableRow: React.FC<ResponsiveTableRowProps> = ({ children, onClick, className = '' }) => {
    return (
        <tr
            onClick={onClick}
            className={`
                hover:bg-[var(--color-card)]/50 transition-colors
                ${onClick ? 'cursor-pointer' : ''}
                ${className}
            `}
        >
            {children}
        </tr>
    );
};

interface ResponsiveTableCellProps {
    children?: ReactNode;
    isFirstColumn?: boolean;
    className?: string;
    colSpan?: number;
    rowSpan?: number;
}

export const ResponsiveTableCell: React.FC<ResponsiveTableCellProps> = ({
    children,
    isFirstColumn,
    className = '',
    colSpan,
    rowSpan
}) => {
    return (
        <td
            colSpan={colSpan}
            rowSpan={rowSpan}
            className={`
                px-3 md:px-6 py-3 md:py-4 
                whitespace-nowrap text-xs md:text-sm text-[var(--color-text)]
                ${isFirstColumn ? 'sticky left-0 z-10 bg-[var(--color-bg)] md:static font-medium' : ''}
                ${className}
            `}
        >
            {children}
        </td>
    );
};
