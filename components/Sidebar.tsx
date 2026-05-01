import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, 
  Palette, 
  BrainCircuit, 
  Activity, 
  Gamepad2, 
  Settings 
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const { t, i18n } = useTranslation();

  const navItems = [
    { name: t('Dashboard'), path: '/', icon: LayoutDashboard },
    { name: t('Exterior Workshop'), path: '/workshop', icon: Palette },
    { name: t('Persona Engine'), path: '/persona', icon: BrainCircuit },
    { name: t('Health Data'), path: '/health', icon: Activity },
    { name: t('Motion Hub'), path: '/motion', icon: Gamepad2 },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0 z-10 shadow-xl">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            HabitPod
          </h1>
          <button 
            onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'zh' : 'en')}
            className="text-xs bg-slate-800 text-slate-300 hover:text-white px-2 py-1 rounded"
          >
            {i18n.language === 'en' ? '中文' : 'EN'}
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-1">{t('Admin Console')}</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <item.icon size={20} />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button className="flex items-center space-x-3 px-4 py-3 w-full text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
          <Settings size={20} />
          <span>{t('System Settings')}</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;