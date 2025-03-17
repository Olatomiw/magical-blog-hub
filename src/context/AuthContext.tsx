
import React, { createContext, useContext, useState, useEffect } from 'react';
import { login, signup } from '@/lib/api';
import type { User, LoginCredentials, SignupCredentials } from '@/lib/types';
import { toast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  signup: (credentials: SignupCredentials) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for existing user session in localStorage
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        console.log('User restored from localStorage:', parsedUser);
      } catch (error) {
        console.error('Failed to parse stored user data');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    
    setIsLoading(false);
  }, []);

  const handleLogin = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);
    try {
      console.log('Attempting login with:', credentials.email);
      const response = await login(credentials);
      console.log('Login response:', response);
      
      if (response.status === 'Success' && response.data) {
        const userData = response.data.userData;
        const token = response.data.token;
        
        if (userData && token) {
          console.log('Setting user data after login:', userData);
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          localStorage.setItem('token', token);
          
          // Ensure the toast is displayed
          toast({
            title: "Welcome back!",
            description: "You've successfully logged in.",
            duration: 5000, // Display for 5 seconds
          });
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "An error occurred during login. Please try again.",
        duration: 5000,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle signup - identical response format to login
  const handleSignup = async (credentials: SignupCredentials): Promise<boolean> => {
    setIsLoading(true);
    try {
      console.log('Attempting signup with:', credentials.email);
      const response = await signup(credentials);
      console.log('Signup response:', response);
      
      if (response.status === 'Success' && response.data) {
        const userData = response.data.userData;
        const token = response.data.token;
        
        if (userData && token) {
          console.log('Setting user data after signup:', userData);
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          localStorage.setItem('token', token);
          
          // Ensure the toast is displayed with longer duration
          toast({
            title: "Account created",
            description: "Your account has been successfully created and you're now logged in.",
            duration: 5000, // Display for 5 seconds
          });
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        variant: "destructive",
        title: "Signup Failed",
        description: "An error occurred during signup. Please try again.",
        duration: 5000,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    toast({
      title: "Logged out",
      description: "You've been successfully logged out.",
      duration: 3000,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login: handleLogin,
        signup: handleSignup,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
