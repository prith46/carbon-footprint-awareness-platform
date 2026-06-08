import { Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center px-4 animate-in fade-in duration-500">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 max-w-md w-full shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="bg-slate-800 p-4 rounded-full">
            <Leaf className="w-12 h-12 text-slate-500 opacity-50" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-slate-100 mb-3">404</h1>
        <p className="text-slate-400 mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-block bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-6 py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900 shadow-lg shadow-emerald-500/20"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
