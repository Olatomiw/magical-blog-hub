
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';
import { LoginCredentials } from '@/lib/types';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';

interface LoginFormProps {
  onSuccess: () => void;
}

const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const { login, isLoading } = useAuth();
  const [loginData, setLoginData] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginData.email || !loginData.password) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please enter both email and password.",
      });
      return;
    }
    
    const success = await login(loginData);
    
    if (success) {
      onSuccess();
      setLoginData({ email: '', password: '' });
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
      <div className="space-y-2">
        <Label htmlFor="login-email">Email</Label>
        <Input
          id="login-email"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={loginData.email}
          onChange={handleChange}
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
          'Log In'
        )}
      </Button>
    </motion.form>
  );
};

export default LoginForm;
