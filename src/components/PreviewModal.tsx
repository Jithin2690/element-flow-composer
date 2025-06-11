
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import ElementRenderer from './ElementRenderer';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  pageData: any[];
}

const PreviewModal: React.FC<PreviewModalProps> = ({ isOpen, onClose, pageData }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="flex items-center justify-between">
            Page Preview
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="overflow-auto max-h-[calc(90vh-120px)] p-6">
          <div className="bg-white min-h-96 rounded-lg shadow-sm border">
            {pageData.length === 0 ? (
              <div className="flex items-center justify-center h-96 text-muted-foreground">
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-2">No content yet</h3>
                  <p>Add some elements to see the preview</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6 p-6">
                {pageData.map((section) => (
                  <div key={section.id} className="space-y-4">
                    {section.elements.map((element: any) => (
                      <div key={element.id} className="w-full">
                        <ElementRenderer element={element} isPreview={true} />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewModal;
