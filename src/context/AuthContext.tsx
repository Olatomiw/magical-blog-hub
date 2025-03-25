
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LoginCredentials, SignupCredentials, User } from '@/lib/types';
import { toast } from '@/components/ui/use-toast';

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

// Mock auth functions for demo purposes
// In a real app, these would connect to a backend service
const mockLogin = async (credentials: LoginCredentials): Promise<User> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock user data
  return {
    id: "1",
    username: "demo_user",
    firstName: "Demo",
    lastName: "User",
    email: credentials.email,
    role: "USER",
    bio: "This is a demo user account.",
    profilePicture: null,
    createdAt: new Date().toISOString(),
    postResponseList: [
      {
        id: "post1",
        title: "My First Post",
        content: "This is the content of my first post. It's pretty cool!",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "published",
        author: {
          id: "1",
          username: "demo_user",
        },
        comments: [],
        categories: []
      }
    ]
  };
};

const mockSignup = async (credentials: SignupCredentials): Promise<User> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock user data
  return {
    id: "1",
    username: credentials.username || "new_user",
    firstName: credentials.firstName || "",
    lastName: credentials.lastName || "",
    email: credentials.email,
    role: "USER",
    bio: credentials.bio || "",
    profilePicture: credentials.image ? URL.createObjectURL(credentials.image) : null,
    createdAt: new Date().toISOString(),
    postResponseList: []
  };
};

// AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  
  // Check for existing auth on mount
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    };
    
    checkAuth();
  }, []);
  
  // Login function
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call
      const userData = await mockLogin(credentials);
      
      // Store user data
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
      
      toast({
        title: "Welcome back!",
        description: `You've successfully logged in.`,
      });
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setIsAuthenticated(false);
      
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Signup function
  const signup = async (credentials: SignupCredentials): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call
      const userData = await mockSignup(credentials);
      
      // Store user data
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
      
      toast({
        title: "Account created!",
        description: "Your account has been successfully created.",
      });
      
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      setIsAuthenticated(false);
      
      toast({
        variant: "destructive",
        title: "Signup Failed",
        description: "Unable to create your account. Please try again.",
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
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
