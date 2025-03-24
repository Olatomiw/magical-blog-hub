
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllPosts } from "@/lib/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Post } from "@/lib/types";
import BlogPostContent from "@/components/blog/BlogPostContent";
import CommentsList from "@/components/blog/CommentsList";
import CommentForm from "@/components/blog/CommentForm";
import SummarizeButton from "@/components/blog/SummarizeButton";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data: postsData, isLoading, isError } = useQuery({
    queryKey: ["posts"],
    queryFn: getAllPosts,
  });

  const post: Post | undefined = postsData?.data.find((p: Post) => p.id === id);

  const handleGoBack = () => {
    navigate("/");
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
          transition={{ duration: 0.4 }}
        >
          <div className="flex justify-between items-center mb-4">
            <Button variant="ghost" onClick={handleGoBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10">
                  <Sparkles className="h-5 w-5 text-yellow-500" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">AI Features</h4>
                  <p className="text-sm text-muted-foreground">
                    Use our AI to analyze and summarize blog content. Click the "Summarize with AI" button below to get started.
                  </p>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          
          <BlogPostContent post={post} />
          <CommentsList comments={post.comments} />
          <CommentForm postId={id!} />
          <SummarizeButton postId={id!} />
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPost;
