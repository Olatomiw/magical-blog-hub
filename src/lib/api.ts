import { toast } from '@/components/ui/use-toast';
import type { 
  PostsResponse, 
  AuthResponse, 
  LoginCredentials, 
  SignupCredentials,
  Category,
  UserPreferences,
  PaginatedPostsResponse
} from '@/lib/types';

import { API } from '@/config/api';

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
  return fetchWithErrorHandling<PostsResponse>(API.post.getAll);
}

export async function createPost(title: string, content: string, status: string, categoryIds: (number | string)[], image?: File): Promise<any> {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('Authentication required');
  }
  
  const formData = new FormData();
  const postBody = { title, content, status, categoryIds };
  formData.append('PostBody', new Blob([JSON.stringify(postBody)], { type: 'application/json' }));
  
  if (image) {
    formData.append('image', image);
  }
  
  try {
    const response = await fetch(API.post.create, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }

    return await response.json();
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

export async function deletePost(postId: string): Promise<any> {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('Authentication required');
  }
  
  return fetchWithErrorHandling<any>(API.post.delete(postId), {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
}

// AI Summarization API
export async function summarizePost(postId: string): Promise<{ summary: string }> {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('Authentication required');
  }
  
  const response = await fetchWithErrorHandling<{ content: string }>(API.ai.summarize(postId), {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  return { summary: response.content };
}

// Categories API
export async function getAllCategories(): Promise<Category[]> {
  const token = localStorage.getItem('token');
  return fetchWithErrorHandling<Category[]>(API.category.getAll, {
    headers: {
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
  });
}

export async function getAllCategoriesV1(): Promise<Category[]> {
  const token = localStorage.getItem('token');
  return fetchWithErrorHandling<Category[]>(API.category.getAll, {
    headers: {
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
  });
}

// Preferences API
export async function getUserPreferences(): Promise<UserPreferences> {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Authentication required');
  
  return fetchWithErrorHandling<UserPreferences>(API.preferences.get, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` },
  });
}

export async function saveUserPreferences(categoryIds: string[]): Promise<UserPreferences> {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Authentication required');
  
  return fetchWithErrorHandling<UserPreferences>(API.preferences.save, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ categoryIds }),
  });
}

// Personalized Feed API
export async function getPersonalizedFeed(start: number = 1, limit: number = 10): Promise<PaginatedPostsResponse> {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Authentication required');
  
  return fetchWithErrorHandling<PaginatedPostsResponse>(
    `${API_BASE_URL}/post/personalized-feed?start=${start}&limit=${limit}`,
    {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    }
  );
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

export async function signup(credentials: SignupCredentials): Promise<any> {
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
    
    return responseData;
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
