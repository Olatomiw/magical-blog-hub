
export interface Author {
  id: string;
  name: string;
}

export interface Comment {
  id: string;
  text: string;
  createdAt: string;
  authorDTO: Author;
}

export interface Category {
  id: string;
  name: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  author: Author;
  categories: Category[];
  comments: Comment[];
}

export interface PostsResponse {
  status: string;
  message: string;
  data: Post[];
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  bio: string;
  image: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  bio: string;
  password: string;
  image: string;
}

export interface AuthResponse {
  status: string;
  message: string;
  data?: {
    token?: string;
    user?: User;
  };
}
