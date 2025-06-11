
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ExternalLink, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PublishDialogProps {
  isOpen: boolean;
  onClose: () => void;
  pageData: any;
}

const PublishDialog: React.FC<PublishDialogProps> = ({ isOpen, onClose, pageData }) => {
  const [isPublished, setIsPublished] = useState(false);
  const [siteName, setSiteName] = useState('my-awesome-site');
  const [isPublishing, setIsPublishing] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const publishedUrl = `https://${siteName}.lovable.app`;

  const handlePublish = async () => {
    setIsPublishing(true);
    // Simulate publishing process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsPublished(true);
    setIsPublishing(false);
    toast({
      title: "Published successfully!",
      description: "Your page is now live and accessible to everyone.",
    });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(publishedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied!",
        description: "URL copied to clipboard",
      });
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const openPreview = () => {
    window.open(publishedUrl, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Publish Your Page</DialogTitle>
        </DialogHeader>
        
        {!isPublished ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                placeholder="my-awesome-site"
              />
              <p className="text-sm text-muted-foreground">
                Your site will be available at: {publishedUrl}
              </p>
            </div>
            
            <Button 
              onClick={handlePublish} 
              disabled={isPublishing}
              className="w-full"
            >
              {isPublishing ? 'Publishing...' : 'Publish'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-green-600 mb-2">
                <Check className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium">Successfully Published!</h3>
              <p className="text-sm text-muted-foreground">
                Your page is now live at:
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Input
                value={publishedUrl}
                readOnly
                className="flex-1"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={copyToClipboard}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            
            <div className="flex space-x-2">
              <Button onClick={openPreview} className="flex-1">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Live Site
              </Button>
              <Button variant="outline" onClick={onClose} className="flex-1">
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PublishDialog;
