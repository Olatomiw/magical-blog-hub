
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Sparkles } from "lucide-react";

interface SummaryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  summary: string;
  isLoading: boolean;
}

const SummaryDialog = ({ isOpen, onClose, summary, isLoading }: SummaryDialogProps) => {
  // Function to format summary text with proper paragraph breaks
  const formatSummary = (text: string) => {
    if (!text) return "";
    
    // Split by double line breaks to create paragraphs
    const paragraphs = text.split('\n\n').filter(p => p.trim());
    
    return paragraphs.map((paragraph, index) => {
      // Check if paragraph starts with a number followed by a period (likely a list item)
      const listItemRegex = /^(\d+)\.\s(.+)$/;
      const isListItem = listItemRegex.test(paragraph.trim());
      
      if (isListItem) {
        const match = paragraph.trim().match(listItemRegex);
        if (match) {
          const [, number, text] = match;
          return (
            <div key={index} className="flex items-start space-x-2 mb-3">
              <span className="font-bold text-primary">{number}.</span>
              <p className="text-sm leading-relaxed font-serif tracking-wide text-justify">{text}</p>
            </div>
          );
        }
      }
      
      // Handle bullet points
      if (paragraph.trim().startsWith('•') || paragraph.trim().startsWith('-')) {
        const text = paragraph.trim().substring(1).trim();
        return (
          <div key={index} className="flex items-start space-x-2 mb-3">
            <span className="text-primary">•</span>
            <p className="text-sm leading-relaxed font-serif tracking-wide text-justify">{text}</p>
          </div>
        );
      }
      
      // Handle regular paragraphs
      return (
        <p key={index} className="text-sm leading-relaxed font-serif tracking-wide text-justify mb-3">
          {paragraph.trim()}
        </p>
      );
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            AI Summary
          </DialogTitle>
          <DialogDescription className="text-sm italic">
            AI-generated summary of the blog post
          </DialogDescription>
        </DialogHeader>
        <div className="bg-muted/40 rounded-md mt-4 shadow-inner">
          {isLoading ? (
            <div className="flex items-center justify-center p-6">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <ScrollArea className="h-auto max-h-[50vh] p-6">
              <div className="pr-4">
                {formatSummary(summary)}
              </div>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SummaryDialog;
