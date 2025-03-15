
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { Loader2, Upload } from 'lucide-react';
import { SignupCredentials } from '@/lib/types';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface SignupFormProps {
  onSuccess: () => void;
}

const SignupForm = ({ onSuccess }: SignupFormProps) => {
  const { signup, isLoading } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [signupData, setSignupData] = useState<SignupCredentials & { confirmPassword: string }>({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    bio: '',
    password: '',
    confirmPassword: '',
    image: null,
  });
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const handleChange = (
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
  
  const handleSubmit = async (e: React.FormEvent) => {
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
    
    const { confirmPassword, ...credentials } = signupData;
    const success = await signup(credentials);
    
    if (success) {
      onSuccess();
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
  
  return (
    <motion.form 
      onSubmit={handleSubmit}
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
            onChange={handleChange}
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
            onChange={handleChange}
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
          onChange={handleChange}
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
          onChange={handleChange}
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
          onChange={handleChange}
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
          onChange={handleChange}
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
          onChange={handleChange}
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
  );
};

export default SignupForm;
