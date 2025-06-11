
import React from 'react';

interface VideoElementProps {
  content: any;
}

const VideoElement: React.FC<VideoElementProps> = ({ content }) => {
  if (content.src) {
    return (
      <div className="relative">
        <video 
          src={content.src}
          controls
          className="max-w-full h-auto rounded"
          style={{ width: content.width }}
        />
      </div>
    );
  }

  return (
    <div className="border border-dashed border-muted-foreground/30 rounded p-8 text-center">
      <p className="text-muted-foreground">No video selected</p>
    </div>
  );
};

export default VideoElement;
