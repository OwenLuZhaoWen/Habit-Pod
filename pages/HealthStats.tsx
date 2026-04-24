import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import AIScanner from '../components/AIScanner';

const WEEKLY_DATA = [
  { name: 'Mon', calories: 1200, snacks: 5, motion: 15 },
  { name: 'Tue', calories: 900, snacks: 3, motion: 25 },
  { name: 'Wed', calories: 1500, snacks: 8, motion: 10 },
  { name: 'Thu', calories: 800, snacks: 2, motion: 45 },
  { name: 'Fri', calories: 1100, snacks: 4, motion: 30 },
  { name: 'Sat', calories: 2100, snacks: 10, motion: 5 },
  { name: 'Sun', calories: 1800, snacks: 7, motion: 12 },
];

const COMPARISON_DATA = [
  { name: 'Device A (Son)', intake: 2400, burned: 1200 },
  { name: 'Device B (Daughter)', intake: 1800, burned: 900 },
];

const HealthStats: React.FC = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Health Analytics & Scanning</h1>
        <p className="text-slate-500 mt-2">Correlating snack intake with motion interaction data, and AI food scanning.</p>
      </header>

      {/* AI Scanner Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <AIScanner />
        </div>
        
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-96">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Weekly Caloric Intake vs. Motion Minutes</h3>
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={WEEKLY_DATA}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} axisLine={false} />
              <YAxis yAxisId="left" stroke="#94a3b8" tickLine={false} axisLine={false} />
              <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" tickLine={false} axisLine={false} />
              <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend />
              <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="calories" 
                  stroke="#6366f1" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }} 
                  activeDot={{ r: 8 }}
                  name="Calories Ingested"
              />
              <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="motion" 
                  stroke="#10b981" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                  name="Motion Minutes"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Comparison Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-80">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Device Comparison</h3>
            <ResponsiveContainer width="100%" height="80%">
                <BarChart data={COMPARISON_DATA}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
                    <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                    <Legend />
                    <Bar dataKey="intake" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Intake (kcal)" />
                    <Bar dataKey="burned" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Motion Credit (kcal)" />
                </BarChart>
            </ResponsiveContainer>
        </div>

        {/* Insight Card */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-2xl text-white shadow-xl flex flex-col justify-center">
            <h3 className="text-2xl font-bold mb-4">AI Insight</h3>
            <div className="space-y-4">
                <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                    <p className="text-sm text-slate-300 mb-1">Pattern Detected</p>
                    <p className="font-medium">Wednesday intake spikes correlate with low motion activity. Suggest activating "Squat for Snacks" mode on Wednesday evenings.</p>
                </div>
                <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                     <p className="text-sm text-slate-300 mb-1">RAG Context</p>
                     <p className="font-medium">Based on "Kids Nutrition Facts", sugar intake for Device A is 15% above recommended weekly limit.</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default HealthStats;