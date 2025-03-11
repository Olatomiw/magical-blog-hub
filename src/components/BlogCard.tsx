
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageSquare } from 'lucide-react';
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
  
  // Generate a placeholder image if no image is provided
  const imageUrl = `https://www.google.com/url?sa=i&url=https%3A%2F%2Fstock.adobe.com%2Fsearch%3Fk%3Dtechnology&psig=AOvVaw2nMnWYvP98DWe_PYk1R1El&ust=1741776607877000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCLCowdPtgYwDFQAAAAAdAAAAABAE,${post.title.split(' ')[0]}`;
  
  // Get the initials for avatar fallback
  const getInitials = (name: string) => {
    return name.split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };
  
  const handleCardClick = () => {
    navigate(`/blog/${post.id}`);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="h-full cursor-pointer"
      onClick={handleCardClick}
    >
      <Card className="overflow-hidden h-full flex flex-col shadow-elegant hover:shadow-elegant-hover transition-shadow duration-500 border-0">
        <div className="relative pb-[60%] overflow-hidden">
          <img
            src={imageUrl}
            alt={post.title}
            className={`absolute inset-0 w-full h-full object-cover transition-all ${
              imageLoaded ? 'image-loaded' : 'image-loading'
            }`}
            onLoad={() => setImageLoaded(true)}
          />
        </div>
        
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex space-x-2 text-xs text-muted-foreground">
              <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
              <span>•</span>
              <span>{post.comments.length} comments</span>
            </div>
            
            {post.categories.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {post.categories[0].name}
              </Badge>
            )}
          </div>
          
          <CardTitle className="text-xl mt-2 line-clamp-2">{post.title}</CardTitle>
          <CardDescription className="line-clamp-3">
            {truncateText(post.content, 120)}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex-grow">
          {post.comments.length > 0 && (
            <div className="bg-secondary/40 p-3 rounded-md mt-2">
              <div className="flex items-start space-x-2">
                <MessageSquare className="h-4 w-4 mt-1 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">
                      {post.comments[0].authorDTO.name}:
                    </span>{' '}
                    {truncateText(post.comments[0].text, 60)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="pt-0 border-t border-muted/20">
          <div className="flex items-center space-x-3 w-full mt-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={`https://avatar.vercel.sh/${post.author.id}`} />
              <AvatarFallback>{getInitials(post.author.name)}</AvatarFallback>
            </Avatar>
            <div className="text-sm font-medium leading-none">{post.author.name}</div>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default BlogCard;
