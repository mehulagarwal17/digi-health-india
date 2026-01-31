
import React, { useState, useEffect, useRef } from 'react';
import { 
  User, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Baby, 
  Heart, 
  AlertCircle, 
  Plus, 
  Search, 
  Wifi, 
  WifiOff, 
  ChevronRight, 
  ArrowRight, 
  Activity, 
  Thermometer, 
  Video, 
  FileText, 
  CreditCard, 
  Home, 
  ClipboardList, 
  Users, 
  BookOpen, 
  MoreHorizontal,
  Stethoscope,
  Volume2,
  Camera,
  X,
  Image as ImageIcon,
  Trash2
} from 'lucide-react';
import { Patient, RiskLevel, PatientStatus } from '../types';
import { gemini } from '../services/geminiService';

interface AshaModuleProps {
  onAddPatient: (p: Patient) => void;
  patients: Patient[];
}

type AshaTab = 'home' | 'tasks' | 'log' | 'track' | 'more';

const AshaModule: React.FC<AshaModuleProps> = ({ onAddPatient, patients }) => {
  const [activeTab, setActiveTab] = useState<AshaTab>('home');
  const [isOnline, setIsOnline] = useState(true);
  const [language, setLanguage] = useState<'EN' | 'HI'>('EN');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showReferralConfirm, setShowReferralConfirm] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Home Screen States
  const ashaName = "Sarita Devi";
  const village = "Rampur Sector A";
  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  // Task List Mock
  const [tasks, setTasks] = useState([
    { id: 1, name: 'Sunita Sharma', type: 'Maternal Checkup', priority: 'Urgent', completed: false, address: 'House 12, Gali 3' },
    { id: 2, name: 'Aryan (Child)', type: 'Polio Drop Follow-up', priority: 'Normal', completed: false, address: 'House 45' },
    { id: 3, name: 'Kishore Das', type: 'Hypertension Check', priority: 'Normal', completed: true, address: 'House 09' },
    { id: 4, name: 'Meena Bai', type: 'Home Visit', priority: 'Urgent', completed: false, address: 'Temple Chowk' },
  ]);

  // Maternal/Child Data
  const pregnantWomen = [
    { id: 'PW01', name: 'Sunita Sharma', due: '12 March 2026', risk: 'High Risk' },
    { id: 'PW02', name: 'Pooja V.', due: '25 April 2026', risk: 'Normal' },
    { id: 'PW03', name: 'Rekha J.', due: '02 June 2026', risk: 'Normal' },
  ];

  const childImmunization = [
    { id: 'C01', name: 'Aryan', vaccine: 'Polio B3', status: 'Pending', due: 'Today' },
    { id: 'C02', name: 'Ishani', vaccine: 'BCG', status: 'Done', due: '10 Feb' },
    { id: 'C03', name: 'Rahul', vaccine: 'Pentavalent 1', status: 'Overdue', due: '01 Feb' },
  ];

  // Log Visit Form State
  const [visitForm, setVisitForm] = useState({
    name: '',
    type: 'General Visit',
    symptoms: [] as string[],
    ageGroup: 'Adult',
    gender: 'Female',
    photo: null as string | null
  });

  const toggleSymptom = (s: string) => {
    setVisitForm(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(s) 
        ? prev.symptoms.filter(x => x !== s)
        : [...prev.symptoms, s]
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setVisitForm(prev => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setVisitForm(prev => ({ ...prev, photo: null }));
    if (photoInputRef.current) photoInputRef.current.value = '';
  };

  const handleLogVisit = async (referral: boolean = false) => {
    setIsAnalyzing(true);
    
    // Preliminary AI check for risk labeling only
    const aiResult = await gemini.analyzeSymptom(visitForm.symptoms, visitForm.ageGroup);
    
    const newPatient: Patient = {
      id: `P-${Math.floor(1000 + Math.random() * 9000)}`,
      age: visitForm.ageGroup,
      gender: visitForm.gender,
      village: village,
      reportingSource: 'ASHA Field Worker',
      symptoms: visitForm.symptoms,
      photo: visitForm.photo || undefined,
      vitals: { temp: '98.6', pulse: '72' },
      riskLevel: aiResult.risk as RiskLevel,
      severity: (aiResult.risk === 'HIGH' ? 'Critical' : aiResult.risk === 'MEDIUM' ? 'Serious' : 'Normal') as any,
      status: referral ? PatientStatus.REFERRED : PatientStatus.OBSERVATION,
      timestamp: new Date().toISOString(),
      aiDiagnosis: aiResult.diagnosis,
      clinicalTimeline: [
        {
          date: new Date().toISOString(),
          note: `Field visit log: ${visitForm.type}. Symptoms: ${visitForm.symptoms.join(', ')}`,
          recordedBy: ashaName,
          role: 'ASHA Worker',
          type: 'Update'
        }
      ]
    };

    onAddPatient(newPatient);
    setIsAnalyzing(false);
    setVisitForm({ name: '', type: 'General Visit', symptoms: [], ageGroup: 'Adult', gender: 'Female', photo: null });
    setActiveTab('home');
    if (referral) setShowReferralConfirm(true);
  };

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  // Language Dictionary
  const lang = {
    EN: {
      welcome: "Namaste,",
      home: "Home",
      tasks: "Tasks",
      visits: "Visits",
      tracking: "Tracking",
      more: "More",
      homeVisits: "Home Visits",
      maternal: "Maternal",
      vaccination: "Vaccines",
      highRisk: "High-Risk",
      refer: "Refer Patient",
      referralUrgent: "Urgent Referral",
      referralMaternal: "Maternal Referral",
      referralNormal: "Normal Referral",
      incentives: "Incentives Earned",
      pending: "Pending",
      syncing: "Syncing Data...",
      online: "Online",
      offline: "Offline",
      photoLabel: "Symptom Photo",
      takePhoto: "Take Photo",
      removePhoto: "Remove"
    },
    HI: {
      welcome: "नमस्ते,",
      home: "होम",
      tasks: "कार्य",
      visits: "मुलाक़ात",
      tracking: "ट्रैकिंग",
      more: "अधिक",
      homeVisits: "घर का दौरा",
      maternal: "मातृ सेवा",
      vaccination: "टीकाकरण",
      highRisk: "उच्च जोखिम",
      refer: "रोगी रेफर करें",
      referralUrgent: "तत्काल रेफरल",
      referralMaternal: "गर्भवती महिला रेफरल",
      referralNormal: "सामान्य रेफरल",
      incentives: "अर्जित प्रोत्साहन",
      pending: "लंबित",
      syncing: "डेटा सिंक हो रहा है...",
      online: "ऑनलाइन",
      offline: "ऑफलाइन",
      photoLabel: "लक्षण फोटो",
      takePhoto: "फोटो लें",
      removePhoto: "हटाएं"
    }
  }[language];

  return (
    <div className="flex flex-col min-h-[calc(100vh-140px)] bg-slate-50 font-sans max-w-lg mx-auto overflow-hidden relative">
      
      {/* 1. Header & Sync Status */}
      <header className="bg-white px-6 pt-6 pb-4 border-b flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#0d47a1] rounded-full flex items-center justify-center text-white shadow-lg">
            <User size={24} />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-800 leading-none">{lang.welcome} {ashaName}</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 flex items-center gap-1">
              <MapPin size={10} /> {village}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <button 
            onClick={() => setLanguage(l => l === 'EN' ? 'HI' : 'EN')}
            className="text-[10px] font-bold bg-slate-100 px-2 py-1 rounded-md text-slate-600 hover:bg-slate-200"
          >
            {language === 'EN' ? 'हिंदी' : 'English'}
          </button>
          <div className={`flex items-center gap-1 text-[10px] font-black uppercase ${isOnline ? 'text-emerald-500' : 'text-slate-400'}`}>
            {isOnline ? <Wifi size={12} /> : <WifiOff size={12} />}
            {isOnline ? lang.online : lang.offline}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-24">
        
        {/* Tab: HOME (DASHBOARD) */}
        {activeTab === 'home' && (
          <div className="p-6 space-y-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest">{today}</h2>
              <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-1">
                <CheckCircle2 size={12} /> ALL SYNCED
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: lang.homeVisits, value: '08', icon: <Home size={18} />, color: 'bg-blue-600' },
                { label: lang.maternal, value: '03', icon: <Heart size={18} />, color: 'bg-rose-500' },
                { label: lang.vaccination, value: '12', icon: <Baby size={18} />, color: 'bg-emerald-500' },
                { label: lang.highRisk, value: '02', icon: <AlertCircle size={18} />, color: 'bg-amber-500' },
              ].map(card => (
                <div key={card.label} className="bg-white p-4 rounded-2xl border shadow-sm flex flex-col justify-between h-28 active:scale-95 transition-transform cursor-pointer">
                  <div className={`${card.color} w-8 h-8 rounded-lg flex items-center justify-center text-white`}>
                    {card.icon}
                  </div>
                  <div>
                    <p className="text-2xl font-black text-slate-800 leading-none">{card.value}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">{card.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Emergency Action */}
            <button 
              onClick={() => setActiveTab('log')}
              className="w-full bg-red-600 text-white p-5 rounded-[2rem] font-black text-xl shadow-lg flex items-center justify-center gap-4 active:scale-95 transition-all"
            >
              <AlertCircle size={24} /> {lang.refer}
            </button>

            {/* Incentive Tracker Minimal */}
            <div className="bg-indigo-900 text-white p-5 rounded-3xl shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <CreditCard size={64} />
              </div>
              <p className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] mb-1">{lang.incentives}</p>
              <div className="flex items-end gap-2">
                <p className="text-3xl font-black">₹ 2,450</p>
                <p className="text-[10px] font-bold text-indigo-300 mb-1.5">{lang.pending}: ₹ 400</p>
              </div>
            </div>

            {/* Education Snippet */}
            <section className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Health Education</h3>
                <ChevronRight size={16} className="text-slate-400" />
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1">
                {[
                  { title: 'Breastfeeding Guide', icon: <Video className="text-blue-500" />, time: '2 min' },
                  { title: 'Handwashing Steps', icon: <FileText className="text-emerald-500" />, time: 'Poster' },
                  { title: 'Vaccination Chart', icon: <BookOpen className="text-rose-500" />, time: 'New' },
                ].map((item, i) => (
                  <div key={i} className="min-w-[140px] bg-white p-4 rounded-2xl border shadow-sm flex flex-col gap-3">
                    <div className="bg-slate-50 w-10 h-10 rounded-xl flex items-center justify-center">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-800 leading-tight">{item.title}</p>
                      <p className="text-[9px] font-black text-slate-400 mt-1 uppercase">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* Tab: TASKS */}
        {activeTab === 'tasks' && (
          <div className="p-6 space-y-6 animate-in slide-in-from-right-4 duration-300">
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Today's Tasks</h2>
            
            <div className="space-y-3">
              {tasks.map(task => (
                <div key={task.id} className={`p-4 rounded-2xl border transition-all flex items-center gap-4 ${task.completed ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-white shadow-sm border-slate-100'}`}>
                  <button 
                    onClick={() => toggleTask(task.id)}
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${task.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-200 text-transparent'}`}
                  >
                    <CheckCircle2 size={16} />
                  </button>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-black text-slate-800">{task.name}</h4>
                      {task.priority === 'Urgent' && !task.completed && (
                        <span className="text-[9px] font-black text-red-600 bg-red-50 px-2 py-0.5 rounded uppercase">Urgent</span>
                      )}
                    </div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">{task.type}</p>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-1"><MapPin size={10} /> {task.address}</p>
                  </div>
                  {!task.completed && <ChevronRight size={18} className="text-slate-300" />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: LOG VISIT (FORM & REFERRAL) */}
        {activeTab === 'log' && (
          <div className="p-6 space-y-8 animate-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Log Household Visit</h2>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Household/Patient Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search or enter name"
                    className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={visitForm.name}
                    onChange={e => setVisitForm({...visitForm, name: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Age Group</label>
                  <select 
                    className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-4 text-sm font-bold shadow-sm outline-none"
                    value={visitForm.ageGroup}
                    onChange={e => setVisitForm({...visitForm, ageGroup: e.target.value})}
                  >
                    <option>Child (0-5)</option>
                    <option>Student (6-18)</option>
                    <option>Adult (19-60)</option>
                    <option>Elderly (60+)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Gender</label>
                  <select 
                    className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-4 text-sm font-bold shadow-sm outline-none"
                    value={visitForm.gender}
                    onChange={e => setVisitForm({...visitForm, gender: e.target.value})}
                  >
                    <option>Female</option>
                    <option>Male</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex justify-between items-center">
                  Symptoms Observed
                  <span className="text-blue-600 font-black flex items-center gap-1 cursor-pointer"><Volume2 size={14} /> VOICE</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['Fever', 'Cough', 'Diarrhea', 'Rash', 'Vomiting', 'Breathless'].map(s => (
                    <button
                      key={s}
                      onClick={() => toggleSymptom(s)}
                      className={`py-3 px-4 rounded-xl border-2 font-bold text-xs transition-all flex items-center justify-between ${visitForm.symptoms.includes(s) ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-slate-600 border-slate-100'}`}
                    >
                      {s}
                      {visitForm.symptoms.includes(s) && <CheckCircle2 size={12} />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload Photo Section */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex justify-between items-center">
                  {lang.photoLabel}
                  <span className="text-[9px] font-bold text-slate-400">(PDF/JPG/PNG)</span>
                </label>
                
                {visitForm.photo ? (
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-white group shadow-sm aspect-video flex items-center justify-center">
                    <img src={visitForm.photo} alt="Symptom preview" className="max-h-full max-w-full object-contain" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                      <button onClick={removePhoto} className="bg-white text-red-600 p-3 rounded-full shadow-xl">
                        <Trash2 size={24} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => photoInputRef.current?.click()}
                    className="w-full bg-white border-2 border-dashed border-slate-300 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 hover:border-blue-600 hover:bg-blue-50 transition-all active:scale-95 group"
                  >
                    <div className="bg-blue-100 text-blue-600 p-4 rounded-full group-hover:scale-110 transition-transform">
                      <Camera size={32} />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-black text-slate-700 uppercase">{lang.takePhoto}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">TAP TO OPEN CAMERA</p>
                    </div>
                    <input 
                      type="file" 
                      ref={photoInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      capture="environment" 
                      onChange={handlePhotoUpload} 
                    />
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-4 pt-4">
                <button 
                  onClick={() => handleLogVisit(false)}
                  disabled={isAnalyzing}
                  className="w-full bg-emerald-600 text-white p-5 rounded-2xl font-black text-lg shadow-lg flex items-center justify-center gap-2 hover:bg-emerald-700 active:scale-95 transition-all"
                >
                  {isAnalyzing ? 'SYNCING...' : 'SAVE VISIT'}
                </button>
                <button 
                  onClick={() => handleLogVisit(true)}
                  disabled={isAnalyzing}
                  className="w-full bg-red-600 text-white p-5 rounded-2xl font-black text-lg shadow-lg flex items-center justify-center gap-2 hover:bg-red-700 active:scale-95 transition-all"
                >
                  {isAnalyzing ? 'SYNCING...' : lang.refer}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab: TRACKING (MATERNAL & CHILD) */}
        {activeTab === 'track' && (
          <div className="p-6 space-y-8 animate-in slide-in-from-left-4 duration-300">
            <div>
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-6">Health Tracking</h2>
              
              <div className="space-y-8">
                {/* Maternal Tracking */}
                <section className="space-y-4">
                  <h3 className="text-xs font-black text-rose-500 uppercase tracking-widest flex items-center gap-2">
                    <Heart size={16} /> Maternal Tracking
                  </h3>
                  <div className="space-y-3">
                    {pregnantWomen.map(p => (
                      <div key={p.id} className="bg-white p-4 rounded-2xl border shadow-sm flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-black text-slate-800">{p.name}</h4>
                          <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">DUE: {p.due}</p>
                        </div>
                        <span className={`text-[9px] font-black px-2 py-1 rounded uppercase ${p.risk === 'High Risk' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                          {p.risk}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Child Immunization */}
                <section className="space-y-4">
                  <h3 className="text-xs font-black text-blue-500 uppercase tracking-widest flex items-center gap-2">
                    <Baby size={16} /> Child Immunization
                  </h3>
                  <div className="space-y-3">
                    {childImmunization.map(c => (
                      <div key={c.id} className="bg-white p-4 rounded-2xl border shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.status === 'Done' ? 'bg-emerald-100 text-emerald-600' : c.status === 'Overdue' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                            <Activity size={18} />
                          </div>
                          <div>
                            <h4 className="text-sm font-black text-slate-800">{c.name}</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{c.vaccine} • DUE: {c.due}</p>
                          </div>
                        </div>
                        <button className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${c.status === 'Done' ? 'bg-slate-100 text-slate-400' : 'bg-[#0d47a1] text-white shadow-md active:scale-95'}`}>
                          {c.status === 'Done' ? 'DONE' : 'UPDATE'}
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>
        )}

        {/* Tab: MORE (ADMIN / SETTINGS) */}
        {activeTab === 'more' && (
          <div className="p-6 space-y-8 animate-in fade-in duration-300">
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">More Actions</h2>
            
            <div className="space-y-4">
              {[
                { label: 'Outbreak Symptom Report', icon: <AlertCircle />, color: 'text-amber-600', bg: 'bg-amber-50' },
                { label: 'Request PHC Restock', icon: <Stethoscope />, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Incentive History', icon: <CreditCard />, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                { label: 'App Settings & Sync', icon: <MoreHorizontal />, color: 'text-slate-600', bg: 'bg-slate-50' },
              ].map((item, i) => (
                <button key={i} className="w-full bg-white p-5 rounded-3xl border shadow-sm flex items-center justify-between group active:bg-slate-50 transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`${item.bg} ${item.color} w-10 h-10 rounded-2xl flex items-center justify-center`}>
                      {item.icon}
                    </div>
                    <span className="text-sm font-black text-slate-700">{item.label}</span>
                  </div>
                  <ChevronRight size={18} className="text-slate-300 group-hover:text-slate-600" />
                </button>
              ))}
            </div>

            <div className="mt-12 text-center space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Digi-Health India v1.2.4</p>
              <p className="text-[9px] text-slate-400 font-medium">Synced at 12:45 PM today</p>
            </div>
          </div>
        )}
      </main>

      {/* Referral Confirmation Modal */}
      {showReferralConfirm && (
        <div className="fixed inset-0 z-[100] bg-[#0d47a1]/90 backdrop-blur-md flex items-center justify-center p-8 text-center text-white animate-in zoom-in-95 duration-300">
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-full inline-block text-[#0d47a1] shadow-[0_0_50px_rgba(255,255,255,0.4)]">
              <CheckCircle2 size={64} />
            </div>
            <h3 className="text-4xl font-black uppercase tracking-tighter leading-none">REFERRAL SENT</h3>
            <p className="text-xl font-bold opacity-80 uppercase tracking-[0.2em]">PHC ALERTED • AMBULANCE QUEUED</p>
            <button 
              onClick={() => setShowReferralConfirm(false)}
              className="mt-8 bg-white text-[#0d47a1] px-12 py-4 rounded-full font-black text-lg uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
            >
              OKAY
            </button>
          </div>
        </div>
      )}

      {/* 5. Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-slate-100 flex items-center justify-around px-2 py-3 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] max-w-lg mx-auto">
        <button 
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'home' ? 'text-[#0d47a1]' : 'text-slate-300'}`}
        >
          <Home size={22} className={activeTab === 'home' ? 'scale-110' : ''} />
          <span className="text-[9px] font-black uppercase tracking-tighter">{lang.home}</span>
        </button>
        <button 
          onClick={() => setActiveTab('tasks')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'tasks' ? 'text-[#0d47a1]' : 'text-slate-300'}`}
        >
          <ClipboardList size={22} className={activeTab === 'tasks' ? 'scale-110' : ''} />
          <span className="text-[9px] font-black uppercase tracking-tighter">{lang.tasks}</span>
        </button>
        <div className="relative -mt-10">
          <button 
            onClick={() => setActiveTab('log')}
            className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-xl transition-all active:scale-90 ${activeTab === 'log' ? 'bg-[#1e2b58] scale-110' : 'bg-[#0d47a1]'}`}
          >
            <Plus size={32} />
          </button>
        </div>
        <button 
          onClick={() => setActiveTab('track')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'track' ? 'text-[#0d47a1]' : 'text-slate-300'}`}
        >
          <Users size={22} className={activeTab === 'track' ? 'scale-110' : ''} />
          <span className="text-[9px] font-black uppercase tracking-tighter">{lang.tracking}</span>
        </button>
        <button 
          onClick={() => setActiveTab('more')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'more' ? 'text-[#0d47a1]' : 'text-slate-300'}`}
        >
          <MoreHorizontal size={22} className={activeTab === 'more' ? 'scale-110' : ''} />
          <span className="text-[9px] font-black uppercase tracking-tighter">{lang.more}</span>
        </button>
      </nav>

      {/* Global Sync Indicator Overlay */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 bg-amber-500 text-white text-[10px] font-black uppercase py-1 text-center z-[60] animate-in slide-in-from-top-full duration-500">
          Offline Mode Active • Data stored locally
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-in-from-right { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slide-in-from-bottom { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-in { animation-fill-mode: both; }
        .fade-in { animation-name: fade-in; }
        .slide-in-from-right-4 { animation-name: slide-in-from-right; }
        .slide-in-from-bottom-4 { animation-name: slide-in-from-bottom; }
      `}} />
    </div>
  );
};

export default AshaModule;
