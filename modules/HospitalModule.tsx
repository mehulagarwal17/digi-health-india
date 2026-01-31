
import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, 
  Bed, 
  Activity, 
  Wind, 
  Users, 
  Ambulance, 
  AlertTriangle, 
  TrendingUp, 
  Search, 
  PlusCircle, 
  ShieldCheck, 
  RefreshCcw, 
  CheckCircle2, 
  XCircle, 
  Bell, 
  UserPlus, 
  FileText,
  Fingerprint,
  History,
  Info,
  Upload,
  Trash2,
  Calendar,
  Save,
  X,
  ExternalLink,
  ClipboardList,
  Stethoscope,
  Droplets,
  BatteryCharging,
  Timer,
  UserMinus
} from 'lucide-react';
import { HospitalStats } from '../types';

interface IncomingAmbulance {
  id: string;
  eta: string;
  severity: 'Low' | 'Moderate' | 'Critical';
  support: 'ICU' | 'Oxygen' | 'General';
  status: 'En-route' | 'Diverted' | 'Accepted';
}

interface UploadedDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  date: string;
}

const HospitalModule: React.FC = () => {
  // --- DASHBOARD STATE ---
  const [stats, setStats] = useState<HospitalStats & { emergencyBeds: number; currentOccupancy: number }>({
    id: 'DHI-HOSP-RAM-001',
    name: 'Rampur District General Hospital',
    totalBeds: 250,
    availableBeds: 42,
    emergencyBeds: 12,
    icuAvailable: true,
    oxygenStock: 82,
    emergencyStatus: 'Active',
    currentOccupancy: 83
  });

  const [incoming, setIncoming] = useState<IncomingAmbulance[]>([
    { id: 'AMB-9921', eta: '4 mins', severity: 'Critical', support: 'Oxygen', status: 'En-route' },
    { id: 'AMB-4402', eta: '12 mins', severity: 'Moderate', support: 'General', status: 'En-route' },
    { id: 'AMB-1188', eta: '25 mins', severity: 'Low', support: 'General', status: 'En-route' },
  ]);

  const [syncTime, setSyncTime] = useState(new Date().toLocaleTimeString());
  const [searchQuery, setSearchQuery] = useState('');
  const [isIntakeModalOpen, setIsIntakeModalOpen] = useState(false);

  // --- INTAKE MODULE STATE ---
  const [nextPatientId, setNextPatientId] = useState(`DHI-2026-${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`);
  const [intakeForm, setIntakeForm] = useState({
    abhaId: '',
    aadhaarLast4: '',
    name: '',
    ageGroup: 'Adult',
    gender: 'Male',
    arrivalMode: 'Walk-in' as 'Walk-in' | 'Ambulance' | 'Referral',
    admissionReason: 'General Illness',
    sourceFacility: '',
    recordDate: new Date().toISOString().split('T')[0],
    consentObtained: false
  });

  const [uploadedDocs, setUploadedDocs] = useState<UploadedDocument[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- ACTIONS ---
  const handleResourceUpdate = (key: keyof HospitalStats | 'emergencyBeds', value: any) => {
    setStats(prev => ({ ...prev, [key]: value }));
  };

  const handleAmbulanceAction = (id: string, action: 'Accepted' | 'Diverted') => {
    setIncoming(prev => prev.map(amb => amb.id === id ? { ...amb, status: action } : amb));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newDocs: UploadedDocument[] = Array.from(files).map((file: File) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type.split('/')[1].toUpperCase(),
        size: (file.size / 1024).toFixed(1) + ' KB',
        date: new Date().toLocaleDateString()
      }));
      setUploadedDocs(prev => [...prev, ...newDocs]);
    }
  };

  const removeDoc = (id: string) => {
    setUploadedDocs(prev => prev.filter(doc => doc.id !== id));
  };

  const handleIntakeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!intakeForm.consentObtained) {
      alert("Consent must be obtained for record linking and processing.");
      return;
    }
    
    const record = {
      patientId: nextPatientId,
      ...intakeForm,
      documents: uploadedDocs
    };

    console.log("Saving Administrative Intake:", record);
    alert(`Administrative Intake Saved Successfully.\n\nSystem Health ID: ${nextPatientId}\n\nThis record has been flagged for Medical Officer review.`);
    
    // Reset & Close
    setNextPatientId(`DHI-2026-${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`);
    clearForm();
    setIsIntakeModalOpen(false);
  };

  const clearForm = () => {
    setIntakeForm({
      abhaId: '',
      aadhaarLast4: '',
      name: '',
      ageGroup: 'Adult',
      gender: 'Male',
      arrivalMode: 'Walk-in',
      admissionReason: 'General Illness',
      sourceFacility: '',
      recordDate: new Date().toISOString().split('T')[0],
      consentObtained: false
    });
    setUploadedDocs([]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setSyncTime(new Date().toLocaleTimeString());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // --- UI HELPERS ---
  const getCapacityColor = (val: number, max: number) => {
    const ratio = val / max;
    if (ratio < 0.1) return 'text-red-600 border-red-200 bg-red-50';
    if (ratio < 0.25) return 'text-amber-600 border-amber-200 bg-amber-50';
    return 'text-emerald-600 border-emerald-200 bg-emerald-50';
  };

  const getStatusColor = (color: 'red' | 'amber' | 'emerald' | 'blue') => {
    switch(color) {
      case 'red': return 'text-red-600 border-red-200 bg-red-50';
      case 'amber': return 'text-amber-600 border-amber-200 bg-amber-50';
      case 'emerald': return 'text-emerald-600 border-emerald-200 bg-emerald-50';
      case 'blue': return 'text-blue-600 border-blue-200 bg-blue-50';
      default: return 'text-slate-600 border-slate-200 bg-slate-50';
    }
  };

  // 15 Summary Cards with specific rules
  const summaryCards = [
    // Row 1
    { label: 'Beds Available', value: stats.availableBeds, sub: `of ${stats.totalBeds}`, icon: <Bed size={18} />, color: getCapacityColor(stats.availableBeds, stats.totalBeds) },
    { label: 'ICU Readiness', value: stats.icuAvailable ? 'ACTIVE' : 'LOCKED', sub: 'Critical Unit Status', icon: <Activity size={18} />, color: stats.icuAvailable ? getStatusColor('emerald') : getStatusColor('red') },
    { label: 'Ventilators', value: 8, sub: 'Units Available', icon: <Activity size={18} />, color: getStatusColor('emerald') }, 
    { label: 'Oxygen Stock', value: `${stats.oxygenStock}%`, sub: 'Current Reserve', icon: <Wind size={18} />, color: getStatusColor(stats.oxygenStock < 25 ? 'red' : stats.oxygenStock < 50 ? 'amber' : 'emerald') },
    { label: 'Current Occupancy', value: `${stats.currentOccupancy}%`, sub: 'Total Load', icon: <Users size={18} />, color: getStatusColor(stats.currentOccupancy > 90 ? 'red' : stats.currentOccupancy > 75 ? 'amber' : 'emerald') },
    
    // Row 2
    { label: 'Trauma Case Load', value: 6, sub: 'Active ER Cases', icon: <AlertTriangle size={18} />, color: getStatusColor('amber') },
    { label: 'Staff On Duty', value: '12 | 28', sub: 'Docs | Nurses', icon: <Stethoscope size={18} />, color: getStatusColor('emerald') },
    { label: 'Avg ER Wait', value: '18 min', sub: 'Admission Delay', icon: <Timer size={18} />, color: getStatusColor('amber') }, 
    { label: 'Admissions Today', value: 34, sub: 'Total Entry', icon: <UserPlus size={18} />, color: getStatusColor('blue') },
    { label: 'Discharges', value: 21, sub: 'Daily Exit', icon: <UserMinus size={18} />, color: getStatusColor('blue') },

    // Row 3
    { label: 'Emergency Buffer', value: stats.emergencyBeds, sub: 'Ready Units', icon: <PlusCircle size={18} />, color: getStatusColor('emerald') },
    { label: 'Inbound Cases', value: incoming.filter(i => i.status === 'En-route').length, sub: 'Ambulances ETA', icon: <Ambulance size={18} />, color: getStatusColor(incoming.length > 5 ? 'red' : 'blue') },
    { label: 'Isolation Beds', value: 5, sub: 'Quarantine Units', icon: <ShieldCheck size={18} />, color: getStatusColor('emerald') }, 
    { label: 'Blood Units (O+)', value: 14, sub: 'Ready Reserve', icon: <Droplets size={18} />, color: getStatusColor('emerald') },
    { label: 'Power Backup', value: '6 hrs', sub: 'Battery Health', icon: <BatteryCharging size={18} />, color: getStatusColor('emerald') },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans antialiased text-slate-900 overflow-x-hidden">
      
      {/* HEADER */}
      <header className="bg-[#1e2b58] text-white px-8 py-4 flex flex-wrap justify-between items-center shadow-lg border-b-4 border-[#0d47a1] shrink-0 sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 border-r border-white/10 pr-6">
            <div className="bg-[#0d47a1] p-2.5 rounded-lg shadow-inner">
              <Building2 size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold leading-none">{stats.name}</h2>
              <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest mt-1">Institutional Admin Panel</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${stats.currentOccupancy < 90 ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]'}`} />
            <h2 className="text-xs font-black uppercase tracking-widest text-blue-100">
              {stats.currentOccupancy < 90 ? 'NORMAL OPS' : 'CRITICAL LOAD'}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex flex-col items-end mr-4">
            <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest">Admin ID: AMB-ADMIN-772</p>
            <p className="text-[9px] text-slate-400 font-medium">Synced: {syncTime}</p>
          </div>
          {/* Logout button removed as it is redundant with global header */}
        </div>
      </header>

      <main className="flex-1 p-8 space-y-8 max-w-[1600px] mx-auto w-full">
        
        {/* ENHANCED OPERATIONAL SUMMARY CARDS (15 Cards) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {summaryCards.map((item, idx) => (
            <div 
              key={idx} 
              className={`p-4 rounded-2xl border-2 shadow-sm flex flex-col justify-between h-32 transition-all hover:scale-[1.03] hover:shadow-md cursor-default ${item.color}`}
            >
              <div className="flex justify-between items-start">
                <span className="text-[9px] font-black uppercase tracking-widest opacity-80 leading-none">{item.label}</span>
                <div className="opacity-40">{item.icon}</div>
              </div>
              <div>
                <p className="text-2xl font-black tracking-tighter leading-none mb-1">{item.value}</p>
                <p className="text-[9px] font-bold opacity-60 uppercase tracking-tight">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: MANAGEMENT CONTEXT */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* INCOMING COORDINATION FEED */}
            <section className="bg-white rounded-[32px] shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-sm font-black text-slate-800 flex items-center gap-2 uppercase tracking-widest">
                  <Ambulance size={18} className="text-[#0d47a1]" /> Incoming Fleet Coordination
                </h3>
                <span className="bg-[#0d47a1] text-white text-[9px] px-3 py-1 rounded-full font-bold tracking-widest">LIVE RADAR</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                      <th className="px-8 py-4">Vehicle ID</th>
                      <th className="px-6 py-4">ETA</th>
                      <th className="px-6 py-4">Severity</th>
                      <th className="px-8 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {incoming.map((amb) => (
                      <tr key={amb.id} className={`hover:bg-slate-50 transition-colors ${amb.status === 'Diverted' ? 'opacity-40 grayscale' : ''}`}>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className="bg-slate-100 p-2 rounded-lg text-slate-500">
                              <Ambulance size={16} />
                            </div>
                            <span className="font-bold text-slate-800">{amb.id}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-sm font-black text-[#0d47a1]">{amb.eta}</td>
                        <td className="px-6 py-5">
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase ${
                            amb.severity === 'Critical' ? 'bg-red-100 text-red-700 border border-red-200' :
                            amb.severity === 'Moderate' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {amb.severity}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          {amb.status === 'En-route' ? (
                            <div className="flex justify-end gap-2">
                              <button onClick={() => handleAmbulanceAction(amb.id, 'Diverted')} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><XCircle size={18}/></button>
                              <button onClick={() => handleAmbulanceAction(amb.id, 'Accepted')} className="p-2 text-[#0d47a1] hover:text-emerald-600 transition-colors"><CheckCircle2 size={18}/></button>
                            </div>
                          ) : (
                            <span className={`text-[10px] font-black uppercase tracking-widest ${amb.status === 'Accepted' ? 'text-emerald-600' : 'text-red-500'}`}>
                              {amb.status}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* AI PREDICTION CARDS */}
              <section className="bg-[#1e2b58] text-white rounded-[32px] p-6 shadow-xl">
                <h3 className="text-[10px] font-black flex items-center gap-2 uppercase tracking-[0.2em] mb-6 text-blue-300">
                  <TrendingUp size={16} /> AI Predictive HUD
                </h3>
                <div className="space-y-6">
                  {[
                    { label: 'Bed Demand (Next 12h)', val: 94, color: 'bg-red-500' },
                    { label: 'Resource Stress Level', val: 72, color: 'bg-amber-500' },
                  ].map((pred, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between text-[9px] font-black uppercase tracking-widest opacity-60">
                        <span>{pred.label}</span>
                        <span>{pred.val}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className={`h-full ${pred.color} shadow-[0_0_8px_currentColor] transition-all duration-1000`} style={{ width: `${pred.val}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* RECENT NOTICES */}
              <section className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-200">
                <h3 className="text-[10px] font-black text-slate-800 flex items-center gap-2 uppercase tracking-[0.2em] mb-4">
                  <Bell size={16} className="text-[#0d47a1]" /> Latest Notices
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
                    <p className="text-[10px] font-black text-blue-800 uppercase mb-0.5">District Advisory</p>
                    <p className="text-[11px] font-medium text-blue-900 leading-tight">North Sector experiencing high trauma influx. Prepare ER units.</p>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* RIGHT COLUMN: ACTION HUBS */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* QUICK ACTIONS HUB (Trigger Cards) */}
            <section className="space-y-4">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest ml-1">Administrative Hub</h3>
              <div className="grid grid-cols-2 gap-4">
                {/* INTAKE TRIGGER CARD */}
                <button 
                  onClick={() => setIsIntakeModalOpen(true)}
                  className="bg-white border-2 border-dashed border-slate-300 rounded-[32px] p-8 flex flex-col items-center justify-center gap-3 hover:border-[#0d47a1] hover:bg-blue-50/50 transition-all group shadow-sm active:scale-95"
                >
                  <div className="bg-[#0d47a1] p-4 rounded-full text-white shadow-lg group-hover:scale-110 transition-transform">
                    <PlusCircle size={32} />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-black text-slate-800 uppercase tracking-tight">Register New Intake</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase mt-1 tracking-widest">Admission Protocol</p>
                  </div>
                </button>

                {/* LOCATOR TRIGGER CARD */}
                <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm flex flex-col items-center justify-center gap-3 hover:border-[#0d47a1] transition-all group cursor-pointer">
                   <div className="bg-slate-100 p-4 rounded-full text-slate-500 group-hover:bg-[#0d47a1] group-hover:text-white transition-all">
                    <Search size={32} />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-black text-slate-800 uppercase tracking-tight">Patient Locator</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase mt-1 tracking-widest">ID Search Active</p>
                  </div>
                </div>
              </div>
            </section>

            {/* QUICK RESOURCE CALIBRATION */}
            <section className="bg-[#1e2b58] text-white rounded-[40px] p-8 shadow-xl shadow-blue-900/10 border border-[#0d47a1]">
              <h3 className="text-[10px] font-black flex items-center gap-2 uppercase tracking-[0.2em] mb-6 text-blue-300">
                <RefreshCcw size={16} /> Fast-Track Resource Update
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-[9px] font-black text-blue-200 uppercase tracking-widest">Available Beds</p>
                  <div className="flex bg-white/10 rounded-2xl p-1 border border-white/10">
                    <button onClick={() => handleResourceUpdate('availableBeds', Math.max(0, stats.availableBeds - 1))} className="flex-1 text-xl font-bold hover:bg-white/5 rounded-xl">-</button>
                    <div className="flex-[2] text-center text-xl font-black">{stats.availableBeds}</div>
                    <button onClick={() => handleResourceUpdate('availableBeds', Math.min(stats.totalBeds, stats.availableBeds + 1))} className="flex-1 text-xl font-bold hover:bg-white/5 rounded-xl">+</button>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-[9px] font-black text-blue-200 uppercase tracking-widest">Oxygen Status</p>
                  <div className="h-10 flex items-center">
                    <input 
                      type="range" 
                      min="0" max="100" 
                      value={stats.oxygenStock} 
                      onChange={e => handleResourceUpdate('oxygenStock', parseInt(e.target.value))}
                      className="w-full accent-blue-400 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer" 
                    />
                  </div>
                  <p className="text-[9px] font-bold text-center opacity-40">{stats.oxygenStock}% Pressure</p>
                </div>
              </div>
            </section>

            {/* ADMISSION SUMMARY HUB */}
            <section className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-200">
              <h3 className="text-[10px] font-black text-slate-800 flex items-center gap-2 uppercase tracking-[0.2em] mb-6">
                <ClipboardList size={16} className="text-[#0d47a1]" /> Daily Admission Pulse
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <p className="text-[9px] font-black text-emerald-800 uppercase opacity-60">Admitted Today</p>
                  <p className="text-2xl font-black text-emerald-700">24</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                  <p className="text-[9px] font-black text-blue-800 uppercase opacity-60">Discharged</p>
                  <p className="text-2xl font-black text-blue-700">18</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* --- DETAILED INTAKE REGISTRATION MODAL --- */}
      {isIntakeModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-5xl rounded-[40px] shadow-2xl flex flex-col max-h-[95vh] overflow-hidden border-4 border-white">
            {/* Modal Header */}
            <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
              <div>
                <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3 uppercase tracking-tight">
                  <UserPlus size={28} className="text-[#0d47a1]" /> Patient Intake Registration
                </h3>
                <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  Administrative Only • Admission and Identification purposes. No clinical data entry.
                </p>
              </div>
              <button 
                onClick={() => setIsIntakeModalOpen(false)}
                className="p-3 hover:bg-white rounded-full transition-all text-slate-400 hover:text-red-500 shadow-sm"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Form Content */}
            <div className="flex-1 overflow-y-auto p-10 space-y-12">
              <form id="detailedIntakeForm" onSubmit={handleIntakeSubmit} className="space-y-12 pb-10">
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {/* Section 1: System Health ID & ABHA */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-widest border-l-4 border-[#0d47a1] pl-4">
                      <Fingerprint size={16} /> 1. System Health ID
                    </div>
                    <div className="space-y-6">
                      <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-center justify-between">
                        <div>
                          <p className="text-[9px] font-black text-[#0d47a1] uppercase tracking-widest">Assigned Patient ID</p>
                          <p className="text-lg font-black text-slate-800">{nextPatientId}</p>
                        </div>
                        <ShieldCheck size={28} className="text-blue-200" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 tracking-wider">ABHA Linking (Consent-Based, Optional)</label>
                        <input 
                          type="text" 
                          placeholder="Link existing ABHA ID (e.g. 12-3456-7890-1234)"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-sm font-bold placeholder:font-normal focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                          value={intakeForm.abhaId}
                          onChange={e => setIntakeForm({...intakeForm, abhaId: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 2: ID Verification */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-widest border-l-4 border-indigo-500 pl-4">
                      <ShieldCheck size={16} /> 2. ID Verification (Privacy-Safe)
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 tracking-wider">Aadhaar Last 4 Digits Only</label>
                      <div className="relative">
                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-medium">XXXX XXXX </span>
                        <input 
                          type="text" 
                          maxLength={4}
                          placeholder="0000"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-28 pr-5 py-3.5 text-sm font-black focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                          value={intakeForm.aadhaarLast4}
                          onChange={e => setIntakeForm({...intakeForm, aadhaarLast4: e.target.value.replace(/\D/g,'')})}
                        />
                      </div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter mt-1 flex items-center gap-1">
                        <Info size={10}/> For identification support only. Full Aadhaar is not stored.
                      </p>
                    </div>
                  </div>
                </div>

                <hr className="border-slate-100" />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {/* Section 3: Demographics */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-widest border-l-4 border-emerald-500 pl-4">
                      <Users size={16} /> 3. Basic Demographics
                    </div>
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 tracking-wider">Full Name (Optional)</label>
                        <input 
                          type="text" 
                          placeholder="Enter patient name as per ID"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                          value={intakeForm.name}
                          onChange={e => setIntakeForm({...intakeForm, name: e.target.value})}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 tracking-wider">Age Group</label>
                          <select 
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                            value={intakeForm.ageGroup}
                            onChange={e => setIntakeForm({...intakeForm, ageGroup: e.target.value})}
                          >
                            <option>Child</option>
                            <option>Adult</option>
                            <option>Senior</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 tracking-wider">Gender</label>
                          <select 
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                            value={intakeForm.gender}
                            onChange={e => setIntakeForm({...intakeForm, gender: e.target.value})}
                          >
                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 4: Arrival Details */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-widest border-l-4 border-amber-500 pl-4">
                      <Ambulance size={16} /> 4. Arrival Details
                    </div>
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 tracking-wider">Arrival Mode</label>
                        <div className="grid grid-cols-3 gap-3">
                          {['Walk-in', 'Ambulance', 'Referral'].map(mode => (
                            <button 
                              key={mode}
                              type="button"
                              onClick={() => setIntakeForm({...intakeForm, arrivalMode: mode as any})}
                              className={`py-3 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                                intakeForm.arrivalMode === mode ? 'bg-[#0d47a1] text-white border-[#0d47a1] shadow-lg' : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'
                              }`}
                            >
                              {mode}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 tracking-wider">Admission Reason (Broad Category)</label>
                        <select 
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                          value={intakeForm.admissionReason}
                          onChange={e => setIntakeForm({...intakeForm, admissionReason: e.target.value})}
                        >
                          <option>Fever</option>
                          <option>Injury</option>
                          <option>Respiratory</option>
                          <option>General Illness</option>
                          <option>Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="border-slate-100" />

                {/* Section 5: Previous Records */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-widest border-l-4 border-blue-400 pl-4">
                    <History size={16} /> 5. Previous Medical Records
                  </div>
                  <div className="bg-slate-50 rounded-3xl p-8 space-y-8 border border-slate-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 tracking-wider">Source Facility Name</label>
                        <input 
                          type="text" 
                          placeholder="Facility Name (e.g. City PHC)"
                          className="w-full bg-white border border-slate-200 rounded-xl px-5 py-3.5 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                          value={intakeForm.sourceFacility}
                          onChange={e => setIntakeForm({...intakeForm, sourceFacility: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 tracking-wider">Record Date</label>
                        <div className="relative">
                          <Calendar size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input 
                            type="date" 
                            className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-5 py-3.5 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                            value={intakeForm.recordDate}
                            onChange={e => setIntakeForm({...intakeForm, recordDate: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Document Upload */}
                    <div className="space-y-4">
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-slate-300 rounded-3xl p-10 text-center cursor-pointer hover:border-[#0d47a1] hover:bg-white transition-all group"
                      >
                        <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleFileUpload} accept=".pdf,.jpg,.png" />
                        <div className="bg-white w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200 shadow-sm group-hover:scale-110 transition-transform">
                          <Upload size={24} className="text-[#0d47a1]" />
                        </div>
                        <p className="text-sm font-black text-slate-800 uppercase tracking-tight">Upload Previous Reports</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">
                          PDF, JPG, PNG • Discharge Summaries, Lab Reports, Referral Letters
                        </p>
                        <p className="text-[9px] text-[#0d47a1] font-bold uppercase mt-2 opacity-60 italic">Document storage only. No medical interpretation.</p>
                      </div>

                      {uploadedDocs.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {uploadedDocs.map(doc => (
                            <div key={doc.id} className="bg-white border border-slate-100 p-4 rounded-2xl flex items-center justify-between shadow-sm animate-in zoom-in-95">
                              <div className="flex items-center gap-4">
                                <div className="bg-blue-50 p-2.5 rounded-xl">
                                  <FileText size={20} className="text-[#0d47a1]" />
                                </div>
                                <div>
                                  <p className="text-xs font-black text-slate-800 truncate max-w-[200px]">{doc.name}</p>
                                  <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{doc.type} • {doc.size}</p>
                                </div>
                              </div>
                              <button onClick={() => removeDoc(doc.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                                <Trash2 size={18} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Consent Notice */}
                <div className="pt-8 border-t border-slate-100">
                  <label className="flex items-start gap-4 p-6 bg-blue-50/50 rounded-3xl border border-blue-100 cursor-pointer hover:bg-blue-50 transition-colors shadow-sm">
                    <input 
                      type="checkbox" 
                      className="mt-1.5 w-6 h-6 rounded border-blue-300 text-[#0d47a1] focus:ring-blue-500 cursor-pointer" 
                      checked={intakeForm.consentObtained}
                      onChange={e => setIntakeForm({...intakeForm, consentObtained: e.target.checked})}
                    />
                    <div className="flex-1">
                      <p className="text-xs font-black text-[#0d47a1] uppercase tracking-[0.1em] mb-1">Patient Consent Obtained</p>
                      <p className="text-[11px] text-slate-500 font-bold leading-relaxed">
                        Patient consent required for ABHA linking and document uploads. I certify that no clinical interpretation has been made during this intake and the patient has provided explicit authorization for record linking.
                      </p>
                    </div>
                  </label>
                </div>
              </form>
            </div>

            {/* Modal Footer (Fixed) */}
            <div className="px-10 py-6 border-t border-slate-100 flex justify-end gap-4 bg-white shrink-0">
              <button 
                type="button" 
                onClick={clearForm}
                className="px-8 py-4 text-xs font-black text-[#0d47a1] border-2 border-[#0d47a1] rounded-2xl hover:bg-slate-50 transition-all uppercase tracking-widest"
              >
                Clear Form
              </button>
              <button 
                form="detailedIntakeForm"
                type="submit"
                className="px-10 py-4 bg-[#0d47a1] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-900/20 hover:bg-blue-800 active:scale-95 transition-all flex items-center gap-2"
              >
                <Save size={18} /> Save Intake Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 px-8 py-4 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] shrink-0">
        <div className="flex gap-8">
          <span>FACILITY ID: {stats.id}</span>
          <span>© 2024 DIGI-HEALTH NATIONAL PLATFORM</span>
        </div>
        <div className="flex gap-4">
          <span className="text-emerald-500 flex items-center gap-1"><ShieldCheck size={10} /> ENCRYPTED CONNECTION READY</span>
        </div>
      </footer>
    </div>
  );
};

export default HospitalModule;
