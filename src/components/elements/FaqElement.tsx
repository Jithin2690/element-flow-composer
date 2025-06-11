
import React from 'react';

interface FaqElementProps {
  content: any;
}

const FaqElement: React.FC<FaqElementProps> = ({ content }) => {
  return (
    <div className="space-y-4">
      {content.items.map((item: any, i: number) => (
        <div key={i} className="border border-border rounded-lg">
          <div className="p-4 font-medium bg-muted/50">
            {item.question}
          </div>
          <div className="p-4">
            {item.answer}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FaqElement;
