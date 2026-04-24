import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ShellWorkshop from './pages/ShellWorkshop';
import PersonaEngine from './pages/PersonaEngine';
import HealthStats from './pages/HealthStats';
import MotionHub from './pages/MotionHub';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider, useAuth } from './lib/auth';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, isLoading } = useAuth();
  
  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!token) return <Navigate to="/login" replace />;
  
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar />
      <main className="flex-1 ml-64 transition-all duration-300">
        {children}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/workshop" element={<PrivateRoute><ShellWorkshop /></PrivateRoute>} />
          <Route path="/persona" element={<PrivateRoute><PersonaEngine /></PrivateRoute>} />
          <Route path="/health" element={<PrivateRoute><HealthStats /></PrivateRoute>} />
          <Route path="/motion" element={<PrivateRoute><MotionHub /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;