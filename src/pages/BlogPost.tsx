import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllPosts, formatDate } from "@/lib/api";
import { estimateReadingTime } from "@/lib/utils";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Loader2, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { Post } from "@/lib/types";
import CommentsList from "@/components/blog/CommentsList";
import CommentForm from "@/components/blog/CommentForm";
import SummarizeButton from "@/components/blog/SummarizeButton";

const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { data: postsData, isLoading, isError } = useQuery({
    queryKey: ["posts"],
    queryFn: getAllPosts,
  });

  const post: Post | undefined = postsData?.data.find((p: Post) => p.id === id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Post not found</h2>
            <p className="text-muted-foreground mb-4">The post you're looking for doesn't exist.</p>
            <Button onClick={() => navigate("/")} variant="outline">Go Home</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const imageUrl = post.imageUrl || `https://source.unsplash.com/random/1200x600/?blog,${post.categories[0]?.name || 'journal'}`;
  const authorImageUrl = post.author?.imageUrl || `https://avatar.vercel.sh/${post.author?.id}`;
  const readTime = estimateReadingTime(post.content);
  const getInitials = (name: string) => name.split(' ').map(p => p.charAt(0)).join('').toUpperCase();

  const formatContent = (content: string) => {
    if (!content) return null;
    return content.split('\n\n').map((paragraph, index) => {
      const listMatch = paragraph.match(/^(\d+)\.\s(.+)$/);
      if (listMatch) {
        return (
          <div key={index} className="flex items-start gap-2 mb-4">
            <span className="font-bold text-primary">{listMatch[1]}.</span>
            <p className="text-body leading-relaxed font-serif text-justify">{listMatch[2]}</p>
          </div>
        );
      }
      return (
        <p key={index} className="text-body leading-relaxed font-serif text-justify mb-5">
          {paragraph}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Reading progress */}
      <div className="reading-progress" style={{ width: `${scrollProgress}%` }} />
      <Header />

      {/* Hero image with title overlay */}
      <div className="relative w-full h-[400px] mt-16 overflow-hidden">
        <img src={imageUrl} alt={post.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="container max-w-4xl mx-auto">
            {post.categories?.length > 0 && (
              <div className="flex gap-2 mb-3">
                {post.categories.map(c => (
                  <Badge key={c.id} className="bg-primary text-primary-foreground border-0 text-xs">{c.name}</Badge>
                ))}
              </div>
            )}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight max-w-3xl">
              {post.title}
            </h1>
          </div>
        </div>
      </div>

      <main className="flex-grow">
        <div className="container max-w-[720px] mx-auto px-4 md:px-6 py-8">
          {/* Author row + Summarize */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-border/50 mb-8">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={authorImageUrl} alt={post.author?.name} />
                <AvatarFallback className="bg-primary/10 text-primary text-sm">{getInitials(post.author?.name || 'A')}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold text-foreground">{post.author?.name}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{formatDate(post.createdAt)}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{readTime} min read</span>
                </div>
              </div>
            </div>
            <SummarizeButton postId={id!} />
          </div>

          {/* Content */}
          <motion.article
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-12"
          >
            {formatContent(post.content)}
          </motion.article>

          {/* Comments */}
          <CommentsList comments={post.comments} />
          <CommentForm postId={id!} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;
