
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LoginCredentials, SignupCredentials, User } from '@/lib/types';
import { toast } from '@/components/ui/use-toast';
import { login as apiLogin, signup as apiSignup } from '@/lib/api';

// Define the shape of our auth context
interface AuthContextType {
  isAuthenticated: boolean | undefined;
  isLoading: boolean;
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  signup: (credentials: SignupCredentials) => Promise<boolean>;
  logout: () => void;
  updateUserState: (updatedUser: User) => void;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  
  // Check for existing auth on mount
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    };
    
    checkAuth();
  }, []);
  
  // Login function that uses the API endpoint
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await apiLogin(credentials);
      
      if (response.data?.token && response.data?.userData) {
        // Store token and user data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.userData));
        
        setUser(response.data.userData);
        setIsAuthenticated(true);
        
        toast({
          title: "Welcome back!",
          description: `You've successfully logged in.`,
        });
        
        return true;
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      setIsAuthenticated(false);
      
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error instanceof Error ? error.message : "Invalid email or password. Please try again.",
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Signup function that uses the API endpoint
  const signup = async (credentials: SignupCredentials): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await apiSignup(credentials);
      console.log('Signup response received:', response);
      
      // The response format from signup is the same as login
      // It contains token and userData in the data object
      if (response.body?.data?.token && response.body?.data?.userData) {
        // Store token and user data
        localStorage.setItem('token', response.body.data.token);
        localStorage.setItem('user', JSON.stringify(response.body.data.userData));
        
        setUser(response.body.data.userData);
        setIsAuthenticated(true);
        
        toast({
          title: "Account created!",
          description: "Your account has been successfully created and you're now logged in.",
        });
        
        return true;
      } else {
        console.error('Invalid signup response format:', response);
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setIsAuthenticated(false);
      
      toast({
        variant: "destructive",
        title: "Signup Failed",
        description: error instanceof Error ? error.message : "Unable to create your account. Please try again.",
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    
    toast({
      title: "Logged out",
      description: "You've been successfully logged out.",
    });
  };
  
  // Update user state function
  const updateUserState = (updatedUser: User) => {
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };
  
  // Provide the auth context to children
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        login,
        signup,
        logout,
        updateUserState
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
