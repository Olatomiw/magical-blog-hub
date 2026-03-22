import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/AuthModal';
import PreferenceModal from '@/components/PreferenceModal';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Link, useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, PenLine, Sun, Moon } from 'lucide-react';

function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggle = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return { theme, toggle };
}

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [showPreferences, setShowPreferences] = useState(false);
  const navigate = useNavigate();
  const { theme, toggle: toggleTheme } = useTheme();

  useEffect(() => {
    if (isAuthenticated && authModalOpen) {
      setAuthModalOpen(false);
      const prefsSelected = localStorage.getItem('preferences_selected');
      if (!prefsSelected) {
        setShowPreferences(true);
      } else {
        setTimeout(() => navigate('/profile'), 100);
      }
    }
  }, [isAuthenticated, authModalOpen, navigate]);

  const openLoginModal = () => { setAuthMode('login'); setAuthModalOpen(true); };
  const openSignupModal = () => { setAuthMode('signup'); setAuthModalOpen(true); };
  const handleLogout = () => { logout(); navigate('/'); };

  const handlePreferencesClose = () => {
    setShowPreferences(false);
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-extrabold text-xl tracking-tight text-foreground">
          Minimal Blog
        </Link>

        <nav className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9 rounded-full"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          {isAuthenticated ? (
            <>
              <Button
                size="sm"
                onClick={() => navigate('/create-post')}
                className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 px-4"
              >
                <PenLine className="h-3.5 w-3.5" />
                Write
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user?.profilePicture || user?.image} alt={user?.username || "User"} />
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                        {user?.firstName?.charAt(0) || user?.username?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl">
                  <div className="flex items-center gap-2 p-3">
                    <div className="flex flex-col">
                      <p className="font-semibold text-sm">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs text-muted-foreground">@{user?.username}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer flex w-full items-center">
                      <User className="mr-2 h-4 w-4" /> Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                    <LogOut className="mr-2 h-4 w-4" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={openLoginModal} className="text-muted-foreground hover:text-foreground">
                Log In
              </Button>
              <Button size="sm" onClick={openSignupModal} className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-5">
                Sign Up
              </Button>
            </div>
          )}
        </nav>
      </div>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
        setMode={setAuthMode}
      />

      <PreferenceModal
        isOpen={showPreferences}
        onClose={handlePreferencesClose}
      />
    </header>
  );
};

export default Header;
