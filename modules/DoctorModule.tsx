
import React, { useState } from 'react';
import { Patient, RiskLevel, PatientStatus } from '../types';
import PatientReviewScreen from '../components/PatientReviewScreen';
import { gemini } from '../services/geminiService';
import { 
  Users, 
  AlertCircle, 
  Search, 
  Filter, 
  Activity, 
  ShieldCheck, 
  BrainCircuit,
  Eye,
  Globe,
  ExternalLink,
  Loader2,
  X
} from 'lucide-react';

interface DoctorModuleProps {
  patients: Patient[];
  onUpdatePatient: (id: string, updates: Partial<Patient>) => void;
}

const DoctorModule: React.FC<DoctorModuleProps> = ({ patients, onUpdatePatient }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [isResearchOpen, setIsResearchOpen] = useState(false);
  const [researchQuery, setResearchQuery] = useState('');
  const [researchResult, setResearchResult] = useState<{text: string, sources: any[]} | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  
  const selectedPatient = patients.find(p => p.id === selectedPatientId);
  
  const handleResearch = async () => {
    if (!researchQuery) return;
    setIsSearching(true);
    const result = await gemini.searchMedicalKnowledge(researchQuery);
    setResearchResult(result);
    setIsSearching(false);
  };

  if (selectedPatient) {
    return <PatientReviewScreen patient={selectedPatient} onBack={() => setSelectedPatientId(null)} onUpdate={onUpdatePatient} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f1f5f9] font-sans">
      <div className="bg-[#1e2b58] text-white px-8 py-10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-20 opacity-10"><BrainCircuit size={300} /></div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-6 relative z-10">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase">Clinical Command Center</h1>
            <p className="text-blue-300 text-sm font-bold uppercase tracking-[0.3em] mt-2">Authenticated: Dr. Satish Kumar • PHC Rampur</p>
          </div>
          <button 
            onClick={() => setIsResearchOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 shadow-2xl transition-all active:scale-95"
          >
            <Globe size={20} /> Grounded AI Research
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full p-8 grid grid-cols-1 gap-8">
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-50/30">
            <div className="relative w-full md:w-[500px]">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Search Patient ID, Symptom, or Village..."
                className="w-full pl-14 pr-6 py-4 bg-white border-2 border-slate-100 rounded-3xl text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-inner"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col items-center px-6 border-r">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Cases</span>
                <span className="text-2xl font-black text-blue-600">{patients.length}</span>
              </div>
              <div className="flex flex-col items-center px-6">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Critical</span>
                <span className="text-2xl font-black text-red-600">{patients.filter(p => p.severity === 'Critical').length}</span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b">
                  <th className="px-8 py-5">Profile</th>
                  <th className="px-8 py-5">Status & Alert</th>
                  <th className="px-8 py-5">AI Screening</th>
                  <th className="px-8 py-5 text-right">Review</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {patients.filter(p => p.id.includes(searchTerm)).map(p => (
                  <tr key={p.id} className="hover:bg-blue-50/30 transition-all group cursor-default">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#1e2b58] text-white flex items-center justify-center font-black text-lg shadow-lg">
                          {p.id[2]}
                        </div>
                        <div>
                          <p className="font-black text-slate-800 tracking-tight">{p.id}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">{p.village} • {p.age}y {p.gender}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        p.severity === 'Critical' ? 'bg-red-500 text-white shadow-red-200' : 'bg-emerald-500 text-white shadow-emerald-200'
                      } shadow-lg`}>
                        <Activity size={12} /> {p.severity}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="max-w-[250px]">
                        <p className="text-[10px] font-black text-blue-600 uppercase mb-1">AI Recommendation</p>
                        <p className="text-xs font-bold text-slate-700 line-clamp-1">{p.aiDiagnosis}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button onClick={() => setSelectedPatientId(p.id)} className="p-3 bg-white text-[#0d47a1] border-2 border-[#0d47a1] rounded-2xl hover:bg-[#0d47a1] hover:text-white transition-all shadow-md group-hover:scale-105">
                        <Eye size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* RESEARCH SLIDE OVER */}
      {isResearchOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-2xl bg-white shadow-[-20px_0_50px_rgba(0,0,0,0.2)] flex flex-col animate-in slide-in-from-right-full duration-500">
            <div className="p-8 border-b flex justify-between items-center bg-[#1e2b58] text-white">
              <h3 className="text-xl font-black tracking-tight flex items-center gap-3"><Globe /> GLOBAL CLINICAL RESEARCH</h3>
              <button onClick={() => setIsResearchOpen(false)} className="hover:rotate-90 transition-transform"><X /></button>
            </div>
            <div className="p-8 space-y-8 flex-1 overflow-y-auto bg-slate-50">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Research Target (Guidelines/Cases/News)</label>
                <div className="flex gap-3">
                  <input 
                    type="text" 
                    placeholder="E.g., 2025 Dengue protocols in North India..."
                    className="flex-1 p-4 bg-white border-2 border-slate-200 rounded-2xl text-sm font-bold focus:border-blue-600 outline-none"
                    value={researchQuery}
                    onChange={e => setResearchQuery(e.target.value)}
                  />
                  <button onClick={handleResearch} className="bg-blue-600 text-white p-4 rounded-2xl shadow-xl hover:bg-blue-700">
                    {isSearching ? <Loader2 className="animate-spin" /> : <Search />}
                  </button>
                </div>
              </div>

              {researchResult && (
                <div className="space-y-6 animate-in fade-in zoom-in-95">
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-blue-100">
                    <p className="text-[10px] font-black text-blue-600 uppercase mb-3 flex items-center gap-2">
                      <ShieldCheck size={14}/> Grounded AI Summary
                    </p>
                    <div className="text-sm font-medium text-slate-800 leading-relaxed whitespace-pre-wrap">
                      {researchResult.text}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verified Sources</p>
                    <div className="grid grid-cols-1 gap-3">
                      {researchResult.sources.map((s, i) => (
                        <a key={i} href={s.web?.uri} target="_blank" className="p-4 bg-white border rounded-2xl flex justify-between items-center hover:bg-blue-50 group">
                          <div>
                            <p className="text-xs font-black text-slate-800">{s.web?.title}</p>
                            <p className="text-[10px] text-slate-400 font-bold truncate max-w-md">{s.web?.uri}</p>
                          </div>
                          <ExternalLink size={16} className="text-slate-300 group-hover:text-blue-600" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorModule;
