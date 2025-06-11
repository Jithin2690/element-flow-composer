
import React from 'react';

interface ChecklistElementProps {
  content: any;
}

const ChecklistElement: React.FC<ChecklistElementProps> = ({ content }) => {
  return (
    <div className="space-y-2">
      {content.items.map((item: any, i: number) => (
        <div key={i} className="flex items-center space-x-2">
          <input 
            type="checkbox" 
            checked={item.checked} 
            readOnly
            className="rounded"
          />
          <span className={item.checked ? 'line-through text-muted-foreground' : ''}>
            {item.text}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ChecklistElement;
