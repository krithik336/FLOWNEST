import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { ToastProvider } from './components/Toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import Kanban from './pages/Kanban';

// Layout for pages requiring authentication
const ProtectedLayout = ({ children, pageTitle }) => {
  const { isAuthenticated, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-brand-bg text-brand-text">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-brand-accent" />
          <span className="text-sm font-medium text-brand-text/50">Verifying session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-brand-bg text-brand-text">
      {/* Responsive Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar Header */}
        <Navbar onMenuOpen={() => setSidebarOpen(true)} pageTitle={pageTitle} />
        
        {/* Content Body */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

// Route wrapper for public auth pages (redirects to dashboard if logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-brand-bg text-brand-text">
        <Loader2 className="w-10 h-10 animate-spin text-brand-accent" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Sub-component to hold routes after providers are set up
const AppContent = () => {
  return (
    <Routes>
      {/* Auth Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* Protected App Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedLayout pageTitle="Dashboard">
            <Dashboard />
          </ProtectedLayout>
        }
      />
      <Route
        path="/projects"
        element={
          <ProtectedLayout pageTitle="Projects">
            <Projects />
          </ProtectedLayout>
        }
      />
      <Route
        path="/tasks"
        element={
          <ProtectedLayout pageTitle="Tasks">
            <Tasks />
          </ProtectedLayout>
        }
      />
      <Route
        path="/kanban"
        element={
          <ProtectedLayout pageTitle="Kanban Board">
            <Kanban />
          </ProtectedLayout>
        }
      />

      {/* Fallback Redirections */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

// Main App Container with global providers
const App = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
