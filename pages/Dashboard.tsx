import React, { useEffect, useState } from 'react';
import { Device, DeviceStatus, PersonalityMode } from '../types';
import { Battery, Wifi, AlertTriangle, User, Zap, Info, Clock, Activity } from 'lucide-react';
import { supabase } from '../lib/supabase';

// Mock Data
const MOCK_DEVICES: Device[] = [
  {
    id: 'd1',
    name: "Son's Study Device",
    owner: "Tommy",
    status: DeviceStatus.ONLINE,
    batteryLevel: 85,
    currentPersona: PersonalityMode.STRICT_COACH,
    stats: { caloriesToday: 120, snacksIntercepted: 3 }
  },
  {
    id: 'd2',
    name: "Living Room Hub",
    owner: "Mom",
    status: DeviceStatus.ONLINE,
    batteryLevel: 42,
    currentPersona: PersonalityMode.GENTLE_PARTNER,
    stats: { caloriesToday: 450, snacksIntercepted: 1 }
  },
  {
    id: 'd3',
    name: "Office Monitor",
    owner: "Dad",
    status: DeviceStatus.OFFLINE,
    batteryLevel: 12,
    currentPersona: PersonalityMode.ANIME_CHUUNI,
    stats: { caloriesToday: 0, snacksIntercepted: 0 }
  }
];

const DeviceCard: React.FC<{ device: Device }> = ({ device }) => {
  const isOnline = device.status === DeviceStatus.ONLINE;

  return (
    <div className={`relative p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg ${
      isOnline ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-200 opacity-75'
    }`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${isOnline ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-500'}`}>
                <Zap size={20} />
            </div>
            <div>
                <h3 className="font-semibold text-slate-800">{device.name}</h3>
                <p className="text-sm text-slate-500">{device.owner} • {device.currentPersona}</p>
            </div>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${
            isOnline ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'
        }`}>
            {isOnline ? <Wifi size={12} /> : <AlertTriangle size={12} />}
            <span>{device.status}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-slate-50 p-3 rounded-xl">
            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Calories</p>
            <p className="text-xl font-bold text-slate-700">{device.stats.caloriesToday}</p>
        </div>
        <div className="bg-slate-50 p-3 rounded-xl">
            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Blocked</p>
            <p className="text-xl font-bold text-slate-700">{device.stats.snacksIntercepted}</p>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-slate-500 border-t border-slate-100 pt-4">
        <div className="flex items-center space-x-1">
            <Battery size={16} className={device.batteryLevel < 20 ? 'text-red-500' : 'text-slate-400'} />
            <span className={device.batteryLevel < 20 ? 'text-red-500 font-bold' : ''}>{device.batteryLevel}%</span>
        </div>
        <button className="text-indigo-600 hover:text-indigo-800 font-medium">Manage</button>
      </div>
    </div>
  );
};

const RealtimeScans: React.FC = () => {
  const [scans, setScans] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch initial data
    const fetchScans = async () => {
      try {
        const response = await fetch('/api/scans');
        const json = await response.json();
        if (json.data) {
          setScans(json.data);
        }
      } catch (err) {
        console.error('Error fetching scans:', err);
      }
    };

    fetchScans();

    // Poll for changes
    const interval = setInterval(fetchScans, 5000);

    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex items-center justify-center h-full">
        <p className="text-slate-500 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-500" />
          实时 AI 扫描记录
        </h3>
        <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Live
        </span>
      </div>

      {scans.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-slate-400">
          <Clock className="w-8 h-8 mb-2 opacity-50" />
          <p className="text-sm">暂无扫描记录</p>
        </div>
      ) : (
        <div className="space-y-4">
          {scans.map((scan) => (
            <div key={scan.id} className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
              <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                <span className="text-xl font-bold text-indigo-600">{scan.health_score}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-slate-800 truncate">{scan.name}</h4>
                  <span className="text-xs text-slate-500 whitespace-nowrap ml-2">
                    {new Date(scan.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-sm text-slate-600 truncate">{scan.description}</p>
                <div className="mt-2 text-xs font-medium text-slate-500">
                  预估热量: <span className="text-slate-700">{scan.calories} kcal</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Dashboard: React.FC = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Family Overview</h1>
          <p className="text-slate-500 mt-2">Monitoring 3 active HabitPod cores.</p>
        </div>
      </header>
      
      {/* Project Intro Card */}
      <div className="bg-white border border-indigo-100 rounded-2xl p-6 mb-8 shadow-sm flex items-start gap-4">
        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hidden md:block">
            <Info size={24} />
        </div>
        <div>
            <h2 className="text-lg font-bold text-slate-800 mb-2">About HabitPod</h2>
            <p className="text-slate-600 leading-relaxed text-sm">
                HabitPod is an innovative ecosystem combining <strong>AIGC, IoT Hardware, Art Toys, and Digital Health</strong>. 
                We transform the snacking experience by allowing users to generate custom 3D shells (AIGC), engage with 
                distinct AI personalities (Persona Engine), and unlock treats through physical activity (Motion-to-Earn).
            </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200">
            <p className="text-indigo-100 font-medium mb-1">Total Snacks Avoided</p>
            <h2 className="text-4xl font-bold">42</h2>
            <p className="text-sm text-indigo-200 mt-2">↑ 12% from last week</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <p className="text-slate-500 font-medium mb-1">Active Time (Today)</p>
            <h2 className="text-4xl font-bold text-slate-800">5.2h</h2>
            <p className="text-sm text-green-600 mt-2">Excellent posture detected</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
             <p className="text-slate-500 font-medium mb-1">Top Active User</p>
             <div className="flex items-center space-x-3 mt-1">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                    <User size={20} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Tommy</h2>
                    <p className="text-xs text-slate-400">Strict Coach Mode</p>
                </div>
             </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Device Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MOCK_DEVICES.map(device => (
                <DeviceCard key={device.id} device={device} />
            ))}
            {/* Add Device Card */}
            <div className="border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center p-6 text-slate-400 hover:border-indigo-400 hover:text-indigo-500 hover:bg-indigo-50 transition-all cursor-pointer h-full min-h-[240px]">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                    <span className="text-2xl font-light">+</span>
                </div>
                <p className="font-medium">Bind New Core</p>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <RealtimeScans />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;