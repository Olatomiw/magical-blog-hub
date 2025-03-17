
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnimatePresence } from 'framer-motion';
import LoginForm from './auth/LoginForm';
import SignupForm from './auth/SignupForm';
import { useAuth } from '@/context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: 'login' | 'signup';
  setMode: (mode: 'login' | 'signup') => void;
}

const AuthModal = ({ isOpen, onClose, initialMode, setMode }: AuthModalProps) => {
  const [activeTab, setActiveTab] = useState<string>(initialMode);
  const { isAuthenticated } = useAuth();
  
  // Close the modal automatically when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated && isOpen) {
      onClose();
    }
  }, [isAuthenticated, isOpen, onClose]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setMode(value as 'login' | 'signup');
  };
  
  const handleSuccess = () => {
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] rounded-lg glass-panel">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center mb-2">
            {activeTab === 'login' ? 'Welcome Back' : 'Create Your Account'}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="login">Log In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <AnimatePresence mode="wait">
            <TabsContent value="login" key="login">
              <LoginForm onSuccess={handleSuccess} />
            </TabsContent>
            
            <TabsContent value="signup" key="signup" className="max-h-[60vh] overflow-y-auto pr-1">
              <SignupForm onSuccess={handleSuccess} />
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
