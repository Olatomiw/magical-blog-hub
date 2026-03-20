import { Github, Mail, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy text-navy-foreground py-10 mt-auto">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-3">Minimal Blog</h3>
            <p className="text-sm text-navy-foreground/60">
              A modern editorial platform for sharing stories that matter.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-3 text-navy-foreground/50">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-navy-foreground/70 hover:text-navy-foreground transition-colors">Home</Link></li>
              <li><Link to="/profile" className="text-navy-foreground/70 hover:text-navy-foreground transition-colors">Profile</Link></li>
              <li><Link to="/create-post" className="text-navy-foreground/70 hover:text-navy-foreground transition-colors">Write</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-3 text-navy-foreground/50">Connect</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-navy-foreground/50 hover:text-navy-foreground transition-colors"><Github className="h-5 w-5" /></a>
              <a href="#" className="text-navy-foreground/50 hover:text-navy-foreground transition-colors"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="text-navy-foreground/50 hover:text-navy-foreground transition-colors"><Mail className="h-5 w-5" /></a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-navy-foreground/10 text-center text-sm text-navy-foreground/40">
          <p>&copy; {currentYear} Minimal Blog. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
