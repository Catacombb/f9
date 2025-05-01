
import React from 'react';
import { 
  Dialog, 
  DialogContent,
} from "@/components/ui/dialog";

interface TesterNotePopupProps {
  isOpen?: boolean;
  onClose?: () => void;
}

// This component is disabled and won't show
export function TesterNotePopup({ isOpen = false, onClose }: TesterNotePopupProps) {
  return (
    <Dialog open={false}>
      <DialogContent className="max-w-md">
        {/* No content as this popup is disabled */}
      </DialogContent>
    </Dialog>
  );
}
