
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { MessageCircle, Clock, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDate, truncateText } from '@/lib/api';
import { Post } from '@/lib/types';

interface PostCardProps {
  post: Post;
  onDeleteClick: (postId: string) => void;
  isDeleting: string | null;
}

const PostCard = ({ post, onDeleteClick, isDeleting }: PostCardProps) => {
  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow duration-200 relative">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl mb-1 line-clamp-2">
          <Link to={`/blog/${post.id}`} className="hover:text-primary transition-colors">
            {post.title}
          </Link>
        </CardTitle>
        <CardDescription className="flex items-center text-xs">
          <Clock className="h-3 w-3 mr-1" /> 
          {formatDate(post.createdAt)}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-4 flex-grow">
        <p className="text-sm text-muted-foreground">
          {truncateText(post.content, 120)}
        </p>
      </CardContent>
      
      <CardFooter className="pt-0 flex justify-between items-center">
        <span className="flex items-center text-xs text-muted-foreground">
          <MessageCircle className="h-3 w-3 mr-1" />
          {post.comments.length} comment{post.comments.length !== 1 ? 's' : ''}
        </span>
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            asChild
            className="text-xs"
          >
            <Link to={`/blog/${post.id}`}>
              Read More
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs p-1 h-auto hover:bg-destructive/10 hover:text-destructive"
            onClick={(e) => {
              e.preventDefault();
              onDeleteClick(post.id);
            }}
            disabled={isDeleting === post.id}
          >
            {isDeleting === post.id ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-destructive border-r-transparent" />
            ) : (
              <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
