
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { summarizePost } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import SummaryDialog from "@/components/SummaryDialog";

interface SummarizeButtonProps {
  postId: string;
}

const SummarizeButton: React.FC<SummarizeButtonProps> = ({ postId }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [summary, setSummary] = useState("");

  const handleSummarize = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to use AI summarization.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    setIsSummarizing(true);
    setShowSummary(true);
    setSummary("");

    try {
      const result = await summarizePost(postId);
      setSummary(result.summary);
    } catch (error: any) {
      toast({
        title: "Error Summarizing Post",
        description: error.message || "Failed to summarize post.",
        variant: "destructive",
      });
      setShowSummary(false);
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <>
      <Button 
        onClick={handleSummarize}
        variant="outline"
        size="sm"
        className="gap-2 border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-all"
      >
        <Sparkles className="h-4 w-4 text-yellow-500" />
        Summarize
      </Button>

      <SummaryDialog 
        isOpen={showSummary}
        onClose={() => setShowSummary(false)}
        summary={summary}
        isLoading={isSummarizing}
      />
    </>
  );
};

export default SummarizeButton;
