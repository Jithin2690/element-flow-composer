
import React from 'react';

interface TableElementProps {
  content: any;
}

const TableElement: React.FC<TableElementProps> = ({ content }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-border">
        <thead>
          <tr>
            {content.headers.map((header: string, i: number) => (
              <th key={i} className="border border-border p-2 bg-muted font-medium text-left">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {content.rows.map((row: string[], i: number) => (
            <tr key={i}>
              {row.map((cell: string, j: number) => (
                <td key={j} className="border border-border p-2">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableElement;
