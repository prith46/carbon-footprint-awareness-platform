import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ActivityProvider } from './context/ActivityProvider';
import { ProfileProvider } from './context/ProfileProvider';
import { useUserProfile } from './context/ProfileContext';
import Navbar from './components/Navbar';

const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Log = lazy(() => import('./pages/Log'));
const Insights = lazy(() => import('./pages/Insights'));
const Progress = lazy(() => import('./pages/Progress'));
const Learn = lazy(() => import('./pages/Learn'));
const NotFound = lazy(() => import('./pages/NotFound'));

const ProtectedRoute = () => {
  const { profile } = useUserProfile();
  if (!profile || !profile.onboarded) {
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
              <Suspense fallback={
                <div className="flex items-center justify-center min-h-screen text-slate-400">
                  Loading...
                </div>
              }>
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
              </Suspense>
            </main>
          </div>
        </Router>
      </ActivityProvider>
    </ProfileProvider>
  );
}

export default App;
