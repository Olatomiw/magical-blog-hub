
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Loader2, Sparkles } from "lucide-react";

interface SummaryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  summary: string;
  isLoading: boolean;
}

const SummaryDialog = ({ isOpen, onClose, summary, isLoading }: SummaryDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            AI Summary
          </DialogTitle>
          <DialogDescription>
            AI-generated summary of the blog post
          </DialogDescription>
        </DialogHeader>
        <div className="p-4 bg-muted/30 rounded-md mt-4">
          {isLoading ? (
            <div className="flex items-center justify-center p-6">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <p className="leading-relaxed text-foreground">{summary}</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SummaryDialog;
