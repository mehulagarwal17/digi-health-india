
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Patient, RiskLevel } from '../types';
import { Map, AlertCircle, TrendingUp, Activity, Download } from 'lucide-react';

interface DHOModuleProps {
  patients: Patient[];
}

const DHOModule: React.FC<DHOModuleProps> = ({ patients }) => {
  // Mock trend data
  const data = [
    { name: 'Mon', cases: 12 },
    { name: 'Tue', cases: 19 },
    { name: 'Wed', cases: 32 },
    { name: 'Thu', cases: 28 },
    { name: 'Fri', cases: 45 },
    { name: 'Sat', cases: 38 },
    { name: 'Sun', cases: 52 },
  ];

  const highRiskPatients = patients.filter(p => p.riskLevel === RiskLevel.HIGH);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">District Intelligence Dashboard</h1>
          <p className="text-slate-500">Analytics & Policy Optimization: Rampur District</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-white border px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 shadow-sm">
            <Download size={16} /> Export PDF
          </button>
          <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md">
            Update Resources
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Health Index', value: '78.2', change: '+2.4%', icon: <Activity className="text-blue-600" /> },
          { label: 'Active Outbreaks', value: '2', change: 'Stable', icon: <AlertCircle className="text-orange-600" /> },
          { label: 'Hosp. Load', value: '64%', change: '+12%', icon: <TrendingUp className="text-red-600" /> },
          { label: 'Total Patients', value: patients.length, change: '+15', icon: <Map className="text-emerald-600" /> },
        ].map(stat => (
          <div key={stat.label} className="bg-white p-4 rounded-xl border shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase">{stat.label}</span>
              {stat.icon}
            </div>
            <div className="flex items-end gap-2">
              <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
              <p className={`text-[10px] font-bold mb-1 ${stat.change.startsWith('+') ? 'text-emerald-600' : 'text-slate-500'}`}>
                {stat.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800">Symptom Frequency Trends</h3>
            <select className="text-xs border rounded p-1">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Line type="monotone" dataKey="cases" stroke="#3b82f6" strokeWidth={3} dot={{r: 4, fill: '#3b82f6'}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6">Regional Distribution</h3>
          <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                {area: 'Rampur', val: 40},
                {area: 'Ganj', val: 12},
                {area: 'Milo', val: 25},
                {area: 'Deri', val: 18}
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="area" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <Tooltip />
                <Bar dataKey="val" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-red-50 border border-red-100 p-6 rounded-2xl">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="text-red-600" />
          <h3 className="font-bold text-red-900">AI Alerts & Recommendations</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {highRiskPatients.length > 0 ? (
            <div className="bg-white/80 p-4 rounded-xl border border-red-200">
              <p className="text-xs font-bold text-red-700 uppercase mb-2">High Risk Concentration</p>
              <p className="text-sm text-slate-700">
                Found {highRiskPatients.length} critical cases in the North Sector within 6 hours. Recommend deploying a mobile medical unit to Rampur PHC.
              </p>
            </div>
          ) : (
            <div className="bg-white/80 p-4 rounded-xl border border-slate-200">
              <p className="text-xs font-bold text-slate-500 uppercase mb-2">No High Risk Clusters</p>
              <p className="text-sm text-slate-700">Current reporting levels are within historical averages.</p>
            </div>
          )}
          <div className="bg-white/80 p-4 rounded-xl border border-blue-200">
             <p className="text-xs font-bold text-blue-700 uppercase mb-2">Resource Forecasting</p>
             <p className="text-sm text-slate-700">
                Oxygen demand predicted to spike by 15% in next 48 hours due to seasonal trends. Pre-stocking advised for Central Warehouse.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DHOModule;
