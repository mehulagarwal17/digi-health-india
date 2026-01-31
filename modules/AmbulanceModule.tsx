
import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Navigation, 
  Hospital, 
  Zap, 
  AlertTriangle, 
  Bed, 
  Activity, 
  User, 
  Ambulance, 
  CheckCircle2, 
  Wifi, 
  Clock,
  ChevronRight,
  ShieldAlert,
  Map as MapIcon,
  Phone,
  ShieldCheck,
  // Added missing ArrowRight icon
  ArrowRight
} from 'lucide-react';

type AmbulanceStatus = 'Available' | 'On Assignment' | 'Offline';
type AssignmentStep = 'Awaiting' | 'Assigned' | 'Accepted' | 'PickedUp' | 'EnRoute' | 'Reached' | 'Completed';

const AmbulanceModule: React.FC = () => {
  const [status, setStatus] = useState<AmbulanceStatus>('Available');
  const [step, setStep] = useState<AssignmentStep>('Awaiting');
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  // Institutional Colors from Login Page
  const navy = '#1e2b58';
  const primaryBlue = '#0d47a1';

  // Mock data for the emergency case
  const currentCase = {
    id: 'DHI-EM-8842',
    requestTime: '12:42 PM',
    pickupLocation: 'H.No 42, West Rampur Village',
    severity: 'Critical',
    symptomNote: 'Acute Respiratory Distress / Chest Pain',
    patientAgeGroup: '60+',
    patientGender: 'Male',
    riskFlag: 'Respiratory Distress'
  };

  const recommendedHospital = {
    name: 'District General Hospital',
    distance: '5.4 km',
    eta: '11 mins',
    beds: 8,
    icu: 2
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000 * 60);
    return () => clearInterval(timer);
  }, []);

  // Simulate an incoming assignment for the prototype
  useEffect(() => {
    if (step === 'Awaiting') {
      const timeout = setTimeout(() => {
        setStep('Assigned');
        setStatus('On Assignment');
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [step]);

  const handleStepChange = (newStep: AssignmentStep) => {
    setStep(newStep);
    if (newStep === 'Completed') {
      setStatus('Available');
      // Reset back to awaiting after a delay for prototype loop
      setTimeout(() => setStep('Awaiting'), 10000);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col bg-slate-100 font-sans antialiased text-slate-900 overflow-hidden">
      
      {/* 1. HEADER (ALWAYS VISIBLE) - THEMED TO MATCH LOGIN PANEL */}
      <header className="bg-[#1e2b58] text-white px-6 py-4 flex flex-wrap justify-between items-center shadow-lg border-b-4 border-[#0d47a1] shrink-0 z-40 relative">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 border-r border-white/10 pr-6">
            <div className="bg-[#0d47a1] p-2.5 rounded-lg shadow-inner">
              <User size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold leading-none">Rajesh Kumar</h2>
              <p className="text-[9px] font-bold text-blue-300 uppercase tracking-widest mt-1">Vehicle: AMB-9921-R</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${
                status === 'Available' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 
                status === 'On Assignment' ? 'bg-blue-400 shadow-[0_0_8px_#60a5fa]' : 'bg-slate-500'
              }`} />
              <h2 className={`text-xs font-black uppercase tracking-widest ${
                status === 'Available' ? 'text-emerald-400' : 'text-blue-300'
              }`}>{status}</h2>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
            <MapPin size={14} className="text-red-400" />
            <span className="text-[10px] font-bold text-slate-300 tracking-tighter">28.61° N, 77.20° E</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-400">
            <Wifi size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Online</span>
          </div>
          <div className="text-xl font-black tabular-nums tracking-tighter border-l border-white/10 pl-6 ml-2">
            {time}
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* 2 & 3. CURRENT ASSIGNMENT PANEL (PRIMARY FOCUS) */}
        <aside className="w-full lg:w-[420px] bg-white border-r border-slate-200 overflow-y-auto flex flex-col shrink-0 z-30 shadow-xl">
          
          {step === 'Awaiting' ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-slate-50">
              <div className="w-24 h-24 rounded-full bg-slate-200 flex items-center justify-center mb-6 animate-pulse">
                <ShieldCheck size={48} className="text-slate-400" />
              </div>
              <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Awaiting Assignment...</h3>
              <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-[0.2em]">Live system scanning active</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              
              {/* CURRENT ASSIGNMENT SECTION */}
              <div className={`p-6 border-b-4 ${currentCase.severity === 'Critical' ? 'bg-red-50 border-red-500' : 'bg-blue-50 border-[#0d47a1]'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="bg-[#1e2b58] text-white text-[9px] font-black px-2 py-1 rounded tracking-widest uppercase">
                      ID: {currentCase.id}
                    </span>
                    <p className="text-[9px] font-bold text-slate-500 uppercase mt-1.5">Request: {currentCase.requestTime}</p>
                  </div>
                  {currentCase.severity === 'Critical' && (
                    <div className="bg-red-600 text-white p-2 rounded-lg shadow-lg animate-bounce">
                      <Zap size={16} fill="currentColor" />
                    </div>
                  )}
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm mb-4">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Pickup Location</p>
                  <div className="flex items-start gap-2.5">
                    <MapPin size={22} className="text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-lg font-black text-[#1e2b58] leading-tight">{currentCase.pickupLocation}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-white/60 p-3 rounded-xl border border-slate-200">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Severity</p>
                    <p className={`text-sm font-black uppercase ${currentCase.severity === 'Critical' ? 'text-red-600' : 'text-[#0d47a1]'}`}>
                      {currentCase.severity}
                    </p>
                  </div>
                  <div className="bg-white/60 p-3 rounded-xl border border-slate-200">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                    <p className="text-sm font-black text-slate-700 uppercase">{step}</p>
                  </div>
                </div>

                {step === 'Assigned' && (
                  <button 
                    onClick={() => handleStepChange('Accepted')}
                    className="w-full bg-[#0d47a1] text-white py-4 rounded-xl font-black text-xl shadow-lg hover:bg-blue-800 active:scale-[0.98] transition-all flex items-center justify-center gap-3 border-b-4 border-blue-900"
                  >
                    ACCEPT CASE
                    <ChevronRight size={24} />
                  </button>
                )}
              </div>

              {/* SMART RECOMMENDATION & WORKFLOW (POST-ACCEPTANCE) */}
              {['Accepted', 'PickedUp', 'EnRoute', 'Reached'].includes(step) && (
                <div className="p-6 space-y-6 flex-1 flex flex-col">
                  
                  {/* AI Hospital Recommendation */}
                  <section>
                    <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <ShieldCheck size={12} className="text-[#0d47a1]" /> AI Hospital Recommendation
                    </h4>
                    <div className="bg-white rounded-2xl border-2 border-[#0d47a1] p-4 shadow-md relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-[#0d47a1] text-white px-2 py-0.5 text-[8px] font-black uppercase tracking-widest rounded-bl-lg">
                        Optimal Path
                      </div>
                      <h5 className="text-base font-black text-[#1e2b58] mb-2">{recommendedHospital.name}</h5>
                      <div className="flex gap-4 mb-4">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase">
                          <Navigation size={12} className="text-blue-500" /> {recommendedHospital.distance}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-orange-600 uppercase">
                          <Clock size={12} /> {recommendedHospital.eta} ETA
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-100 flex items-center justify-center gap-2">
                          <Bed size={14} className="text-emerald-600" />
                          <span className="text-[10px] font-black text-emerald-800">{recommendedHospital.beds} Beds</span>
                        </div>
                        <div className="bg-blue-50 p-2 rounded-lg border border-blue-100 flex items-center justify-center gap-2">
                          <Activity size={14} className="text-blue-600" />
                          <span className="text-[10px] font-black text-blue-800">{recommendedHospital.icu} ICU</span>
                        </div>
                      </div>
                      <button className="w-full bg-[#1e2b58] text-white py-2.5 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-black transition-all">
                        Navigate to Hospital
                      </button>
                    </div>
                  </section>

                  {/* MINIMAL PATIENT CONTEXT */}
                  <section className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Patient Context</h4>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">Profile</p>
                        <p className="font-black text-slate-800">{currentCase.patientAgeGroup} • {currentCase.patientGender}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">Risk Flag</p>
                        <p className="font-black text-red-600">{currentCase.riskFlag}</p>
                      </div>
                    </div>
                  </section>

                  {/* ALERTS SECTION */}
                  <section className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3">
                    <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-[11px] font-bold text-amber-900 leading-tight">
                      Severe case priority: Clear lanes for cardiac emergency reported at sector intersection.
                    </p>
                  </section>
                </div>
              )}
            </div>
          )}

          {/* SHIFT SUMMARY (SECONDARY) */}
          <div className="mt-auto p-4 bg-slate-100 border-t border-slate-200 flex justify-between items-center text-[9px] font-black text-slate-400 uppercase tracking-widest">
            <span>Shift: 04 Cases</span>
            <span>06h 12m Active</span>
          </div>
        </aside>

        {/* 4. LIVE MAP AREA (CORE) */}
        <main className="flex-1 relative bg-slate-200 flex flex-col overflow-hidden">
          
          {/* MAP CANVAS PLACEHOLDER */}
          <div className="flex-1 relative bg-[#e5e7eb] flex items-center justify-center">
            {/* Background Texture from Login */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 pointer-events-none"></div>
            
            <div className="text-center opacity-30 select-none">
              <MapIcon size={120} className="mx-auto mb-4" />
              <h2 className="text-2xl font-black uppercase tracking-[0.2em]">Live Map Feed</h2>
              <p className="text-sm font-bold mt-1 uppercase">Routing Layer: Active</p>
            </div>

            {/* Simulated Markers */}
            <div className="absolute top-1/4 left-1/4 animate-bounce">
              <div className="bg-white p-2 rounded-xl shadow-xl border-2 border-red-500 flex items-center gap-2">
                <MapPin size={16} className="text-red-500" />
                <span className="text-[10px] font-black uppercase">Patient Location</span>
              </div>
            </div>
            <div className="absolute bottom-1/4 right-1/3">
              <div className="bg-white p-2 rounded-xl shadow-xl border-2 border-[#0d47a1] flex items-center gap-2">
                <Hospital size={16} className="text-[#0d47a1]" />
                <span className="text-[10px] font-black uppercase">Destination Hosp.</span>
              </div>
            </div>
          </div>

          {/* 5. QUICK STATUS UPDATE BUTTONS (FLOATING FOOTER) */}
          {['Accepted', 'PickedUp', 'EnRoute', 'Reached'].includes(step) && (
            <div className="absolute bottom-8 left-8 right-8 flex gap-4">
              <div className="flex-1 bg-white/90 backdrop-blur-md p-5 rounded-3xl shadow-2xl border-4 border-[#1e2b58] flex gap-4">
                {step === 'Accepted' && (
                  <button 
                    onClick={() => handleStepChange('PickedUp')}
                    className="flex-1 bg-[#1e2b58] text-white py-6 rounded-2xl font-black text-2xl uppercase tracking-tighter shadow-lg hover:bg-black transition-all flex items-center justify-center gap-4"
                  >
                    PATIENT PICKED UP
                    <ArrowRight size={28} />
                  </button>
                )}
                {step === 'PickedUp' && (
                  <button 
                    onClick={() => handleStepChange('EnRoute')}
                    className="flex-1 bg-[#0d47a1] text-white py-6 rounded-2xl font-black text-2xl uppercase tracking-tighter shadow-lg hover:bg-blue-800 transition-all flex items-center justify-center gap-4"
                  >
                    EN ROUTE TO HOSP.
                    <Navigation size={28} />
                  </button>
                )}
                {step === 'EnRoute' && (
                  <button 
                    onClick={() => handleStepChange('Reached')}
                    className="flex-1 bg-indigo-700 text-white py-6 rounded-2xl font-black text-2xl uppercase tracking-tighter shadow-lg hover:bg-indigo-900 transition-all flex items-center justify-center gap-4"
                  >
                    REACHED HOSPITAL
                    <Hospital size={28} />
                  </button>
                )}
                {step === 'Reached' && (
                  <button 
                    onClick={() => handleStepChange('Completed')}
                    className="flex-1 bg-emerald-600 text-white py-6 rounded-2xl font-black text-2xl uppercase tracking-tighter shadow-lg hover:bg-emerald-800 transition-all flex items-center justify-center gap-4"
                  >
                    CASE COMPLETED
                    <CheckCircle2 size={28} />
                  </button>
                )}
                <button className="bg-slate-200 text-slate-800 px-10 py-6 rounded-2xl font-black text-xl flex items-center gap-3">
                  <Phone size={24} /> HELP
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MISSION COMPLETE OVERLAY */}
      {step === 'Completed' && (
        <div className="fixed inset-0 z-[100] bg-emerald-600 flex flex-col items-center justify-center text-white p-12 text-center animate-in fade-in duration-500">
          <div className="bg-white text-emerald-600 p-8 rounded-full mb-10 shadow-2xl">
            <CheckCircle2 size={100} />
          </div>
          <h1 className="text-7xl font-black uppercase tracking-tighter mb-4">CASE COMPLETED</h1>
          <p className="text-2xl font-bold opacity-80 uppercase tracking-[0.3em] mb-12">Reporting Unit AMB-9921-R: Available</p>
          <div className="w-full max-w-xl h-3 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white animate-[progress_5s_linear_infinite]"></div>
          </div>
          <p className="mt-8 text-xs font-black uppercase opacity-60 tracking-[0.5em]">Syncing National Ledger...</p>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}} />
    </div>
  );
};

export default AmbulanceModule;
