
import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Canvas from './Canvas';
import ElementSidebar from './ElementSidebar';
import { PageSection } from '@/types/builder';

const PageBuilder = () => {
  const [sections, setSections] = useState<PageSection[]>([]);

  const addSection = () => {
    const newSection: PageSection = {
      id: `section-${Date.now()}`,
      elements: []
    };
    setSections([...sections, newSection]);
  };

  const addElementToSection = (sectionId: string, element: any) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { ...section, elements: [...section.elements, { ...element, id: `element-${Date.now()}` }] }
        : section
    ));
  };

  const updateElement = (sectionId: string, elementId: string, updates: any) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { 
            ...section, 
            elements: section.elements.map(el => 
              el.id === elementId ? { ...el, ...updates } : el
            ) 
          }
        : section
    ));
  };

  const removeElement = (sectionId: string, elementId: string) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { ...section, elements: section.elements.filter(el => el.id !== elementId) }
        : section
    ));
  };

  const moveElement = (sectionId: string, dragIndex: number, hoverIndex: number) => {
    setSections(prev => prev.map(section => {
      if (section.id !== sectionId) return section;
      
      const elements = [...section.elements];
      const draggedElement = elements[dragIndex];
      
      // Remove element from old position
      elements.splice(dragIndex, 1);
      
      // Insert element at new position
      elements.splice(hoverIndex, 0, draggedElement);
      
      return { ...section, elements };
    }));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen">
        <div className="flex-1 overflow-auto">
          <Canvas 
            sections={sections}
            onAddSection={addSection}
            onAddElement={addElementToSection}
            onUpdateElement={updateElement}
            onRemoveElement={removeElement}
            onMoveElement={moveElement}
          />
        </div>
        <ElementSidebar />
      </div>
    </DndProvider>
  );
};

export default PageBuilder;
