export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://blogai-production-1d3d.up.railway.app';

export const API_BASE_URL = `${BASE_URL}/api`;

export const API = {
  auth: {
    login: `${BASE_URL}/api/auth/login`,
    signup: `${BASE_URL}/api/auth/signup`,
  },
  post: {
    getAll: `${BASE_URL}/api/post/getAllPost`,
    create: `${BASE_URL}/api/post/create`,
    delete: (id: string) => `${BASE_URL}/api/post/delete/${id}`,
    personalizedFeed: (start = 1, limit = 10) =>
      `${BASE_URL}/api/post/personalized-feed?start=${start}&limit=${limit}`,
  },
  ai: {
    summarize: (postId: string) => `${BASE_URL}/api/${postId}/ai`,
  },
  category: {
    getAll: `${BASE_URL}/api/category/categories`,
  },
  preferences: {
    get: `${BASE_URL}/api/v1/users/preferences`,
    save: `${BASE_URL}/api/v1/users/preferences`,
  },
  comment: {
    create: (postId: string) => `${BASE_URL}/api/comment/create/${postId}`,
  },
  ws: {
    update: `${BASE_URL.replace(/^http/, 'ws')}/api/update`,
  },
} as const;
