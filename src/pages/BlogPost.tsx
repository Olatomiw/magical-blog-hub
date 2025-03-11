
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAllPosts, formatDate } from '@/lib/api';
import Header from '@/components/Header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Comment, Post } from '@/lib/types';
import { motion } from 'framer-motion';

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: getAllPosts,
  });
  
  useEffect(() => {
    if (data?.data) {
      const foundPost = data.data.find(p => p.id === id);
      setPost(foundPost || null);
    }
  }, [data, id]);
  
  // Get the initials for avatar fallback
  const getInitials = (name: string) => {
    return name.split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="pt-32 pb-16 px-4 md:px-6 container">
          <div className="max-w-3xl mx-auto">
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/4 mb-8" />
            <Skeleton className="h-64 w-full rounded-lg mb-8" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="pt-32 pb-16 px-4 md:px-6 container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
            <p className="text-muted-foreground mb-6">
              {error ? "There was an error loading this post." : "The post you're looking for doesn't exist."}
            </p>
            <Button onClick={() => navigate('/')} size="lg" className="mt-4">
              <ArrowLeft className="mr-2" /> Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Generate a placeholder image
  const imageUrl = `https://source.unsplash.com/random/1200x600?blog,writing,${post.title.split(' ')[0]}`;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <motion.div 
        className="pt-32 pb-16 px-4 md:px-6 container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-3xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-6 pl-0 hover:pl-1 transition-all duration-300"
          >
            <ArrowLeft className="mr-2" /> Back to all posts
          </Button>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
            
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={`https://avatar.vercel.sh/${post.author.id}`} />
                  <AvatarFallback>{getInitials(post.author.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{post.author.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(post.createdAt)}
                  </div>
                </div>
              </div>
              
              {post.categories.length > 0 && (
                <div className="ml-auto flex space-x-2">
                  {post.categories.map(category => (
                    <Badge key={category.id} variant="secondary">
                      {category.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-12"
          >
            <img 
              src={imageUrl} 
              alt={post.title}
              className="w-full h-auto rounded-lg object-cover mb-10"
            />
            
            <div className="prose prose-lg max-w-none">
              {/* Split content by paragraphs and render */}
              {post.content.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="mb-6 text-lg leading-relaxed">{paragraph}</p>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="border-t border-border pt-10">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <MessageCircle className="mr-2" />
                Comments ({post.comments.length})
              </h2>
              
              {post.comments.length === 0 ? (
                <div className="text-center py-8 bg-muted/30 rounded-lg">
                  <p className="text-muted-foreground">No comments yet</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {post.comments.map((comment) => (
                    <CommentItem key={comment.id} comment={comment} />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

const CommentItem = ({ comment }: { comment: Comment }) => {
  return (
    <div className="bg-muted/30 p-4 rounded-lg">
      <div className="flex items-start space-x-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={`https://avatar.vercel.sh/${comment.authorDTO.id}`} />
          <AvatarFallback>
            {comment.authorDTO.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex justify-between mb-1">
            <span className="font-medium">{comment.authorDTO.name}</span>
            <span className="text-xs text-muted-foreground">
              {formatDate(comment.createdAt)}
            </span>
          </div>
          <p className="text-sm">{comment.text}</p>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
