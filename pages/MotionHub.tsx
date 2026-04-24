import React, { useState } from 'react';
import { MotionGame } from '../types';
import { Gamepad2, Trophy, Eye, Activity } from 'lucide-react';

const MotionHub: React.FC = () => {
  const [games, setGames] = useState<MotionGame[]>([
    {
      id: 'g1',
      title: 'Neck Defender',
      description: 'Defend against monsters by tilting your head. Reduces neck strain.',
      isActive: true,
      type: 'Neck'
    },
    {
      id: 'g2',
      title: 'Squat for Snacks',
      description: 'Unlock the snack cabinet only after performing 10 perfect squats.',
      isActive: false,
      type: 'Squat'
    },
    {
      id: 'g3',
      title: 'Focus Hand',
      description: 'Fast-paced hand gesture tracking to wake up your brain.',
      isActive: false,
      type: 'Focus'
    }
  ]);

  const toggleGame = (id: string) => {
    setGames(prev => prev.map(g => 
        g.id === id ? { ...g, isActive: !g.isActive } : g
    ));
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
       <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
           <Gamepad2 className="text-indigo-600" />
           Motion Interaction Hub
        </h1>
        <p className="text-slate-500 mt-2">
          Configure the "Snack Tax" and desktop fitness games.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map(game => (
            <div key={game.id} className={`group relative overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
                game.isActive 
                ? 'border-indigo-500 bg-white shadow-xl shadow-indigo-100 scale-100' 
                : 'border-slate-200 bg-slate-50 opacity-80 hover:opacity-100'
            }`}>
                <div className={`absolute top-0 left-0 w-full h-2 ${game.isActive ? 'bg-indigo-500' : 'bg-slate-300'}`} />
                
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-xl ${
                            game.isActive ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-500'
                        }`}>
                            {game.type === 'Neck' && <Activity size={24} />}
                            {game.type === 'Squat' && <Trophy size={24} />}
                            {game.type === 'Focus' && <Eye size={24} />}
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={game.isActive} 
                                onChange={() => toggleGame(game.id)} 
                                className="sr-only peer" 
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                    </div>

                    <h3 className="text-xl font-bold text-slate-800 mb-2">{game.title}</h3>
                    <p className="text-slate-500 text-sm mb-6 min-h-[40px]">{game.description}</p>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            {game.isActive ? 'Active Mode' : 'Disabled'}
                        </span>
                        <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                            Configure Rules
                        </button>
                    </div>
                </div>
            </div>
        ))}
      </div>

      <div className="mt-12 bg-indigo-900 rounded-3xl p-8 text-center text-white relative overflow-hidden">
            <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold mb-4">Developer API Available</h2>
                <p className="text-indigo-200 mb-6">
                    Want to build your own desktop motion games? HabitPod opens its camera posture recognition API to community developers.
                </p>
                <button className="bg-white text-indigo-900 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors">
                    View API Documentation
                </button>
            </div>
            {/* Decorative circles */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2"></div>
      </div>
    </div>
  );
};

export default MotionHub;