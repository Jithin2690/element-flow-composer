
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
          />
        </div>
        <ElementSidebar />
      </div>
    </DndProvider>
  );
};

export default PageBuilder;
