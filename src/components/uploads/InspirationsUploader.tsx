
import React, { useState } from 'react';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { UploadCloud, X, FileIcon } from 'lucide-react';

export function InspirationsUploader() {
  const { updateFiles, files } = useDesignBrief();
  const inspirationFiles = files.inspirations || [];
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList && fileList.length > 0) {
      const newFiles = Array.from(fileList);
      updateFiles('inspirations', [...inspirationFiles, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = [...inspirationFiles];
    updatedFiles.splice(index, 1);
    updateFiles('inspirations', updatedFiles);
  };

  return (
    <div className="border p-4 rounded-md">
      <Label htmlFor="inspirations" className="text-lg font-medium mb-2 block">
        Design Inspirations
      </Label>
      <p className="text-sm mb-4 text-gray-600">
        Upload photos, magazine clippings, or other buildings that you like.
      </p>
      
      <div className="flex flex-wrap gap-4 mb-4">
        {inspirationFiles.map((file, index) => (
          <div key={index} className="relative flex items-center border rounded p-2 bg-gray-50">
            <FileIcon className="h-4 w-4 mr-2" />
            <span className="text-sm truncate max-w-[200px]">{file.name}</span>
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 p-0 ml-2"
              onClick={() => removeFile(index)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Remove</span>
            </Button>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="inspirations"
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <UploadCloud className="w-8 h-8 mb-3 text-gray-400" />
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Images, PDFs, documents (MAX 10MB)
            </p>
          </div>
          <input
            id="inspirations"
            type="file"
            className="hidden"
            onChange={handleFileChange}
            multiple
            accept="image/*,.pdf,.doc,.docx"
          />
        </label>
      </div>
    </div>
  );
}
