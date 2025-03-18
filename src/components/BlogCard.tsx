
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Star } from 'lucide-react';
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
  
  // Get random image url based on post title
  const imageIndex = post.title.length % 5 + 1;
  const imageUrl = `https://source.unsplash.com/random/600x400/?blog,${post.categories[0]?.name || 'journal'},article=${imageIndex}`;
  
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
  
  const categoryColorMap: Record<string, string> = {
    Technology: 'bg-blue-500 hover:bg-blue-600',
    Lifestyle: 'bg-purple-500 hover:bg-purple-600',
    Travel: 'bg-green-500 hover:bg-green-600',
    Food: 'bg-orange-500 hover:bg-orange-600',
    Fashion: 'bg-pink-500 hover:bg-pink-600',
    Health: 'bg-teal-500 hover:bg-teal-600',
    Business: 'bg-amber-500 hover:bg-amber-600',
    Default: 'bg-gray-500 hover:bg-gray-600'
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
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="h-full cursor-pointer"
      onClick={handleCardClick}
    >
      <Card className="overflow-hidden h-full flex flex-col shadow-elegant hover:shadow-elegant-hover transition-shadow duration-500 border border-gray-200/50 dark:border-gray-700/50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
        <div className="relative pb-[60%] overflow-hidden">
          <img
            src={imageUrl}
            alt={post.title}
            className={`absolute inset-0 w-full h-full object-cover transition-all ${
              imageLoaded ? 'image-loaded' : 'image-loading'
            }`}
            onLoad={() => setImageLoaded(true)}
          />
          {post.status === 'FEATURED' && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-yellow-500 text-white">
                <Star className="w-3 h-3 mr-1" /> Featured
              </Badge>
            </div>
          )}
        </div>
        
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex space-x-2 text-xs text-muted-foreground">
              <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
              <span>•</span>
              <span>{post.comments.length} comments</span>
            </div>
            
            {post.categories.length > 0 && (
              <Badge 
                className={`text-white ${getCategoryColor(post.categories[0].name)}`}
              >
                {post.categories[0].name}
              </Badge>
            )}
          </div>
          
          <CardTitle className="text-xl mt-2 line-clamp-2 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400">
            {post.title}
          </CardTitle>
          <CardDescription className="line-clamp-3">
            {truncateText(post.content, 120)}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex-grow">
          {post.comments.length > 0 && (
            <div className="bg-secondary/40 p-3 rounded-md mt-2 border border-gray-200/30 dark:border-gray-700/30">
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
            <Avatar className="h-8 w-8 ring-2 ring-offset-2 ring-white/50">
              <AvatarImage src={`https://avatar.vercel.sh/${post.author.id}`} />
              <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                {getInitials(post.author.name)}
              </AvatarFallback>
            </Avatar>
            <div className="text-sm font-medium leading-none">{post.author.name}</div>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default BlogCard;
