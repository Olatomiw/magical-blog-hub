
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: 'login' | 'signup';
  setMode: (mode: 'login' | 'signup') => void;
}

const AuthModal = ({ isOpen, onClose, initialMode, setMode }: AuthModalProps) => {
  const { login, signup, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>(initialMode);
  
  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  
  // Signup form state
  const [signupData, setSignupData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    bio: '',
    password: '',
    confirmPassword: '',
    image: '',
  });
  
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSignupChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setSignupData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginData.email || !loginData.password) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please enter both email and password.",
      });
      return;
    }
    
    const success = await login({
      email: loginData.email,
      password: loginData.password,
    });
    
    if (success) {
      onClose();
      setLoginData({ email: '', password: '' });
    }
  };
  
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (signupData.password !== signupData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords Don't Match",
        description: "Please make sure your passwords match.",
      });
      return;
    }
    
    if (!signupData.email || !signupData.password || !signupData.username) {
      toast({
        variant: "destructive",
        title: "Missing Required Fields",
        description: "Please fill in all required fields.",
      });
      return;
    }
    
    const success = await signup({
      firstName: signupData.firstName,
      lastName: signupData.lastName,
      username: signupData.username,
      email: signupData.email,
      bio: signupData.bio,
      password: signupData.password,
      image: signupData.image || 'https://via.placeholder.com/150',
    });
    
    if (success) {
      onClose();
      setSignupData({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        bio: '',
        password: '',
        confirmPassword: '',
        image: '',
      });
    }
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setMode(value as 'login' | 'signup');
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
              <motion.form 
                onSubmit={handleLoginSubmit}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    className="ring-focus"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    className="ring-focus"
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full mt-4 glass-button"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    'Log In'
                  )}
                </Button>
              </motion.form>
            </TabsContent>
            
            <TabsContent value="signup" key="signup">
              <motion.form 
                onSubmit={handleSignupSubmit}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-firstName">First Name</Label>
                    <Input
                      id="signup-firstName"
                      name="firstName"
                      placeholder="John"
                      value={signupData.firstName}
                      onChange={handleSignupChange}
                      className="ring-focus"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-lastName">Last Name</Label>
                    <Input
                      id="signup-lastName"
                      name="lastName"
                      placeholder="Doe"
                      value={signupData.lastName}
                      onChange={handleSignupChange}
                      className="ring-focus"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-username">Username <span className="text-red-500">*</span></Label>
                  <Input
                    id="signup-username"
                    name="username"
                    placeholder="johndoe"
                    value={signupData.username}
                    onChange={handleSignupChange}
                    className="ring-focus"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email <span className="text-red-500">*</span></Label>
                  <Input
                    id="signup-email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={signupData.email}
                    onChange={handleSignupChange}
                    className="ring-focus"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-bio">Bio</Label>
                  <Textarea
                    id="signup-bio"
                    name="bio"
                    placeholder="Tell us about yourself..."
                    value={signupData.bio}
                    onChange={handleSignupChange}
                    className="h-20 ring-focus"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-image">Profile Image URL</Label>
                  <Input
                    id="signup-image"
                    name="image"
                    placeholder="https://example.com/your-image.jpg"
                    value={signupData.image}
                    onChange={handleSignupChange}
                    className="ring-focus"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password <span className="text-red-500">*</span></Label>
                  <Input
                    id="signup-password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={signupData.password}
                    onChange={handleSignupChange}
                    className="ring-focus"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-confirmPassword">Confirm Password <span className="text-red-500">*</span></Label>
                  <Input
                    id="signup-confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={signupData.confirmPassword}
                    onChange={handleSignupChange}
                    className="ring-focus"
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full mt-4 glass-button"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </motion.form>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
