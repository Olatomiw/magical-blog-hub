
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate, truncateText, deletePost } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, MessageCircle, Clock, Calendar, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navigate } from 'react-router-dom';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { toast } from '@/components/ui/use-toast';

const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const itemsPerPage = 6;
  
  // If not authenticated, redirect to home page
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  const userPosts = user?.postResponseList || [];
  
  // Calculate pagination
  const totalPages = Math.ceil(userPosts.length / itemsPerPage);
  const indexOfLastPost = currentPage * itemsPerPage;
  const indexOfFirstPost = indexOfLastPost - itemsPerPage;
  const currentPosts = userPosts.slice(indexOfFirstPost, indexOfLastPost);
  
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
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
  
  // Animations
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
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <motion.div 
        className="container max-w-6xl pt-32 pb-16 px-4 md:px-6 flex-grow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* User profile information section */}
        <motion.div 
          className="mb-12 text-center md:text-left md:flex items-center gap-8"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={item} className="flex justify-center mb-6 md:mb-0">
            <Avatar className="w-32 h-32 border-4 border-primary/20">
              <AvatarImage 
                src={user?.profilePicture || user?.image} 
                alt={user?.username || "User profile"}
              />
              <AvatarFallback className="text-3xl">
                {user?.firstName?.charAt(0) || user?.username?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
          </motion.div>
          
          <motion.div variants={item} className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {user?.firstName} {user?.lastName}
            </h1>
            <p className="text-muted-foreground mb-4 flex items-center justify-center md:justify-start gap-1">
              <User className="h-4 w-4 mr-1" />
              @{user?.username}
              {user?.role && (
                <Badge variant="outline" className="ml-2 capitalize">
                  {user.role.toLowerCase()}
                </Badge>
              )}
            </p>
            {user?.bio && (
              <p className="max-w-xl text-sm md:text-base">
                {user.bio}
              </p>
            )}
            <p className="text-sm text-muted-foreground mt-2 flex items-center justify-center md:justify-start">
              <Calendar className="h-4 w-4 mr-1" /> 
              Joined {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
            </p>
          </motion.div>
        </motion.div>
        
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
                {userPosts.length} post{userPosts.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
          
          {userPosts.length === 0 ? (
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
                    <Card className="h-full flex flex-col hover:shadow-md transition-shadow duration-200 relative">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl mb-1 line-clamp-2">
                          <Link to={`/blog/${post.id}`} className="hover:text-primary transition-colors">
                            {post.title}
                          </Link>
                        </CardTitle>
                        <CardDescription className="flex items-center text-xs">
                          <Clock className="h-3 w-3 mr-1" /> 
                          {formatDate(post.createdAt)}
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="pb-4 flex-grow">
                        <p className="text-sm text-muted-foreground">
                          {truncateText(post.content, 120)}
                        </p>
                      </CardContent>
                      
                      <CardFooter className="pt-0 flex justify-between items-center">
                        <span className="flex items-center text-xs text-muted-foreground">
                          <MessageCircle className="h-3 w-3 mr-1" />
                          {post.comments.length} comment{post.comments.length !== 1 ? 's' : ''}
                        </span>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            asChild
                            className="text-xs"
                          >
                            <Link to={`/blog/${post.id}`}>
                              Read More
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs p-1 h-auto hover:bg-destructive/10 hover:text-destructive"
                            onClick={(e) => {
                              e.preventDefault();
                              handleDeleteClick(post.id);
                            }}
                            disabled={isDeleting === post.id}
                          >
                            {isDeleting === post.id ? (
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-destructive border-r-transparent" />
                            ) : (
                              <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                            )}
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
              
              {/* Pagination */}
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
      </motion.div>
      
      <Footer />
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this post? This action cannot be undone and all comments will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Profile;
