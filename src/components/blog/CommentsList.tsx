
import React from "react";
import { MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import CommentItem from "./CommentItem";
import { Comment } from "@/lib/types";

interface CommentsListProps {
  comments: Comment[];
}

const CommentsList: React.FC<CommentsListProps> = ({ comments }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.4 }}
    >
      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 font-serif">
        <MessageSquare className="h-5 w-5 mr-1" />
        Comments ({comments.length})
      </h2>
      {comments.length === 0 ? (
        <p className="text-muted-foreground italic">No comments yet. Be the first to comment!</p>
      ) : (
        <div>
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default CommentsList;
