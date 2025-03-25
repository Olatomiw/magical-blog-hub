
import { useState, useEffect, useCallback } from 'react';
import { Post } from '@/lib/types';
import { toast } from '@/components/ui/use-toast';

type WebSocketMessage = {
  type: string;
  data: any;
};

export function useWebSocket(url: string) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);

  // Initialize WebSocket connection
  useEffect(() => {
    const webSocket = new WebSocket(url);

    webSocket.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      toast({
        title: "Connected to real-time updates",
        description: "You'll now receive posts in real-time",
      });
    };

    webSocket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as WebSocketMessage;
        setLastMessage(message);
        
        if (message.type === 'posts') {
          setPosts(message.data);
        } else if (message.type === 'newPost') {
          setPosts(prevPosts => [message.data, ...prevPosts]);
        } else if (message.type === 'updatePost') {
          setPosts(prevPosts => 
            prevPosts.map(post => 
              post.id === message.data.id ? message.data : post
            )
          );
        } else if (message.type === 'deletePost') {
          setPosts(prevPosts => 
            prevPosts.filter(post => post.id !== message.data.id)
          );
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    webSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      toast({
        variant: "destructive",
        title: "Connection error",
        description: "Could not connect to real-time updates",
      });
    };

    webSocket.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    };

    setSocket(webSocket);

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      webSocket.close();
    };
  }, [url]);

  // Function to send messages through the WebSocket
  const sendMessage = useCallback((type: string, data: any) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type, data }));
    } else {
      console.error('WebSocket is not connected');
    }
  }, [socket]);

  return { isConnected, posts, lastMessage, sendMessage };
}
