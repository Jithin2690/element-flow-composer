
export interface PageElement {
  id: string;
  type: 'text' | 'image' | 'video' | 'table' | 'faq' | 'checklist' | 'divider';
  content: any;
  styles?: Record<string, any>;
  width: number; // Width as percentage (1-100)
}

export interface PageSection {
  id: string;
  elements: PageElement[];
}

export interface DragItem {
  type: string;
  elementType: 'text' | 'image' | 'video' | 'table' | 'faq' | 'checklist' | 'divider';
}
