import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ShellWorkshop from './pages/ShellWorkshop';
import PersonaEngine from './pages/PersonaEngine';
import HealthStats from './pages/HealthStats';
import MotionHub from './pages/MotionHub';

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
        <Sidebar />
        <main className="flex-1 ml-64 transition-all duration-300">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/workshop" element={<ShellWorkshop />} />
            <Route path="/persona" element={<PersonaEngine />} />
            <Route path="/health" element={<HealthStats />} />
            <Route path="/motion" element={<MotionHub />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;