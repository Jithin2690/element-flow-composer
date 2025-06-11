
import React from 'react';

interface DividerElementProps {
  content: any;
}

const DividerElement: React.FC<DividerElementProps> = ({ content }) => {
  return (
    <hr 
      style={{ 
        borderColor: content.color,
        borderWidth: content.thickness,
        borderStyle: content.style
      }}
      className="my-4"
    />
  );
};

export default DividerElement;
