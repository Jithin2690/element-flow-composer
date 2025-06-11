
import React from 'react';

interface ImageElementProps {
  content: any;
}

const ImageElement: React.FC<ImageElementProps> = ({ content }) => {
  if (content.src) {
    return (
      <div className="relative">
        <img 
          src={content.src} 
          alt={content.alt}
          className="max-w-full h-auto rounded"
          style={{ width: content.width }}
        />
      </div>
    );
  }

  return (
    <div className="border border-dashed border-muted-foreground/30 rounded p-8 text-center">
      <p className="text-muted-foreground">No image selected</p>
    </div>
  );
};

export default ImageElement;
