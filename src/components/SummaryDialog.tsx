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
  const formatSummary = (text: string) => {
    if (!text) return null;
    return text.split('\n\n').filter(p => p.trim()).map((paragraph, index) => {
      const listMatch = paragraph.trim().match(/^(\d+)\.\s(.+)$/);
      if (listMatch) {
        return (
          <div key={index} className="flex items-start gap-2 mb-3">
            <span className="font-bold text-primary">{listMatch[1]}.</span>
            <p className="text-sm leading-relaxed font-serif text-justify">{listMatch[2]}</p>
          </div>
        );
      }
      if (paragraph.trim().startsWith('•') || paragraph.trim().startsWith('-')) {
        return (
          <div key={index} className="flex items-start gap-2 mb-3">
            <span className="text-primary">•</span>
            <p className="text-sm leading-relaxed font-serif text-justify">{paragraph.trim().substring(1).trim()}</p>
          </div>
        );
      }
      return <p key={index} className="text-sm leading-relaxed font-serif text-justify mb-3">{paragraph.trim()}</p>;
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-5 w-5 text-primary" /> AI Summary
          </DialogTitle>
          <DialogDescription className="text-sm">AI-generated summary of the article</DialogDescription>
        </DialogHeader>
        <div className="bg-secondary/50 rounded-xl mt-4">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <ScrollArea className="h-auto max-h-[50vh] p-6">
              <div className="pr-4">{formatSummary(summary)}</div>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SummaryDialog;
