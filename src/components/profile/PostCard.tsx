import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Clock, Trash2 } from 'lucide-react';
import { formatDate, truncateText } from '@/lib/api';
import { estimateReadingTime } from '@/lib/utils';
import { Post } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

interface PostCardProps {
  post: Post;
  onDeleteClick: (postId: string) => void;
  isDeleting: string | null;
}

const PostCard = ({ post, onDeleteClick, isDeleting }: PostCardProps) => {
  const imageUrl = post.imageUrl;
  const readTime = estimateReadingTime(post.content);

  return (
    <Card className="h-full flex flex-col rounded-2xl overflow-hidden border-border/50 bg-card shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {imageUrl && (
        <div className="relative aspect-[16/9] overflow-hidden bg-muted">
          <img src={imageUrl} alt={post.title} className="w-full h-full object-cover" />
          {post.categories?.length > 0 && (
            <Badge className="absolute bottom-2 left-2 bg-foreground/80 text-background text-xs border-0 backdrop-blur-sm">
              {post.categories[0].name}
            </Badge>
          )}
        </div>
      )}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold mb-1 line-clamp-2">
          <Link to={`/blog/${post.id}`} className="hover:text-primary transition-colors">{post.title}</Link>
        </h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
          <span>{formatDate(post.createdAt)}</span>
          <span>·</span>
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{readTime} min</span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 flex-grow mb-4">
          {truncateText(post.content, 120)}
        </p>
        <div className="flex justify-between items-center pt-3 border-t border-border/50">
          <Button variant="ghost" size="sm" asChild className="text-xs text-primary hover:text-primary/80 p-0 h-auto">
            <Link to={`/blog/${post.id}`}>Read More →</Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs p-1 h-auto hover:bg-destructive/10 hover:text-destructive"
            onClick={(e) => { e.preventDefault(); onDeleteClick(post.id); }}
            disabled={isDeleting === post.id}
          >
            {isDeleting === post.id ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-destructive border-r-transparent" />
            ) : (
              <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default PostCard;
