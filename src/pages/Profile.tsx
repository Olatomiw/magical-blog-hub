
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { deletePost } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import UserProfileHeader from '@/components/profile/UserProfileHeader';
import PostsList from '@/components/profile/PostsList';
import DeleteConfirmationDialog from '@/components/profile/DeleteConfirmationDialog';
import { Post } from '@/lib/types';

const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Update local posts state when user data changes
  useEffect(() => {
    if (user?.postResponseList) {
      setUserPosts(user.postResponseList);
    }
  }, [user]);
  
  // Check authentication status and redirect if needed
  useEffect(() => {
    // Only redirect if we've determined the user is not authenticated
    // This prevents unnecessary redirects on initial load
    if (isAuthenticated === false) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);
  
  // If still determining auth status, show nothing to prevent flash
  if (isAuthenticated === undefined) {
    return null;
  }
  
  const handleDeleteClick = (postId: string) => {
    setPostToDelete(postId);
    setShowDeleteDialog(true);
  };
  
  const handleDeleteConfirm = async () => {
    if (!postToDelete) return;
    
    try {
      setIsDeleting(postToDelete);
      await deletePost(postToDelete);
      
      // Update local state immediately to remove the deleted post
      setUserPosts(prevPosts => prevPosts.filter(post => post.id !== postToDelete));
      
      // Invalidate the query to refresh user data from backend
      queryClient.invalidateQueries({ queryKey: ['user'] });
      
      toast({
        title: "Post deleted",
        description: "Your post has been successfully deleted.",
      });
    } catch (error) {
      console.error('Failed to delete post:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete post. Please try again.",
      });
    } finally {
      setIsDeleting(null);
      setShowDeleteDialog(false);
      setPostToDelete(null);
    }
  };
  
  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
    setPostToDelete(null);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <motion.div 
        className="container max-w-6xl pt-32 pb-16 px-4 md:px-6 flex-grow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <UserProfileHeader />
        <PostsList 
          posts={userPosts} 
          onDeleteClick={handleDeleteClick} 
          isDeleting={isDeleting}
        />
      </motion.div>
      
      <Footer />
      
      <DeleteConfirmationDialog 
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default Profile;
