
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { formatDate } from "@/lib/api";
import { Comment } from "@/lib/types";

interface CommentItemProps {
  comment: Comment;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment }) => {
  return (
    <Card className="mb-4 hover:shadow-md transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src={comment.authorDTO?.image || ''} alt={comment.authorDTO?.name || 'User'} />
            <AvatarFallback>{comment.authorDTO?.name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <div className="text-sm font-medium">{comment.authorDTO?.name}</div>
            <div className="text-xs text-muted-foreground">
              {formatDate(comment.createdAt)}
            </div>
            <p className="text-sm mt-1 font-serif">{comment.text}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommentItem;
