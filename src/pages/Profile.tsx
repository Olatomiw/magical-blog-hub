import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { deletePost } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import UserProfileHeader from '@/components/profile/UserProfileHeader';
import PostsList from '@/components/profile/PostsList';
import DeleteConfirmationDialog from '@/components/profile/DeleteConfirmationDialog';
import PreferencesSection from '@/components/profile/PreferencesSection';
import { Post } from '@/lib/types';

const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => { if (user?.postResponseList) setUserPosts(user.postResponseList); }, [user]);
  useEffect(() => { if (isAuthenticated === false) navigate('/', { replace: true }); }, [isAuthenticated, navigate]);

  if (isAuthenticated === undefined) return null;

  const handleDeleteClick = (postId: string) => { setPostToDelete(postId); setShowDeleteDialog(true); };

  const handleDeleteConfirm = async () => {
    if (!postToDelete) return;
    try {
      setIsDeleting(postToDelete);
      await deletePost(postToDelete);
      setUserPosts(prev => prev.filter(p => p.id !== postToDelete));
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast({ title: "Deleted", description: "Post has been removed." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete post." });
    } finally {
      setIsDeleting(null);
      setShowDeleteDialog(false);
      setPostToDelete(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <motion.div
        className="container max-w-5xl pt-24 pb-16 px-4 md:px-6 flex-grow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <UserProfileHeader />
        <PostsList posts={userPosts} onDeleteClick={handleDeleteClick} isDeleting={isDeleting} />
        <PreferencesSection />
      </motion.div>

      <Footer />
      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onCancel={() => { setShowDeleteDialog(false); setPostToDelete(null); }}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default Profile;
