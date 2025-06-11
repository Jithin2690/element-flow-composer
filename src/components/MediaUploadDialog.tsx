
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Link } from 'lucide-react';

interface MediaUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (data: { src: string; uploadType: 'url' | 'file' }) => void;
  mediaType?: 'image' | 'video';
}

const MediaUploadDialog: React.FC<MediaUploadDialogProps> = ({
  isOpen,
  onClose,
  onUpload,
  mediaType = 'image'
}) => {
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleUrlSubmit = () => {
    if (url.trim()) {
      onUpload({ src: url, uploadType: 'url' });
      setUrl('');
    }
  };

  const handleFileSubmit = () => {
    if (file) {
      // Create a temporary URL for the file
      const fileUrl = URL.createObjectURL(file);
      onUpload({ src: fileUrl, uploadType: 'file' });
      setFile(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const acceptedTypes = mediaType === 'image' ? 'image/*' : 'video/*';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add {mediaType === 'image' ? 'Image' : 'Video'}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="url" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="url" className="flex items-center gap-2">
              <Link className="h-4 w-4" />
              URL
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload
            </TabsTrigger>
          </TabsList>

          <TabsContent value="url" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">Enter {mediaType} URL</Label>
              <Input
                id="url"
                type="url"
                placeholder={`https://example.com/${mediaType}.${mediaType === 'image' ? 'jpg' : 'mp4'}`}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={handleUrlSubmit} disabled={!url.trim()}>
                Add {mediaType === 'image' ? 'Image' : 'Video'}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file">Choose {mediaType} file</Label>
              <Input
                id="file"
                type="file"
                accept={acceptedTypes}
                onChange={handleFileChange}
              />
              {file && (
                <p className="text-sm text-muted-foreground">
                  Selected: {file.name}
                </p>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={handleFileSubmit} disabled={!file}>
                Upload {mediaType === 'image' ? 'Image' : 'Video'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default MediaUploadDialog;
