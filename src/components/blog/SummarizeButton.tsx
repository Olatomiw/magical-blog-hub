
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
      <div className="mt-8 flex justify-center">
        <Button 
          onClick={handleSummarize}
          className="glass-button bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all font-medium"
          size="lg"
        >
          <Sparkles className="mr-2 h-5 w-5 text-yellow-200" />
          Summarize with AI
        </Button>
      </div>

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
