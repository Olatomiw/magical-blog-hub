import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { deletePost } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import UserProfileHeader from '@/components/profile/UserProfileHeader';
import PostsList from '@/components/profile/PostsList';
import DeleteConfirmationDialog from '@/components/profile/DeleteConfirmationDialog';

const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const queryClient = useQueryClient();
  
  // If not authenticated, redirect to home page
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  const userPosts = user?.postResponseList || [];
  
  const handleDeleteClick = (postId: string) => {
    setPostToDelete(postId);
    setShowDeleteDialog(true);
  };
  
  const handleDeleteConfirm = async () => {
    if (!postToDelete) return;
    
    try {
      setIsDeleting(postToDelete);
      await deletePost(postToDelete);
      
      // Update local state to reflect deletion
      // Since we're using the user context for posts, we need to refresh the data
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
