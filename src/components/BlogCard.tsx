import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { formatDate, truncateText } from '@/lib/api';
import { estimateReadingTime } from '@/lib/utils';
import type { Post } from '@/lib/types';
import { useNavigate } from 'react-router-dom';

interface BlogCardProps {
  post: Post;
  featured?: boolean;
}

const BlogCard = ({ post, featured = false }: BlogCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();

  const imageUrl = post.imageUrl || `https://source.unsplash.com/random/600x400/?blog,${post.categories[0]?.name || 'journal'}`;
  const authorImageUrl = post.author.imageUrl || `https://avatar.vercel.sh/${post.author.id}`;
  const readTime = estimateReadingTime(post.content);

  const getInitials = (name: string) =>
    name.split(' ').map(p => p.charAt(0)).join('').toUpperCase();

  if (featured) {
    return (
      <div
        onClick={() => navigate(`/blog/${post.id}`)}
        className="group cursor-pointer grid grid-cols-1 md:grid-cols-2 gap-0 bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-border/50"
      >
        <div className="p-8 md:p-10 flex flex-col justify-center order-2 md:order-1">
          {post.categories.length > 0 && (
            <Badge className="w-fit mb-4 bg-primary/10 text-primary hover:bg-primary/20 border-0 font-medium text-xs">
              {post.categories[0].name}
            </Badge>
          )}
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 leading-tight group-hover:text-primary transition-colors">
            {post.title}
          </h2>
          <p className="text-muted-foreground text-body line-clamp-2 mb-6">
            {truncateText(post.content, 160)}
          </p>
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={authorImageUrl} alt={post.author.name} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs">{getInitials(post.author.name)}</AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{post.author.name}</span>
              <span>·</span>
              <span>{formatDate(post.createdAt)}</span>
              <span>·</span>
              <span>{readTime} min read</span>
            </div>
          </div>
        </div>
        <div className="relative aspect-[16/10] md:aspect-auto overflow-hidden order-1 md:order-2">
          <img
            src={imageUrl}
            alt={post.title}
            className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
          />
          {!imageLoaded && <div className="absolute inset-0 bg-muted animate-pulse" />}
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => navigate(`/blog/${post.id}`)}
      className="group cursor-pointer bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-border/50 h-full flex flex-col"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <img
          src={imageUrl}
          alt={post.title}
          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
        />
        {!imageLoaded && <div className="absolute inset-0 bg-muted animate-pulse" />}
        {post.categories.length > 0 && (
          <div className="absolute bottom-3 left-3">
            <Badge className="bg-foreground/80 text-background backdrop-blur-sm text-xs border-0">
              {post.categories[0].name}
            </Badge>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-foreground mb-2 leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {post.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-grow">
          {truncateText(post.content, 100)}
        </p>
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={authorImageUrl} alt={post.author.name} />
              <AvatarFallback className="bg-primary/10 text-primary text-[10px]">{getInitials(post.author.name)}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-foreground">{post.author.name}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{readTime} min read</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
