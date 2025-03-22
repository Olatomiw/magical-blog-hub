import { toast } from '@/components/ui/use-toast';
import type { 
  PostsResponse, 
  AuthResponse, 
  LoginCredentials, 
  SignupCredentials,
  Category
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

export async function createPost(title: string, content: string, status: string, categoryIds: number[]): Promise<any> {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('Authentication required');
  }
  
  return fetchWithErrorHandling<any>(`${API_BASE_URL}/post/create`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, content, status, categoryIds }),
  });
}

// AI Summarization API
export async function summarizePost(postId: string): Promise<{ summary: string }> {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('Authentication required');
  }
  
  return fetchWithErrorHandling<{ summary: string }>(`${API_BASE_URL}/${postId}/ai`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
}

// Categories API
export async function getAllCategories(): Promise<Category[]> {
  return fetchWithErrorHandling<Category[]>(`${API_BASE_URL}/category/categories`);
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
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || `Login failed with status ${response.status}`;
      toast({
        variant: "destructive",
        title: "Login Error",
        description: errorMessage,
      });
      throw new Error(errorMessage);
    }
    
    return await response.json() as AuthResponse;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during login';
    toast({
      variant: "destructive",
      title: "Error",
      description: errorMessage,
    });
    throw error;
  }
}

export async function signup(credentials: SignupCredentials): Promise<AuthResponse> {
  const { image, ...otherCredentials } = credentials;
  
  if (!image) {
    throw new Error('Profile image is required');
  }
  
  const formData = new FormData();
  
  // Create a Blob with the JSON data for SignupCredentials as expected by the backend
  const signupCredentialsBlob = new Blob([JSON.stringify(otherCredentials)], { 
    type: 'application/json' 
  });
  
  // Add SignupCredentials part exactly as the backend expects it
  formData.append('SignupCredentials', signupCredentialsBlob);
  
  // Add the image as a separate part named 'image' as expected by the backend
  formData.append('image', image);
  
  try {
    console.log('Sending signup request with data:', { credentials: otherCredentials });
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      body: formData,
    });
    
    const responseData = await response.json();
    console.log('Signup response:', responseData);
    
    if (!response.ok) {
      const errorMessage = responseData.message || `Signup failed with status ${response.status}`;
      toast({
        variant: "destructive",
        title: "Signup Error",
        description: errorMessage,
      });
      throw new Error(errorMessage);
    }
    
    return responseData as AuthResponse;
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
