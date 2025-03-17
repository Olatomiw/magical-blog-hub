
import { toast } from '@/components/ui/use-toast';
import type { 
  PostsResponse, 
  AuthResponse, 
  LoginCredentials, 
  SignupCredentials 
} from '@/lib/types';

const API_BASE_URL = 'http://localhost:8080/api';

// Reusable fetch function with error handling
async function fetchWithErrorHandling<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || `Request failed with status ${response.status}`;
      throw new Error(errorMessage);
    }

    return await response.json() as T;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    toast({
      variant: "destructive",
      title: "Error",
      description: errorMessage,
    });
    throw error;
  }
}

// Posts API
export async function getAllPosts(): Promise<PostsResponse> {
  return fetchWithErrorHandling<PostsResponse>(`${API_BASE_URL}/post/getAllPost`);
}

// Comments API
export async function createComment(postId: string, text: string): Promise<any> {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('Authentication required');
  }
  
  return fetchWithErrorHandling<any>(`${API_BASE_URL}/comment/create/${postId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ text }),
  });
}

// Auth API
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  return fetchWithErrorHandling<AuthResponse>(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export async function signup(credentials: SignupCredentials): Promise<AuthResponse> {
  const { image, ...otherCredentials } = credentials;
  
  if (!image) {
    throw new Error('Profile image is required');
  }
  
  const formData = new FormData();
  
  // Add the credentials as SignupCredentials
  const signupCredentialsBlob = new Blob([JSON.stringify(otherCredentials)], { 
    type: 'application/json' 
  });
  formData.append('SignupCredentials', signupCredentialsBlob);
  
  // Add the image separately
  formData.append('image', image);
  
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || `Signup failed with status ${response.status}`;
      toast({
        variant: "destructive",
        title: "Signup Error",
        description: errorMessage,
      });
      throw new Error(errorMessage);
    }
    
    return await response.json() as AuthResponse;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during signup';
    toast({
      variant: "destructive",
      title: "Error",
      description: errorMessage,
    });
    throw error;
  }
}

// Helper to format date
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  }).format(date);
}

// Helper to truncate text
export function truncateText(text: string, maxLength: number = 150): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
