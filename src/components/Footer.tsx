
import { Github, Mail, Twitter, Heart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-indigo-950 text-white py-8 mt-auto">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-3 flex items-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
              <Star className="h-5 w-5 mr-2 text-yellow-400" /> 
              Minimal Blog
            </h3>
            <p className="text-sm text-gray-300">
              A simple and elegant platform for sharing your thoughts and ideas with the world.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-3 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors hover-underline">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-300 hover:text-white transition-colors hover-underline">
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/create-post" className="text-gray-300 hover:text-white transition-colors hover-underline">
                  Create Post
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-3 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">Connect</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors transform hover:scale-110 duration-200">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors transform hover:scale-110 duration-200">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors transform hover:scale-110 duration-200">
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-700/50 text-center text-sm text-gray-400">
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
