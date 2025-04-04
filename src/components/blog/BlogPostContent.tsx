
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
  // Function to process content and add formatting
  const formatContent = (content: string) => {
    if (!content) return "";
    
    // Split content into paragraphs
    const paragraphs = content.split('\n\n');
    
    return paragraphs.map((paragraph, index) => {
      // Check if paragraph starts with a number followed by a period (likely a list item)
      const listItemRegex = /^(\d+)\.\s(.+)$/;
      const isListItem = listItemRegex.test(paragraph);
      
      if (isListItem) {
        const match = paragraph.match(listItemRegex);
        if (match) {
          const [, number, text] = match;
          return (
            <div key={index} className="flex items-start space-x-2 mb-4">
              <span className="font-bold text-primary">{number}.</span>
              <p className="text-md leading-relaxed font-serif tracking-wide">{text}</p>
            </div>
          );
        }
      }
      
      // Handle regular paragraphs
      return (
        <p key={index} className="text-md leading-relaxed font-serif tracking-wide text-justify mb-4">
          {paragraph}
        </p>
      );
    });
  };

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-4 font-serif">{post.title}</h1>
          <div className="flex items-center space-x-2 mb-6">
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
          
          <div className="prose prose-slate max-w-none dark:prose-invert font-serif">
            {formatContent(post.content)}
          </div>
          
          <div className="mt-6">
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
