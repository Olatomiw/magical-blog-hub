
import { Github, Mail, Twitter, Heart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-t from-muted/50 to-muted/20 py-8 mt-auto border-t border-gray-200/30 dark:border-gray-700/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-3 flex items-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
              <Star className="h-5 w-5 mr-2 text-yellow-500" /> 
              Minimal Blog
            </h3>
            <p className="text-sm text-muted-foreground">
              A simple and elegant platform for sharing your thoughts and ideas with the world.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-3 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors hover-underline">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-muted-foreground hover:text-foreground transition-colors hover-underline">
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/create-post" className="text-muted-foreground hover:text-foreground transition-colors hover-underline">
                  Create Post
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-3 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Connect</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-indigo-500 transition-colors transform hover:scale-110 duration-200">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-purple-500 transition-colors transform hover:scale-110 duration-200">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-pink-500 transition-colors transform hover:scale-110 duration-200">
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-muted-foreground/10 text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center">
            © {currentYear} Minimal Blog. Made with 
            <Heart className="h-4 w-4 mx-1 text-red-500 animate-pulse" /> 
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
