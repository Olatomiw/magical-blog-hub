
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogCard from "@/components/BlogCard";
import { getAllPosts } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Post } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Search, Loader2, Sparkles, Wifi, WifiOff } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useWebSocket } from "@/hooks/useWebSocket";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";

export default function Index() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const postsPerPage = 6;
  
  // WebSocket connection for real-time updates
  const wsUrl = "ws://localhost:8080/api/update";
  const { isConnected, posts: wsPostsData, lastMessage } = useWebSocket(wsUrl);
  
  // Fallback to traditional API when WebSocket isn't available
  const { data, isLoading, isError } = useQuery({
    queryKey: ["posts"],
    queryFn: getAllPosts,
    enabled: !isConnected, // Only run query if WebSocket is not connected
  });
  
  // Use WebSocket data if available, otherwise use API data
  const posts = isConnected ? wsPostsData : (data?.data || []);
  
  // Filter posts based on search term
  const filteredPosts = posts.filter((post: Post) => {
    return (
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  
  // Calculate pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  
  // Reset to first page when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [lastMessage]);
  
  // Handle page change
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary/30">
      <Header />
      
      <main className="flex-grow">
        <div className="container px-4 md:px-6 max-w-7xl mx-auto pt-32 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-primary">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">Minimal Blog</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover stories, thoughts, and ideas on a variety of topics.
            </p>
            
            {/* WebSocket connection indicator */}
            <div className="flex items-center justify-center gap-2 mt-2">
              {isConnected ? (
                <div className="flex items-center text-green-500 text-sm">
                  <Wifi className="h-4 w-4 mr-1" />
                  <span>Live updates active</span>
                </div>
              ) : (
                <div className="flex items-center text-yellow-500 text-sm">
                  <WifiOff className="h-4 w-4 mr-1" />
                  <span>Using standard updates</span>
                </div>
              )}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative mb-8 max-w-xl mx-auto"
          >
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search posts..."
              className="pl-10 shadow-elegant"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
            />
          </motion.div>
          
          {isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex justify-center mb-8"
            >
              <Button
                onClick={() => navigate("/create-post")}
                className="glass-button bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Create New Post
              </Button>
            </motion.div>
          )}
          
          {(!isConnected && isLoading) ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : isError ? (
            <div className="text-center py-20">
              <p className="text-lg text-red-500">
                Error loading posts. Please try again later.
              </p>
            </div>
          ) : filteredPosts.length > 0 ? (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {currentPosts.map((post: Post) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.1 * currentPosts.indexOf(post),
                    }}
                  >
                    <BlogCard post={post} />
                  </motion.div>
                ))}
              </motion.div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination className="mt-10">
                  <PaginationContent>
                    {currentPage > 1 && (
                      <PaginationItem>
                        <PaginationPrevious onClick={() => paginate(currentPage - 1)} />
                      </PaginationItem>
                    )}
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(page => Math.abs(page - currentPage) < 3 || page === 1 || page === totalPages)
                      .map((page, index, array) => {
                        // Add ellipsis
                        if (index > 0 && page - array[index - 1] > 1) {
                          return (
                            <PaginationItem key={`ellipsis-${page}`}>
                              <PaginationLink className="cursor-default">...</PaginationLink>
                            </PaginationItem>
                          );
                        }
                        
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              isActive={page === currentPage}
                              onClick={() => paginate(page)}
                              className={page === currentPage ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
                    
                    {currentPage < totalPages && (
                      <PaginationItem>
                        <PaginationNext onClick={() => paginate(currentPage + 1)} />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-lg text-muted-foreground">
                No posts found. Try different search terms.
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
