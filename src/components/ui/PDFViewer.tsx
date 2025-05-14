import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon, ChevronRightIcon, DownloadIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';

// Set up PDF.js worker - use a public CDN with CORS enabled
pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.8.69/pdf.worker.min.js';

interface PDFViewerProps {
  url: string;
  fileName?: string;
  className?: string;
  downloadable?: boolean;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ 
  url, 
  fileName = 'proposal.pdf',
  className,
  downloadable = true
}) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
    setLoading(false);
  };

  const onDocumentLoadError = () => {
    setError(true);
    setLoading(false);
  };

  const changePage = (offset: number) => {
    if (numPages === null) return;
    
    const newPage = pageNumber + offset;
    if (newPage >= 1 && newPage <= numPages) {
      setPageNumber(newPage);
    }
  };

  const previousPage = () => changePage(-1);
  const nextPage = () => changePage(1);

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="min-h-[500px] w-full bg-gray-100 rounded-md border overflow-hidden flex items-center justify-center">
        {loading && (
          <div className="text-center p-8">
            <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading document...</p>
          </div>
        )}

        {error && (
          <div className="text-center p-8 text-red-500">
            <p>Error loading PDF. Please try again later.</p>
          </div>
        )}

        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading=""
          error=""
          className="max-w-full"
        >
          <Page 
            pageNumber={pageNumber} 
            renderTextLayer={false} 
            renderAnnotationLayer={false}
            className="max-w-full"
            loading=""
            width={Math.min(800, window.innerWidth - 64)}
          />
        </Document>
      </div>

      {numPages !== null && (
        <div className="flex items-center justify-between mt-4">
          <div className="space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={previousPage} 
              disabled={pageNumber <= 1}
            >
              <ChevronLeftIcon className="h-4 w-4 mr-1" /> Previous
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={nextPage} 
              disabled={pageNumber >= numPages}
            >
              Next <ChevronRightIcon className="h-4 w-4 ml-1" />
            </Button>
          </div>
          
          <div className="text-sm">
            Page {pageNumber} of {numPages}
          </div>
          
          {downloadable && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => window.open(url, '_blank')}
            >
              <DownloadIcon className="h-4 w-4 mr-1" /> Download
            </Button>
          )}
        </div>
      )}
    </div>
  );
}; 