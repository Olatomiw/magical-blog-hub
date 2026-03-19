
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { motion } from "framer-motion";
import { formatDate } from "@/lib/api";
import { Post } from "@/lib/types";

interface BlogPostContentProps {
  post: Post;
}

const BlogPostContent: React.FC<BlogPostContentProps> = ({ post }) => {
  const authorImageUrl = post.author?.imageUrl || `https://avatar.vercel.sh/${post.author?.id}`;

  const getInitials = (name: string) =>
    name.split(' ').map(p => p.charAt(0)).join('').toUpperCase();

  const formatContent = (content: string) => {
    if (!content) return "";
    const paragraphs = content.split('\n\n');
    return paragraphs.map((paragraph, index) => {
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
      return (
        <p key={index} className="text-md leading-relaxed font-serif tracking-wide text-justify mb-4">
          {paragraph}
        </p>
      );
    });
  };

  return (
    <Card className="mb-8 overflow-hidden border-border/50">
      {/* Post thumbnail */}
      {post.imageUrl && (
        <div className="relative aspect-[21/9] overflow-hidden bg-muted">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <CardContent className="p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-5 font-serif leading-tight">{post.title}</h1>

          {/* Author bar */}
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border/40">
            <Avatar className="h-10 w-10 ring-1 ring-border">
              <AvatarImage src={authorImageUrl} alt={post.author?.name} />
              <AvatarFallback className="bg-primary/10 text-primary text-sm">
                {getInitials(post.author?.name || 'A')}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold">{post.author?.name}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDate(post.createdAt)}
              </p>
            </div>
          </div>
          
          <div className="prose prose-slate max-w-none dark:prose-invert font-serif">
            {formatContent(post.content)}
          </div>
          
          {post.categories?.length > 0 && (
            <div className="mt-8 pt-6 border-t border-border/40 flex flex-wrap gap-2">
              {post.categories.map((category) => (
                <Badge key={category.id} variant="secondary">
                  {category.name}
                </Badge>
              ))}
            </div>
          )}
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default BlogPostContent;
