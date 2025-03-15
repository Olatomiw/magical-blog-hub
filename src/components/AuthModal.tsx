
import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { Loader2, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: 'login' | 'signup';
  setMode: (mode: 'login' | 'signup') => void;
}

const AuthModal = ({ isOpen, onClose, initialMode, setMode }: AuthModalProps) => {
  const { login, signup, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>(initialMode);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
    image: null as File | null,
  });
  
  // Preview for the uploaded image
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
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
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSignupData(prev => ({ ...prev, image: file }));
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
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
      image: signupData.image,
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
        image: null,
      });
      setImagePreview(null);
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
            
            <TabsContent value="signup" key="signup" className="max-h-[60vh] overflow-y-auto pr-1">
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
                  <Label>Profile Image</Label>
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={triggerFileInput}
                  >
                    <input
                      type="file"
                      id="image-upload"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    
                    {imagePreview ? (
                      <div className="flex flex-col items-center">
                        <Avatar className="w-20 h-20 mb-2">
                          <AvatarImage src={imagePreview} alt="Profile preview" />
                          <AvatarFallback>
                            {signupData.firstName?.charAt(0) || signupData.username?.charAt(0) || '?'}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground">Click to change image</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Upload className="h-10 w-10 text-gray-400 mb-2" />
                        <span className="text-sm font-medium">Upload a profile image</span>
                        <span className="text-xs text-muted-foreground mt-1">
                          Click to browse files
                        </span>
                      </div>
                    )}
                  </div>
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
