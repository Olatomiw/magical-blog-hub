
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { createComment } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";

interface CommentFormProps {
  postId: string;
}

const CommentForm: React.FC<CommentFormProps> = ({ postId }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCommentSubmit = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to post a comment.",
        variant: "destructive",
      });
      return;
    }

    if (!commentText.trim()) {
      toast({
        title: "Empty Comment",
        description: "Please enter some text for your comment.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await createComment(postId, commentText);
      setCommentText("");
      toast({
        title: "Comment Posted",
        description: "Your comment has been posted successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error Posting Comment",
        description: error.message || "Failed to post comment.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="mt-6"
    >
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-4">Add a Comment</h3>
          {isAuthenticated ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.profilePicture || user?.image || ''} alt={user?.username || 'User'} />
                  <AvatarFallback>{user?.firstName?.charAt(0) || user?.username?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <span className="text-sm">
                  Commenting as <span className="font-medium">{user?.firstName} {user?.lastName}</span>
                </span>
              </div>
              <Textarea
                placeholder="Write your comment here..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="ring-focus"
              />
              <Button
                onClick={handleCommentSubmit}
                disabled={isSubmitting}
                className="glass-button"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Post Comment"
                )}
              </Button>
            </div>
          ) : (
            <p className="text-muted-foreground">
              You must be <Button variant="link" onClick={() => navigate('/login')}>logged in</Button> to post a comment.
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CommentForm;
