
export interface PageElement {
  id: string;
  type: 'text' | 'image' | 'video' | 'table' | 'faq' | 'checklist' | 'divider';
  content: any;
  styles?: Record<string, any>;
}

export interface PageSection {
  id: string;
  elements: PageElement[];
}

export interface DragItem {
  type: string;
  elementType: 'text' | 'image' | 'video' | 'table' | 'faq' | 'checklist' | 'divider';
}
