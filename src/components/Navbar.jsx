import { Link, useLocation } from 'react-router-dom';
import { Home, LayoutDashboard, FileEdit, Lightbulb, TrendingUp } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/', icon: <Home size={20} /> },
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Log', path: '/log', icon: <FileEdit size={20} /> },
    { name: 'Insights', path: '/insights', icon: <Lightbulb size={20} /> },
    { name: 'Progress', path: '/progress', icon: <TrendingUp size={20} /> },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-slate-900 border-b border-slate-800 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-emerald-400 font-bold text-xl tracking-tight">CarbonTrace</span>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-800 text-emerald-400'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-emerald-300'
                  }`}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
