import { useState, memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, LayoutDashboard, FileEdit, Lightbulb, TrendingUp, BookOpen, Menu, X } from 'lucide-react';
import { useUserProfile } from '../context/ProfileContext';

const navLinks = [
  { name: 'Home', path: '/', icon: <Home aria-hidden="true" size={20} /> },
  { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard aria-hidden="true" size={20} /> },
  { name: 'Log', path: '/log', icon: <FileEdit aria-hidden="true" size={20} /> },
  { name: 'Insights', path: '/insights', icon: <Lightbulb aria-hidden="true" size={20} /> },
  { name: 'Progress', path: '/progress', icon: <TrendingUp aria-hidden="true" size={20} /> },
  { name: 'Learn', path: '/learn', icon: <BookOpen aria-hidden="true" size={20} /> },
];

const Navbar = () => {
  const location = useLocation();
  const { profile } = useUserProfile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderNavLinks = (className, onClick) => {
    return navLinks.map((link) => {
      if (link.path !== '/' && !profile.onboarded) return null;
      const isActive = location.pathname === link.path;
      return (
        <Link
          key={link.path}
          to={link.path}
          onClick={onClick}
          aria-current={isActive ? "page" : undefined}
          className={`flex items-center px-3 rounded-md font-medium transition-colors ${
            isActive
              ? 'bg-slate-800 text-emerald-400'
              : 'text-slate-300 hover:bg-slate-800 hover:text-emerald-300'
          } ${className}`}
        >
          {link.icon}
          <span>{link.name}</span>
        </Link>
      );
    });
  };

  return (
    <nav aria-label="Main navigation" className="fixed top-0 left-0 w-full bg-slate-900 border-b border-slate-800 z-50">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-emerald-600 text-white px-4 py-2 rounded z-50">
        Skip to content
      </a>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-emerald-400 font-bold text-xl tracking-tight">CarbonTrace</Link>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-4">
            {renderNavLinks('space-x-2 py-2 text-sm', undefined)}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(prev => !prev)}
              className="text-slate-300 hover:text-emerald-400 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 p-2"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {isMobileMenuOpen && (
        <div id="mobile-menu" className="md:hidden border-t border-slate-800 bg-slate-900">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {renderNavLinks('space-x-3 py-3 text-base', () => setIsMobileMenuOpen(false))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default memo(Navbar);
