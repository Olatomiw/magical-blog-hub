import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Post } from '@/lib/types';
import PostCard from './PostCard';

interface PostsListProps {
  posts: Post[];
  onDeleteClick: (postId: string) => void;
  isDeleting: string | null;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const PostsList = ({ posts, onDeleteClick, isDeleting }: PostsListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  // Calculate pagination
  const totalPages = Math.ceil(posts.length / itemsPerPage);
  const indexOfLastPost = currentPage * itemsPerPage;
  const indexOfFirstPost = indexOfLastPost - itemsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Posts</h2>
        <div className="flex items-center gap-2">
          <Button 
            size="sm"
            variant="outline"
            asChild
            className="flex items-center gap-1 shadow-sm hover:shadow-md"
          >
            <Link to="/create-post">
              <Plus className="h-4 w-4" />
              Create Post
            </Link>
          </Button>
          <span className="text-sm text-muted-foreground">
            {posts.length} post{posts.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
      
      {posts.length === 0 ? (
        <div className="text-center py-12 bg-muted/40 rounded-lg">
          <h3 className="text-xl font-medium mb-2">No posts yet</h3>
          <p className="text-muted-foreground mb-6">
            You haven't created any posts yet.
          </p>
        </div>
      ) : (
        <>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {currentPosts.map((post) => (
              <motion.div key={post.id} variants={item}>
                <PostCard 
                  post={post} 
                  onDeleteClick={onDeleteClick} 
                  isDeleting={isDeleting} 
                />
              </motion.div>
            ))}
          </motion.div>
          
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="flex space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => paginate(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3"
                >
                  Previous
                </Button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                  <Button
                    key={number}
                    variant={currentPage === number ? "default" : "outline"}
                    size="sm"
                    onClick={() => paginate(number)}
                    className="w-8 h-8 p-0"
                  >
                    {number}
                  </Button>
                ))}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3"
                >
                  Next
                </Button>
              </nav>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default PostsList;

