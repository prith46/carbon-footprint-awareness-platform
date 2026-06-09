import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserProfile } from '../context/ProfileContext';
import { Leaf } from 'lucide-react';

const Home = () => {
  const { profile, setProfile } = useUserProfile();
  const navigate = useNavigate();

  const [name, setName] = useState(profile.name || '');
  const [lifestyle, setLifestyle] = useState(profile.lifestyle || 'urban');
  const [location, setLocation] = useState(profile.location || 'Bangalore');
  const [error, setError] = useState('');

  useEffect(() => {
    if (profile.onboarded) {
      navigate('/dashboard', { replace: true });
    }
  }, [profile.onboarded, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name to continue.');
      return;
    }
    if (name.length > 50) {
      setError('Name must be under 50 characters.');
      return;
    }
    setError('');
    
    setProfile({
      name: name.trim(),
      lifestyle,
      location,
      onboarded: true
    });
    
    navigate('/dashboard');
  };

  if (profile.onboarded) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-12">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl shadow-black/50">
        <div className="flex justify-center mb-6">
          <div className="bg-emerald-500/20 p-3 rounded-full">
            <Leaf className="w-8 h-8 text-emerald-400" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-slate-100 text-center mb-3">CarbonTrace</h1>
        <p className="text-slate-400 text-center mb-8 leading-relaxed text-sm">
          Track your daily activities, understand your environmental impact, and discover simple ways to reduce your carbon footprint.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1.5">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              maxLength={50}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors"
              placeholder="e.g. Alex"
            />
            {error && <p className="text-red-400 text-xs mt-1.5">{error}</p>}
          </div>

          <div>
            <label htmlFor="lifestyle" className="block text-sm font-medium text-slate-300 mb-1.5">
              Lifestyle
            </label>
            <div className="relative">
              <select
                id="lifestyle"
                value={lifestyle}
                onChange={(e) => setLifestyle(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors appearance-none"
              >
                <option value="urban">Urban</option>
                <option value="suburban">Suburban</option>
                <option value="rural">Rural</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-slate-300 mb-1.5">
              Location
            </label>
            <div className="relative">
              <select
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors appearance-none"
              >
                <option value="Bangalore">Bangalore</option>
                <option value="Chennai">Chennai</option>
                <option value="Delhi">Delhi</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Other">Other</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-lg px-4 py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900 shadow-lg shadow-emerald-500/20"
            >
              Get Started
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Home;
