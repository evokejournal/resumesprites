"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CoverLetterModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  content: string;
}

export function CoverLetterModal({ isOpen, onOpenChange, title, content }: CoverLetterModalProps) {
  if (!content) {
    return null;
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>A message from the candidate.</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] p-1">
            <div className="p-4 whitespace-pre-line text-sm text-foreground/80">
                {content}
            </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
