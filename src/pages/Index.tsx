
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllPosts } from '@/lib/api';
import Header from '@/components/Header';
import BlogCard from '@/components/BlogCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Post } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: getAllPosts,
  });
  
  const posts = data?.data || [];
  
  useEffect(() => {
    if (posts.length > 0) {
      if (searchTerm.trim() === '') {
        setFilteredPosts(posts);
      } else {
        const lowerSearchTerm = searchTerm.toLowerCase();
        const filtered = posts.filter(post => 
          post.title.toLowerCase().includes(lowerSearchTerm) ||
          post.content.toLowerCase().includes(lowerSearchTerm) ||
          post.author.name.toLowerCase().includes(lowerSearchTerm)
        );
        setFilteredPosts(filtered);
      }
    }
  }, [searchTerm, posts]);
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <motion.div 
        className="pt-32 pb-16 px-4 md:px-6 container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            Discover Insightful Articles
          </motion.h1>
          <motion.p 
            className="text-lg text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Explore our collection of thought-provoking content written by experts.
          </motion.p>
          
          <motion.div 
            className="mt-8 relative max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-3 px-4 rounded-full bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
            />
          </motion.div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col space-y-3">
                <Skeleton className="h-[240px] w-full rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
                <div className="flex items-center space-x-2 pt-4">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-[100px]" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-2xl font-semibold text-destructive mb-2">Unable to load blog posts</p>
            <p className="text-muted-foreground mb-6">
              There was an error connecting to the server. Please try again later.
            </p>
            <p className="text-sm text-muted-foreground bg-muted/40 p-4 rounded-md inline-block">
              Error details: Unable to connect to http://localhost:8080/api/post/getAllPost
            </p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl font-semibold mb-2">No posts found</p>
            <p className="text-muted-foreground">
              {searchTerm 
                ? `No posts matching "${searchTerm}". Try a different search term.` 
                : "There are no blog posts available at the moment."}
            </p>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {filteredPosts.map(post => (
              <BlogCard key={post.id} post={post} />
            ))}
          </motion.div>
        )}
        
        {/* Fallback loading state during API error */}
        {!isLoading && filteredPosts.length === 0 && !searchTerm && (
          <div className="text-center py-8">
            <Loader2 className="animate-spin h-8 w-8 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Attempting to connect to the API...
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Index;
