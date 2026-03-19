
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Star, Clock } from 'lucide-react';
import { formatDate, truncateText } from '@/lib/api';
import type { Post } from '@/lib/types';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface BlogCardProps {
  post: Post;
}

const BlogCard = ({ post }: BlogCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();
  
  const imageUrl = post.imageUrl || `https://source.unsplash.com/random/600x400/?blog,${post.categories[0]?.name || 'journal'}`;
  const authorImageUrl = post.author.imageUrl || `https://avatar.vercel.sh/${post.author.id}`;
  
  const getInitials = (name: string) => {
    return name.split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };
  
  const handleCardClick = () => {
    navigate(`/blog/${post.id}`);
  };
  
  const categoryColorMap: Record<string, string> = {
    Technology: 'bg-blue-500/90 hover:bg-blue-600',
    Lifestyle: 'bg-purple-500/90 hover:bg-purple-600',
    Travel: 'bg-green-500/90 hover:bg-green-600',
    Food: 'bg-orange-500/90 hover:bg-orange-600',
    Fashion: 'bg-pink-500/90 hover:bg-pink-600',
    Health: 'bg-teal-500/90 hover:bg-teal-600',
    Business: 'bg-amber-500/90 hover:bg-amber-600',
    Default: 'bg-muted hover:bg-muted/80'
  };
  
  const getCategoryColor = (categoryName: string) => {
    const normalizedName = categoryName?.toLowerCase() || '';
    const matchedKey = Object.keys(categoryColorMap).find(key => 
      normalizedName.includes(key.toLowerCase())
    );
    return matchedKey ? categoryColorMap[matchedKey] : categoryColorMap.Default;
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className="h-full cursor-pointer group"
      onClick={handleCardClick}
    >
      <Card className="overflow-hidden h-full flex flex-col border border-border/50 bg-card shadow-sm hover:shadow-lg transition-all duration-300">
        {/* Thumbnail */}
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={post.title}
            className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
          />
          {!imageLoaded && (
            <div className="absolute inset-0 bg-muted animate-pulse" />
          )}
          {post.status === 'FEATURED' && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-yellow-500 text-white shadow-md">
                <Star className="w-3 h-3 mr-1" /> Featured
              </Badge>
            </div>
          )}
          {post.categories.length > 0 && (
            <div className="absolute bottom-3 left-3">
              <Badge className={`text-white text-xs shadow-sm ${getCategoryColor(post.categories[0].name)}`}>
                {post.categories[0].name}
              </Badge>
            </div>
          )}
        </div>
        
        <CardHeader className="pb-2 pt-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <Clock className="h-3 w-3" />
            <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
            <span>·</span>
            <span>{post.comments.length} comment{post.comments.length !== 1 ? 's' : ''}</span>
          </div>
          <CardTitle className="text-lg leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </CardTitle>
          <CardDescription className="line-clamp-2 text-sm mt-1">
            {truncateText(post.content, 100)}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex-grow pb-2">
          {post.comments.length > 0 && (
            <div className="bg-muted/50 p-2.5 rounded-md border border-border/30">
              <div className="flex items-start gap-2">
                <MessageSquare className="h-3.5 w-3.5 mt-0.5 text-muted-foreground shrink-0" />
                <p className="text-xs text-muted-foreground line-clamp-2">
                  <span className="font-medium text-foreground">{post.comments[0].authorDTO.name}:</span>{' '}
                  {truncateText(post.comments[0].text, 60)}
                </p>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="pt-0 pb-4 border-t border-border/30">
          <div className="flex items-center gap-2.5 w-full pt-3">
            <Avatar className="h-7 w-7 ring-1 ring-border">
              <AvatarImage src={authorImageUrl} alt={post.author.name} />
              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                {getInitials(post.author.name)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-foreground">{post.author.name}</span>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default BlogCard;
