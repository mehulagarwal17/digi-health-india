
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Patient, RiskLevel } from '../types';
import { Map, AlertCircle, TrendingUp, Activity, Download, Globe, ShieldAlert, Radio } from 'lucide-react';

interface DHOModuleProps {
  patients: Patient[];
}

const DHOModule: React.FC<DHOModuleProps> = ({ patients }) => {
  const data = [
    { name: 'Mon', cases: 12 }, { name: 'Tue', cases: 19 }, { name: 'Wed', cases: 32 },
    { name: 'Thu', cases: 28 }, { name: 'Fri', cases: 45 }, { name: 'Sat', cases: 38 }, { name: 'Sun', cases: 52 },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-8 font-sans antialiased overflow-x-hidden">
      <div className="max-w-[1600px] mx-auto space-y-10">
        
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="bg-blue-600 p-4 rounded-[2rem] shadow-[0_0_30px_rgba(37,99,235,0.4)]">
              <ShieldAlert size={40} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tighter uppercase text-white">NATIONAL WAR ROOM</h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1.5 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em]">
                   <Radio size={12} className="animate-pulse" /> Live Contagion Feed: District Rampur
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="bg-slate-800 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-700 border border-slate-700 transition-all">
              <Download size={16} className="inline mr-2" /> Strategic PDF Export
            </button>
            <button className="bg-red-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-700 shadow-xl shadow-red-900/20 transition-all">
              Issue Emergency Protocol
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Outbreak Confidence', value: '88.4%', trend: '+4.2%', color: 'text-blue-400', glow: 'shadow-blue-500/20' },
            { label: 'Cluster Density', value: 'Critical', trend: 'Rampur SE', color: 'text-red-400', glow: 'shadow-red-500/20' },
            { label: 'Response Readiness', value: 'High', trend: 'Oxygen: 92%', color: 'text-emerald-400', glow: 'shadow-emerald-500/20' },
            { label: 'Active Screening', value: patients.length, trend: 'Last 1h: 4', color: 'text-white', glow: 'shadow-slate-500/20' },
          ].map((stat, i) => (
            <div key={i} className={`bg-slate-900/50 p-6 rounded-[2.5rem] border border-slate-800 shadow-2xl ${stat.glow}`}>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{stat.label}</p>
              <div className="flex items-baseline gap-3">
                <span className={`text-4xl font-black ${stat.color} tracking-tighter`}>{stat.value}</span>
                <span className="text-[11px] font-bold text-slate-600">{stat.trend}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 bg-slate-900/50 rounded-[3rem] p-10 border border-slate-800 shadow-2xl">
             <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-black text-white flex items-center gap-3 uppercase tracking-tight">
                   <TrendingUp className="text-blue-500" /> Contagion Trajectory Analysis
                </h3>
                <div className="flex gap-2">
                   <span className="bg-slate-800 px-3 py-1 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">Weekly Focus</span>
                </div>
             </div>
             <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={data}>
                      <defs>
                        <linearGradient id="colorCases" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#64748b', fontWeight: 700}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#64748b', fontWeight: 700}} />
                      <Tooltip contentStyle={{backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', color: '#fff'}} />
                      <Area type="monotone" dataKey="cases" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorCases)" />
                   </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>

          <div className="lg:col-span-4 bg-[#1e293b] rounded-[3rem] p-10 shadow-2xl border border-slate-700 flex flex-col">
             <h3 className="text-xl font-black text-white flex items-center gap-3 uppercase tracking-tight mb-8">
                <AlertCircle className="text-red-500" /> Regional Hotspots
             </h3>
             <div className="flex-1 space-y-6 overflow-y-auto">
                {['Rampur Sector A', 'Milo Village', 'Deri Sub-zone'].map((area, i) => (
                   <div key={i} className="bg-slate-900/50 p-5 rounded-3xl border border-slate-700 flex justify-between items-center group cursor-pointer hover:border-red-500/50 transition-all">
                      <div>
                         <p className="text-sm font-black text-white">{area}</p>
                         <p className="text-[10px] font-bold text-slate-500 uppercase mt-1">Status: Escalating</p>
                      </div>
                      <div className="text-right">
                         <p className="text-lg font-black text-red-500 tracking-tighter">{Math.floor(Math.random()*40 + 10)}%</p>
                         <p className="text-[9px] font-black text-slate-600 uppercase">Load</p>
                      </div>
                   </div>
                ))}
             </div>
             <button className="w-full mt-10 bg-white text-slate-900 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all">
                Full Spatial View
             </button>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-900/20 to-transparent p-10 rounded-[3rem] border border-blue-900/30 flex flex-col md:flex-row items-center gap-10">
           <div className="bg-blue-600 p-8 rounded-[2.5rem] shrink-0 shadow-[0_0_50px_rgba(37,99,235,0.3)]">
              <Globe size={60} className="text-white" />
           </div>
           <div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2">Predictive Outbreak Modeling</h3>
              <p className="text-slate-400 font-medium leading-relaxed max-w-3xl">
                 Our AI models have detected a 74% probability of a viral outbreak in the Northern Corridor within 7 days. Suggested action: Deploy mobile testing units to Village Rampur and prioritize vaccine distribution for Sector 4.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DHOModule;
