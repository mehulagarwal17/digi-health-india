
import React, { useState } from 'react';
import { Patient, RiskLevel, PatientStatus } from '../types';
import PatientReviewScreen from '../components/PatientReviewScreen';
import { 
  Users, 
  AlertCircle, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Activity, 
  ShieldCheck, 
  BrainCircuit,
  Eye
} from 'lucide-react';

interface DoctorModuleProps {
  patients: Patient[];
  onUpdatePatient: (id: string, updates: Partial<Patient>) => void;
}

const DoctorModule: React.FC<DoctorModuleProps> = ({ patients, onUpdatePatient }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  
  const selectedPatient = patients.find(p => p.id === selectedPatientId);
  const pendingCases = patients.filter(p => p.status === PatientStatus.OBSERVATION);
  const criticalCount = patients.filter(p => p.severity === 'Critical').length;
  
  const filteredPatients = patients.filter(p => 
    p.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.aiDiagnosis && p.aiDiagnosis.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (selectedPatient) {
    return (
      <PatientReviewScreen 
        patient={selectedPatient} 
        onBack={() => setSelectedPatientId(null)} 
        onUpdate={onUpdatePatient}
      />
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] font-sans">
      {/* Sub-header / Stats Bar */}
      <div className="bg-[#1e2b58] text-white px-8 py-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Clinical Command Center</h1>
            <p className="text-blue-200/70 text-sm flex items-center gap-2 mt-1 font-medium">
              <ShieldCheck size={14} /> Authorized: Dr. Satish Kumar • PHC Rampur Sector
            </p>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-3 rounded-xl flex items-center gap-4">
              <div className="bg-blue-500/20 p-2 rounded-lg text-blue-300">
                <Users size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest">Active Cases</p>
                <p className="text-xl font-bold">{pendingCases.length}</p>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-3 rounded-xl flex items-center gap-4">
              <div className="bg-red-500/20 p-2 rounded-lg text-red-400">
                <AlertCircle size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-red-200 uppercase tracking-widest">Critical Alert</p>
                <p className="text-xl font-bold">{criticalCount}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full p-8 space-y-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Table Toolbar */}
          <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by ID, Village or Diagnosis..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0d47a1]/10 focus:border-[#0d47a1] transition-all font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
                <Filter size={16} /> Filter
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-[#0d47a1] rounded-xl hover:bg-blue-800 transition-all shadow-md">
                Download District Report
              </button>
            </div>
          </div>

          {/* Patient Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                  <th className="px-6 py-4">Patient Profile</th>
                  <th className="px-6 py-4">Severity & Status</th>
                  <th className="px-6 py-4">Vitals</th>
                  <th className="px-6 py-4">AI Assessment</th>
                  <th className="px-6 py-4 text-right">Review</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredPatients.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                          p.severity === 'Critical' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                        }`}>
                          {p.id.split('-')[1].substring(0,2)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{p.id}</p>
                          <p className="text-[11px] font-medium text-slate-500">{p.village} • {p.age}y {p.gender}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                        p.severity === 'Critical' ? 'bg-red-100 text-red-700' :
                        p.severity === 'Serious' ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        <Activity size={10} /> {p.severity}
                      </span>
                      <p className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-tighter">{p.status}</p>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-1">
                        <p className="text-[11px] font-medium text-slate-700 flex justify-between w-24">
                          <span>Temp:</span> <span className="font-bold">{p.vitals.temp}°F</span>
                        </p>
                        <p className="text-[11px] font-medium text-slate-700 flex justify-between w-24">
                          <span>Pulse:</span> <span className="font-bold">{p.vitals.pulse} bpm</span>
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      {p.aiDiagnosis ? (
                        <div className="bg-blue-50/50 border border-blue-100 p-2 rounded-lg max-w-[180px]">
                          <p className="text-[10px] text-blue-700 font-bold uppercase flex items-center gap-1 mb-1">
                            <BrainCircuit size={12} /> AI Suggestion
                          </p>
                          <p className="text-[11px] text-blue-900 font-bold leading-tight line-clamp-2">{p.aiDiagnosis}</p>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">No AI Data</span>
                      )}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button 
                        onClick={() => setSelectedPatientId(p.id)}
                        className="p-2.5 bg-[#0d47a1] text-white rounded-xl hover:bg-blue-800 transition-all shadow-sm hover:shadow-md flex items-center gap-2 text-xs font-bold float-right"
                      >
                        <Eye size={16} /> Open Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorModule;
