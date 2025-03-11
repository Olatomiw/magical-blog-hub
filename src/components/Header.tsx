
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/AuthModal';
import { motion } from 'framer-motion';

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
          <span className="font-bold text-xl tracking-tight">Minimal Blog</span>
        </motion.div>
        
        <motion.nav 
          className="flex items-center space-x-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <div className="text-sm hidden md:block">
                Welcome, <span className="font-medium">{user?.firstName || user?.username}</span>
              </div>
              <Button 
                variant="outline"
                size="sm"
                onClick={logout}
                className="glass-button"
              >
                Sign Out
              </Button>
            </div>
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
