
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { motion } from "framer-motion";
import { formatDate } from "@/lib/api";
import { Post } from "@/lib/types";

interface BlogPostContentProps {
  post: Post;
}

const BlogPostContent: React.FC<BlogPostContentProps> = ({ post }) => {
  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-4 font-serif">{post.title}</h1>
          <div className="flex items-center space-x-2 mb-4">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{post.author?.name?.charAt(0) || 'A'}</AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <span className="font-medium">{post.author?.name}</span>
              <p className="text-xs text-muted-foreground">
                <Clock className="inline-block h-3 w-3 mr-1" />
                {formatDate(post.createdAt)}
              </p>
            </div>
          </div>
          <p className="text-md leading-relaxed font-serif tracking-wide">{post.content}</p>
          <div className="mt-4">
            {post.categories?.map((category) => (
              <Badge key={category.id} variant="secondary" className="mr-2">
                {category.name}
              </Badge>
            ))}
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default BlogPostContent;
