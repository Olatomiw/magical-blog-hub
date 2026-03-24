import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogCard from "@/components/BlogCard";
import FeatureStrip from "@/components/FeatureStrip";
import FeedTabs from "@/components/FeedTabs";
import PreferenceModal from "@/components/PreferenceModal";
import { getAllPosts, getPersonalizedFeed } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Post } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Search, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function Index() {
  const { isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showPreferenceModal, setShowPreferenceModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'for-you' | 'explore'>(
    isAuthenticated ? 'for-you' : 'explore'
  );
  const postsPerPage = 6;

  const wsUrl = API.ws.update;
  const { isConnected, posts: wsPostsData, lastMessage } = useWebSocket(wsUrl);

  // Explore feed
  const { data: exploreData, isLoading: exploreLoading, isError: exploreError } = useQuery({
    queryKey: ["posts"],
    queryFn: getAllPosts,
    enabled: activeTab === 'explore' && !isConnected,
  });

  // For You feed - suppress error toasts by catching
  const { data: forYouData, isLoading: forYouLoading, isError: forYouError } = useQuery({
    queryKey: ["personalizedFeed", currentPage],
    queryFn: async () => {
      try {
        return await getPersonalizedFeed(currentPage, postsPerPage + 1);
      } catch {
        // Swallow error to prevent toast - we handle inline
        return { content: [], totalPages: 0 } as any;
      }
    },
    enabled: activeTab === 'for-you' && isAuthenticated === true,
    retry: false,
  });

  const isForYou = activeTab === 'for-you';

  // Determine posts based on active tab
  let posts: Post[] = [];
  let isLoading = false;
  let isError = false;

  if (isForYou) {
    posts = forYouData?.content || [];
    isLoading = forYouLoading;
    isError = forYouError;
  } else {
    posts = isConnected ? wsPostsData : (exploreData?.data || []);
    isLoading = !isConnected && exploreLoading;
    isError = exploreError;
  }

  const filteredPosts = posts.filter((post: Post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const featuredPost = filteredPosts[0];
  const remainingPosts = filteredPosts.slice(1);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = remainingPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = isForYou
    ? (forYouData?.totalPages || 1)
    : Math.ceil(remainingPosts.length / postsPerPage);

  useEffect(() => { setCurrentPage(1); }, [lastMessage]);

  useEffect(() => {
    setActiveTab(isAuthenticated ? 'for-you' : 'explore');
  }, [isAuthenticated]);

  const handleTabChange = (tab: 'for-you' | 'explore') => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // For You empty state
  const forYouEmpty = isForYou && !isLoading && !isError && filteredPosts.length === 0;
  // For You error state
  const forYouFailed = isForYou && !isLoading && isError;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-grow">
        <div className="container px-4 md:px-6 max-w-6xl mx-auto pt-28 pb-16">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-3">
              Stories that <span className="text-primary">matter</span>.
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg mb-8">
              An AI-powered reading experience. Discover, read, and understand — faster.
            </p>

            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search articles..."
                className="pl-11 h-11 rounded-full bg-card border-border/60 shadow-sm focus-visible:ring-primary/30"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
            </div>
          </motion.div>

          {/* Feature Strip */}
          <FeatureStrip />

          {/* Feed Tabs */}
          <FeedTabs activeTab={activeTab} onTabChange={handleTabChange} />

          {/* Content */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : forYouFailed ? (
            <div className="text-center py-20">
              <p className="text-sm text-muted-foreground">Unable to load your feed right now.</p>
            </div>
          ) : forYouEmpty ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground mb-4">Your personalised feed is empty. Choose some interests to get started.</p>
              <div className="flex items-center justify-center gap-4">
                <Button
                  onClick={() => setShowPreferenceModal(true)}
                  className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-6"
                >
                  Choose Interests
                </Button>
                <Link to="/profile" className="text-primary font-medium hover:underline text-sm">
                  Go to profile settings →
                </Link>
              </div>
            </div>
          ) : isError ? (
            <div className="text-center py-20">
              <p className="text-lg text-destructive">Error loading posts. Please try again later.</p>
            </div>
          ) : filteredPosts.length > 0 ? (
            <>
              {featuredPost && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="mb-10"
                >
                  <BlogCard post={featuredPost} featured />
                </motion.div>
              )}

              {currentPosts.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {currentPosts.map((post: Post, i: number) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.05 * i }}
                    >
                      <BlogCard post={post} />
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {totalPages > 1 && (
                <Pagination className="mt-10">
                  <PaginationContent>
                    {currentPage > 1 && (
                      <PaginationItem><PaginationPrevious onClick={() => paginate(currentPage - 1)} /></PaginationItem>
                    )}
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(page => Math.abs(page - currentPage) < 3 || page === 1 || page === totalPages)
                      .map((page, index, array) => {
                        if (index > 0 && page - array[index - 1] > 1) {
                          return <PaginationItem key={`e-${page}`}><PaginationLink className="cursor-default">...</PaginationLink></PaginationItem>;
                        }
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink isActive={page === currentPage} onClick={() => paginate(page)}>
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
                    {currentPage < totalPages && (
                      <PaginationItem><PaginationNext onClick={() => paginate(currentPage + 1)} /></PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-lg text-muted-foreground">No posts found. Try different search terms.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />

      <PreferenceModal
        isOpen={showPreferenceModal}
        onClose={() => setShowPreferenceModal(false)}
      />
    </div>
  );
}
