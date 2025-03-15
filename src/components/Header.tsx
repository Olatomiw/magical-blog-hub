
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/AuthModal';
import { motion } from 'framer-motion';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut } from 'lucide-react';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  
  const openLoginModal = () => {
    setAuthMode('login');
    setAuthModalOpen(true);
  };
  
  const openSignupModal = () => {
    setAuthMode('signup');
    setAuthModalOpen(true);
  };
  
  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50 py-4 glass-panel"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <motion.div 
          className="flex items-center space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <Link to="/" className="font-bold text-xl tracking-tight">Minimal Blog</Link>
        </motion.div>
        
        <motion.nav 
          className="flex items-center space-x-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full" size="icon">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user?.profilePicture || user?.image} alt={user?.username || "User"} />
                    <AvatarFallback>
                      {user?.firstName?.charAt(0) || user?.username?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-0.5 leading-none">
                    <p className="font-medium text-sm">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs text-muted-foreground">@{user?.username}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer flex w-full items-center">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={openLoginModal}
                className="ring-focus"
              >
                Log In
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={openSignupModal}
                className="glass-button"
              >
                Sign Up
              </Button>
            </div>
          )}
        </motion.nav>
      </div>
      
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
        setMode={setAuthMode}
      />
    </motion.header>
  );
};

export default Header;
