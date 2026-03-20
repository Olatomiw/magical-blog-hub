import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PenLine } from 'lucide-react';
import { Post } from '@/lib/types';
import PostCard from './PostCard';

interface PostsListProps {
  posts: Post[];
  onDeleteClick: (postId: string) => void;
  isDeleting: string | null;
}

const PostsList = ({ posts, onDeleteClick, isDeleting }: PostsListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(posts.length / itemsPerPage);
  const currentPosts = posts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Your Posts</h2>
        <Button size="sm" asChild className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 px-4">
          <Link to="/create-post">
            <PenLine className="h-3.5 w-3.5" /> New Post
          </Link>
        </Button>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-2xl border border-border/50">
          <h3 className="text-lg font-semibold mb-1">No posts yet</h3>
          <p className="text-sm text-muted-foreground">Start writing your first article.</p>
        </div>
      ) : (
        <>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {currentPosts.map((post) => (
              <motion.div key={post.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <PostCard post={post} onDeleteClick={onDeleteClick} isDeleting={isDeleting} />
              </motion.div>
            ))}
          </motion.div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <Button key={n} variant={currentPage === n ? "default" : "outline"} size="sm" onClick={() => setCurrentPage(n)} className="w-8 h-8 p-0 rounded-full">
                  {n}
                </Button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PostsList;
