
import React from 'react';
import { PageElement } from '@/types/builder';
import TextElement from './elements/TextElement';
import ImageElement from './elements/ImageElement';
import VideoElement from './elements/VideoElement';
import TableElement from './elements/TableElement';
import FaqElement from './elements/FaqElement';
import ChecklistElement from './elements/ChecklistElement';
import DividerElement from './elements/DividerElement';

interface ElementContentProps {
  element: PageElement;
  isEditing: boolean;
  onContentChange: (content: any) => void;
  onEditingChange: (editing: boolean) => void;
}

const ElementContent: React.FC<ElementContentProps> = ({
  element,
  isEditing,
  onContentChange,
  onEditingChange
}) => {
  switch (element.type) {
    case 'text':
      return (
        <TextElement
          content={element.content}
          isEditing={isEditing}
          onContentChange={onContentChange}
          onEditingChange={onEditingChange}
        />
      );
    case 'image':
      return <ImageElement content={element.content} />;
    case 'video':
      return <VideoElement content={element.content} />;
    case 'table':
      return <TableElement content={element.content} />;
    case 'faq':
      return <FaqElement content={element.content} />;
    case 'checklist':
      return <ChecklistElement content={element.content} />;
    case 'divider':
      return <DividerElement content={element.content} />;
    default:
      return <div>Unknown element type</div>;
  }
};

export default ElementContent;
