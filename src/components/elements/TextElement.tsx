
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface TextElementProps {
  content: any;
  isEditing: boolean;
  onContentChange: (content: any) => void;
  onEditingChange: (editing: boolean) => void;
}

const TextElement: React.FC<TextElementProps> = ({
  content,
  isEditing,
  onContentChange,
  onEditingChange
}) => {
  if (isEditing) {
    return (
      <div className="space-y-2">
        <Textarea
          value={content.text}
          onChange={(e) => onContentChange({ ...content, text: e.target.value })}
          placeholder="Enter your text..."
          className="min-h-[100px]"
        />
        <div className="flex gap-2">
          <Button size="sm" onClick={() => onEditingChange(false)}>Save</Button>
          <Button size="sm" variant="outline" onClick={() => onEditingChange(false)}>Cancel</Button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="p-4 border border-dashed border-muted-foreground/30 rounded cursor-pointer hover:bg-accent/50"
      onClick={() => onEditingChange(true)}
    >
      <p style={{ fontSize: content.fontSize, fontWeight: content.fontWeight }}>
        {content.text}
      </p>
    </div>
  );
};

export default TextElement;
