import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ActivityProvider } from './context/ActivityProvider';
import { ProfileProvider, useUserProfile } from './context/ProfileContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Log from './pages/Log';
import Insights from './pages/Insights';
import Progress from './pages/Progress';
import Learn from './pages/Learn';
import NotFound from './pages/NotFound';

const ProtectedRoute = () => {
  const { profile } = useUserProfile();
  if (!profile.onboarded) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

function App() {
  return (
    <ProfileProvider>
      <ActivityProvider>
        <Router basename={import.meta.env.BASE_URL}>
          <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-emerald-500/30">
            <Navbar />
            <main id="main-content" className="pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/log" element={<Log />} />
                  <Route path="/insights" element={<Insights />} />
                  <Route path="/progress" element={<Progress />} />
                  <Route path="/learn" element={<Learn />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </Router>
      </ActivityProvider>
    </ProfileProvider>
  );
}

export default App;
