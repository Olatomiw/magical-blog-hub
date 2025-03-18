
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllPosts, formatDate, createComment } from "@/lib/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { ArrowLeft, MessageSquare, Clock, User, Loader2 } from "lucide-react";
import { Post } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

interface CommentItemProps {
  comment: any;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment }) => {
  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src={comment.authorDTO?.image || ''} alt={comment.authorDTO?.name || 'User'} />
            <AvatarFallback>{comment.authorDTO?.name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <div className="text-sm font-medium">{comment.authorDTO?.name}</div>
            <div className="text-xs text-muted-foreground">
              {formatDate(comment.createdAt)}
            </div>
            <p className="text-sm mt-1">{comment.text}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: postsData, isLoading, isError } = useQuery({
    queryKey: ["posts"],
    queryFn: getAllPosts,
  });

  const post: Post | undefined = postsData?.data.find((p: Post) => p.id === id);

  const handleGoBack = () => {
    navigate("/");
  };

  const handleCommentSubmit = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to post a comment.",
        variant: "destructive",
      });
      return;
    }

    if (!commentText.trim()) {
      toast({
        title: "Empty Comment",
        description: "Please enter some text for your comment.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await createComment(id!, commentText);
      setCommentText("");
      toast({
        title: "Comment Posted",
        description: "Your comment has been posted successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error Posting Comment",
        description: error.message || "Failed to post comment.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container max-w-4xl mx-auto px-4 md:px-6 pt-32 pb-16 flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
        </main>
        <Footer />
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container max-w-4xl mx-auto px-4 md:px-6 pt-32 pb-16 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Error</h2>
            <p className="text-muted-foreground">Failed to load post.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container max-w-4xl mx-auto px-4 md:px-6 pt-32 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button variant="ghost" onClick={handleGoBack} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          
          <Card className="mb-8">
            <CardContent className="p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
                <div className="flex items-center space-x-2 mb-4">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{post.author?.name?.charAt(0) || 'A'}</AvatarFallback>
                  </Avatar>
                  <div className="text-sm">
                    <span className="font-medium">{post.author?.name}</span>
                    <p className="text-xs text-muted-foreground">
                      <Clock className="inline-block h-3 w-3 mr-1" />
                      {formatDate(post.createdAt)}
                    </p>
                  </div>
                </div>
                <p className="text-md leading-relaxed">{post.content}</p>
                <div className="mt-4">
                  {post.categories?.map((category) => (
                    <Badge key={category.id} variant="secondary" className="mr-2">
                      {category.name}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            </CardContent>
          </Card>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 mr-1" />
              Comments ({post.comments.length})
            </h2>
            {post.comments.length === 0 ? (
              <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
            ) : (
              <div>
                {post.comments.map((comment: any) => (
                  <CommentItem key={comment.id} comment={comment} />
                ))}
              </div>
            )}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-6"
          >
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Add a Comment</h3>
                {isAuthenticated ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.profilePicture || user?.image || ''} alt={user?.username || 'User'} />
                        <AvatarFallback>{user?.firstName?.charAt(0) || user?.username?.charAt(0) || 'U'}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">
                        Commenting as <span className="font-medium">{user?.firstName} {user?.lastName}</span>
                      </span>
                    </div>
                    <Textarea
                      placeholder="Write your comment here..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="ring-focus"
                    />
                    <Button
                      onClick={handleCommentSubmit}
                      disabled={isSubmitting}
                      className="glass-button"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Post Comment"
                      )}
                    </Button>
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    You must be <Button variant="link" onClick={() => navigate('/login')}>logged in</Button> to post a comment.
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
}
