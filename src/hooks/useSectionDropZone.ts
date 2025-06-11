
import { useState, useCallback } from 'react';
import { useDrop } from 'react-dnd';
import { DragItem } from '@/types/builder';

interface UseSectionDropZoneProps {
  sectionId: string;
  onAddElement: (sectionId: string, element: any) => void;
}

export const useSectionDropZone = ({ sectionId, onAddElement }: UseSectionDropZoneProps) => {
  const [showMediaDialog, setShowMediaDialog] = useState(false);
  const [pendingMediaElement, setPendingMediaElement] = useState<any>(null);

  const [{ isOver }, drop] = useDrop({
    accept: 'element',
    drop: (item: DragItem) => {
      const newElement = {
        type: item.elementType,
        content: getDefaultContent(item.elementType),
        width: 100 // Make all elements full width by default
      };

      if (item.elementType === 'image' || item.elementType === 'video') {
        setPendingMediaElement(newElement);
        setShowMediaDialog(true);
      } else {
        onAddElement(sectionId, newElement);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  });

  const getDefaultContent = (type: string) => {
    switch (type) {
      case 'text':
        return { text: 'Click to edit this text', fontSize: '16px', fontWeight: 'normal' };
      case 'image':
        return { src: '', alt: 'Image', width: '100%' };
      case 'video':
        return { src: '', width: '100%' };
      case 'table':
        return { 
          headers: ['Column 1', 'Column 2'], 
          rows: [['Row 1 Col 1', 'Row 1 Col 2'], ['Row 2 Col 1', 'Row 2 Col 2']] 
        };
      case 'faq':
        return { 
          items: [
            { question: 'Question 1?', answer: 'Answer 1' },
            { question: 'Question 2?', answer: 'Answer 2' }
          ] 
        };
      case 'checklist':
        return { 
          items: [
            { text: 'Item 1', checked: false },
            { text: 'Item 2', checked: true }
          ] 
        };
      case 'divider':
        return { style: 'solid', color: '#e5e7eb', thickness: '1px' };
      default:
        return {};
    }
  };

  const handleMediaUpload = (mediaData: { src: string; uploadType: 'url' | 'file' }) => {
    if (pendingMediaElement) {
      const elementWithMedia = {
        ...pendingMediaElement,
        content: { ...pendingMediaElement.content, src: mediaData.src }
      };
      onAddElement(sectionId, elementWithMedia);
      setPendingMediaElement(null);
    }
    setShowMediaDialog(false);
  };

  return {
    drop,
    isOver,
    showMediaDialog,
    setShowMediaDialog,
    pendingMediaElement,
    handleMediaUpload
  };
};
