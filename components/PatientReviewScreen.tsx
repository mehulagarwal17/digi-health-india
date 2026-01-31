
import React, { useState, useEffect, useRef } from 'react';
import { Patient, RiskLevel, PatientStatus, HospitalStats } from '../types';
import MedicalReportModal from './MedicalReportModal';
import { gemini } from '../services/geminiService';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Clock, 
  Thermometer, 
  Activity, 
  BrainCircuit, 
  AlertTriangle, 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  Hospital, 
  Navigation, 
  CheckCircle2, 
  Save,
  MapPin,
  Stethoscope,
  Lock,
  ExternalLink,
  Send,
  Loader2,
  User
} from 'lucide-react';

interface PatientReviewScreenProps {
  patient: Patient;
  onBack: () => void;
  onUpdate: (id: string, updates: Partial<Patient>) => void;
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

const PatientReviewScreen: React.FC<PatientReviewScreenProps> = ({ patient, onBack, onUpdate }) => {
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [doctorNote, setDoctorNote] = useState('');
  const [tempSeverity, setTempSeverity] = useState(patient.severity);
  const [tempStatus, setTempStatus] = useState(patient.status);
  
  // Chat state
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'model', 
      text: patient.aiReasoning || "I have analyzed this patient's profile. How can I assist you with clinical reasoning or guideline-based criteria?" 
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatSessionRef = useRef<any>(null);

  // Initialize Chat Session
  useEffect(() => {
    chatSessionRef.current = gemini.createClinicalChat(patient);
  }, [patient.id]);

  // Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const userMessage = inputValue.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInputValue('');
    setIsTyping(true);

    try {
      const responseStream = await chatSessionRef.current.sendMessageStream({ message: userMessage });
      let fullResponse = '';
      
      // Append an empty model message to stream into
      setMessages(prev => [...prev, { role: 'model', text: '' }]);

      for await (const chunk of responseStream) {
        const textChunk = chunk.text;
        fullResponse += textChunk;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { role: 'model', text: fullResponse };
          return newMessages;
        });
      }
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Error: Could not connect to clinical AI service. Please verify network connection." }]);
    } finally {
      setIsTyping(false);
    }
  };

  // Mock nearby hospitals for referral
  const nearbyHospitals: HospitalStats[] = [
    { id: 'H-01', name: 'District General Hospital', totalBeds: 200, availableBeds: 12, icuAvailable: true, oxygenStock: 90, emergencyStatus: 'Active' },
    { id: 'H-02', name: 'Regional Specialty Center', totalBeds: 150, availableBeds: 0, icuAvailable: false, oxygenStock: 45, emergencyStatus: 'Full' }
  ];

  const handleSave = () => {
    onUpdate(patient.id, {
      severity: tempSeverity,
      status: tempStatus,
      clinicalTimeline: [
        ...patient.clinicalTimeline,
        {
          date: new Date().toISOString(),
          note: doctorNote || 'Status updated during clinical review.',
          recordedBy: 'Dr. Satish Kumar',
          role: 'PHC Doctor',
          type: 'Update'
        }
      ]
    });
    alert('Patient record updated successfully.');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 pb-20">
      {/* Institutional Header */}
      <header className="bg-[#1e2b58] text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <ArrowLeft size={20} />
            </button>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h2 className="text-xl font-bold tracking-tight">{patient.id}</h2>
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                  patient.status === PatientStatus.REFERRED ? 'bg-orange-500' : 
                  patient.status === PatientStatus.RECOVERED ? 'bg-emerald-500' : 'bg-blue-500'
                }`}>
                  {patient.status}
                </span>
              </div>
              <p className="text-xs text-blue-200/80 font-medium flex items-center gap-1.5">
                {patient.age}y {patient.gender} • {patient.village} • Reported by: {patient.reportingSource}
              </p>
            </div>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-[10px] text-blue-300 font-bold uppercase tracking-widest">Last Synced</p>
            <p className="text-xs font-medium">{new Date(patient.timestamp).toLocaleString()}</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Clinical Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 1. Clinical Snapshot */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Clinical Severity</p>
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full animate-pulse ${
                    patient.severity === 'Critical' ? 'bg-red-500' : patient.severity === 'Serious' ? 'bg-orange-500' : 'bg-emerald-500'
                  }`} />
                  <span className="text-xl font-black text-slate-800">{patient.severity}</span>
                </div>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Latest Vitals</p>
                <div className="flex gap-4">
                  <div>
                    <span className="text-xl font-black text-slate-800">{patient.vitals.temp}°F</span>
                    <p className="text-[10px] font-bold text-slate-400">TEMP</p>
                  </div>
                  <div className="border-l pl-4">
                    <span className="text-xl font-black text-slate-800">{patient.vitals.pulse}</span>
                    <p className="text-[10px] font-bold text-slate-400">PULSE</p>
                  </div>
                  {patient.vitals.bp && (
                    <div className="border-l pl-4">
                      <span className="text-xl font-black text-slate-800">{patient.vitals.bp}</span>
                      <p className="text-[10px] font-bold text-slate-400">BP</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">AI Risk Index</p>
                <div className={`text-xl font-black flex items-center gap-2 ${
                  patient.riskLevel === RiskLevel.HIGH ? 'text-red-600' : patient.riskLevel === RiskLevel.MEDIUM ? 'text-orange-600' : 'text-emerald-600'
                }`}>
                  <Activity size={20} /> {patient.riskLevel}
                </div>
              </div>
            </section>

            {/* 2. Symptom & Timeline */}
            <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Clock size={18} className="text-slate-400" /> Clinical Timeline
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                  {patient.clinicalTimeline.map((event, idx) => (
                    <div key={idx} className="relative flex items-start gap-6 group">
                      <div className={`absolute left-0 w-10 h-10 rounded-full border-4 border-white flex items-center justify-center z-10 transition-transform group-hover:scale-110 ${
                        event.type === 'Symptom' ? 'bg-blue-100 text-blue-600' : 
                        event.type === 'Diagnosis' ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {event.type === 'Symptom' ? <Activity size={16} /> : <FileText size={16} />}
                      </div>
                      <div className="ml-12 pt-1 pb-4 flex-1 border-b border-slate-50 last:border-0">
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{event.type}</p>
                          <p className="text-[10px] font-bold text-slate-400">{new Date(event.date).toLocaleDateString()} {new Date(event.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                        </div>
                        <p className="text-sm font-semibold text-slate-800 leading-relaxed mb-2">{event.note}</p>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                          <span className="bg-slate-100 px-2 py-0.5 rounded">{event.recordedBy}</span>
                          <span>•</span>
                          <span>{event.role}</span>
                          {event.progression && (
                            <>
                              <span>•</span>
                              <span className={event.progression === 'Worsening' ? 'text-red-500' : 'text-emerald-600'}>{event.progression}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 3. PREVIOUS CLINICAL RECORDS (Consent-Based) */}
            <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <button 
                onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
                className="w-full px-6 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2 text-slate-800 font-black uppercase text-xs tracking-widest">
                    <Lock size={14} className="text-[#0d47a1]" />
                    Previous Clinical Records (Consent-Based)
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold mt-0.5 ml-5">
                    Displayed only when patient consent and authorized data access exist.
                  </p>
                </div>
                {isHistoryExpanded ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
              </button>
              
              {isHistoryExpanded && (
                <div className="px-6 pb-6 pt-4 space-y-8 border-t border-slate-50 animate-in slide-in-from-top-2">
                  {!patient.previousCare ? (
                    <div className="py-10 text-center text-slate-400 italic text-sm font-medium">
                      No consented prior records available.
                    </div>
                  ) : (
                    <>
                      {/* Last Treating Facility */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                            <Hospital size={12} /> Last Treating Facility
                          </p>
                          <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                            <p className="text-sm font-black text-slate-800">{patient.previousCare.lastFacility}</p>
                            <p className="text-xs text-slate-600 mt-1 font-medium">{patient.previousCare.facilityType}</p>
                            <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] font-bold text-slate-400">
                              <div>
                                <span className="block uppercase tracking-tighter opacity-70">Location</span>
                                <span className="text-slate-600">{patient.previousCare.location}</span>
                              </div>
                              <div>
                                <span className="block uppercase tracking-tighter opacity-70">Last Visit</span>
                                <span className="text-slate-600">{patient.previousCare.lastVisitDate}</span>
                              </div>
                              <div className="mt-1">
                                <span className="block uppercase tracking-tighter opacity-70">Encounter</span>
                                <span className="text-slate-600">{patient.previousCare.encounterType}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Prior Diagnosis Summary */}
                        <div className="space-y-3">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                            <Stethoscope size={12} /> Prior Diagnosis Summary
                          </p>
                          <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 min-h-[100px] flex items-center italic">
                            <p className="text-sm font-semibold text-slate-700 leading-relaxed">
                              "{patient.previousCare.priorDiagnosis}"
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Investigations & Tests */}
                      <div className="space-y-3">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                          <Activity size={12} /> Investigations & Tests
                        </p>
                        <div className="bg-white rounded-xl overflow-hidden border border-slate-200">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                                <th className="px-4 py-3 text-[10px]">Test Name</th>
                                <th className="px-4 py-3 text-[10px]">Status</th>
                                <th className="px-4 py-3 text-[10px]">Key Finding Summary</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {patient.previousCare.investigations.map((inv, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="px-4 py-3.5 font-bold text-slate-700">{inv.test}</td>
                                  <td className="px-4 py-3.5">
                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                      inv.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'
                                    }`}>
                                      {inv.status}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3.5 text-slate-500 font-medium italic">
                                    {inv.findings}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <p className="text-[9px] text-slate-400 italic">No raw lab reports or full diagnostic files available for cross-facility viewing.</p>
                      </div>

                      {/* Last Medical Report */}
                      <div className="space-y-3">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                          <FileText size={12} /> Last Medical Report
                        </p>
                        <div className="flex items-center justify-between p-4 bg-[#f1f5f9] rounded-xl border border-slate-200">
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-white rounded-lg border border-slate-200 text-[#0d47a1]">
                              <FileText size={20} />
                            </div>
                            <div>
                              <p className="text-sm font-black text-slate-800">{patient.previousCare.reportType}</p>
                              <p className="text-[10px] font-bold text-slate-500 uppercase">
                                {patient.previousCare.lastFacility} • {patient.previousCare.lastVisitDate}
                              </p>
                            </div>
                          </div>
                          <button 
                            onClick={() => setIsReportModalOpen(true)}
                            className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200 text-xs font-bold text-[#0d47a1] hover:bg-slate-50 shadow-sm transition-all group"
                          >
                            View Read-Only Report (PDF)
                            <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                          </button>
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Read-only clinical document</p>
                      </div>

                      {/* Consent & Source Indicator */}
                      <div className="pt-6 border-t border-slate-50">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center flex items-center justify-center gap-2">
                          <ShieldCheck size={10} className="text-emerald-600" />
                          Records shown are consented and accessed via interoperable health data systems (ABHA-ready).
                        </p>
                      </div>
                    </>
                  )}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar: AI & Actions */}
          <div className="space-y-6">
            
            {/* AI Clinical Insights Chat */}
            <section className="bg-white rounded-2xl border-2 border-blue-50 p-0 shadow-sm overflow-hidden relative flex flex-col h-[600px]">
              {/* Header */}
              <div className="p-5 border-b border-blue-50 bg-white sticky top-0 z-10 shrink-0">
                <h3 className="text-lg font-bold text-blue-900 flex items-center gap-2">
                  <BrainCircuit size={20} className="text-blue-600" /> Clinical Decision Support
                </h3>
                <div className="bg-blue-50/50 p-2 rounded-lg border border-blue-100 mt-3">
                  <p className="text-[10px] font-bold text-blue-700 uppercase mb-0.5">AI Preliminary Assessment</p>
                  <p className="text-sm font-black text-blue-900">{patient.aiDiagnosis || 'Processing...'}</p>
                </div>
              </div>

              {/* Chat Disclaimer */}
              <div className="bg-slate-50 px-5 py-2 border-b border-slate-100 flex items-start gap-2 shrink-0">
                <AlertTriangle size={12} className="text-orange-500 mt-0.5 shrink-0" />
                <p className="text-[9px] text-slate-500 font-bold leading-tight uppercase tracking-tighter italic">
                  AI for decision support only. Final clinical decisions made by doctor.
                </p>
              </div>

              {/* Message Display */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl p-3 shadow-sm ${
                      msg.role === 'user' 
                      ? 'bg-[#0d47a1] text-white rounded-tr-none' 
                      : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                    }`}>
                      <div className="flex items-center gap-2 mb-1 opacity-60">
                        {msg.role === 'user' ? (
                          <>
                            <span className="text-[9px] font-bold uppercase">Doctor</span>
                            <Stethoscope size={10} />
                          </>
                        ) : (
                          <>
                            <BrainCircuit size={10} />
                            <span className="text-[9px] font-bold uppercase">AI Clinical Support</span>
                          </>
                        )}
                      </div>
                      <div className="text-xs leading-relaxed font-medium whitespace-pre-wrap">
                        {msg.text || (idx === messages.length - 1 && isTyping && <Loader2 size={14} className="animate-spin" />)}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-4 bg-white border-t border-slate-100 shrink-0">
                <form onSubmit={handleSendMessage} className="relative">
                  <input 
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    disabled={isTyping}
                    placeholder="Ask AI for clinical support..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-4 pr-12 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all placeholder:italic"
                  />
                  <button 
                    type="submit"
                    disabled={!inputValue.trim() || isTyping}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#0d47a1] text-white rounded-lg hover:bg-blue-800 disabled:opacity-30 transition-all shadow-md"
                  >
                    {isTyping ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  </button>
                </form>
              </div>
            </section>

            {/* Outbreak Context */}
            <section className="bg-[#1e2b58] text-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-sm font-bold flex items-center gap-2 mb-4">
                <MapPin size={16} className="text-blue-400" /> Regional Context
              </h3>
              <div className="space-y-4">
                <div className="bg-white/10 p-3 rounded-xl border border-white/5">
                  <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest mb-1">Local Trend: {patient.village}</p>
                  <p className="text-xs leading-relaxed">
                    Patient matches a rising cluster of <span className="font-bold text-blue-300">Viral Syndromes</span> detected in the last 48 hours.
                  </p>
                </div>
              </div>
            </section>

            {/* Doctor Action Panel */}
            <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xl space-y-6 sticky top-24">
              <h3 className="font-black text-slate-800 flex items-center gap-2 uppercase text-xs tracking-widest">
                <Stethoscope size={16} className="text-[#0d47a1]" /> Decision Workspace
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Update Severity</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Normal', 'Serious', 'Critical'].map(s => (
                      <button 
                        key={s}
                        onClick={() => setTempSeverity(s as any)}
                        className={`text-[10px] font-bold py-2 rounded-lg border transition-all ${
                          tempSeverity === s 
                          ? 'bg-[#0d47a1] text-white border-[#0d47a1] shadow-md' 
                          : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Patient Status</label>
                  <select 
                    value={tempStatus}
                    onChange={(e) => setTempStatus(e.target.value as PatientStatus)}
                    className="w-full text-xs font-bold bg-white border border-slate-200 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 shadow-sm focus:outline-none"
                  >
                    {Object.values(PatientStatus).map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Clinical Notes</label>
                  <textarea 
                    rows={4}
                    placeholder="Enter diagnosis or observation notes..."
                    className="w-full text-xs font-medium bg-slate-50 text-slate-900 border border-slate-200 rounded-lg p-3 placeholder:italic focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-inner"
                    value={doctorNote}
                    onChange={(e) => setDoctorNote(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-2">
                <button 
                  onClick={handleSave}
                  className="w-full bg-[#0d47a1] text-white py-3.5 rounded-xl font-bold text-sm shadow-lg hover:bg-blue-800 flex items-center justify-center gap-2 transition-transform active:scale-95"
                >
                  <Save size={16} /> Finalize Clinical Review
                </button>
              </div>

              {tempStatus === PatientStatus.REFERRED && (
                <div className="pt-4 mt-4 border-t border-slate-100 animate-in fade-in zoom-in-95">
                  <h4 className="text-[10px] font-bold text-red-600 uppercase mb-3 flex items-center gap-1.5">
                    <Hospital size={12} /> Emergency Escalation
                  </h4>
                  <div className="space-y-3">
                    {nearbyHospitals.map(h => (
                      <div key={h.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center group cursor-pointer hover:border-blue-300">
                        <div>
                          <p className="text-xs font-bold text-slate-800 group-hover:text-blue-700">{h.name}</p>
                          <p className={`text-[9px] font-bold ${h.availableBeds > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                            {h.availableBeds > 0 ? `${h.availableBeds} Beds Available` : 'Facility Full'}
                          </p>
                        </div>
                        <button className="bg-white p-1.5 rounded-lg border border-slate-200 text-slate-400 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all">
                          <Navigation size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
            
            {/* Audit Minimal */}
            <div className="text-center pt-4">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                Authorized: Dr. Satish Kumar (ID: PHC-6621) • {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Medical Report PDF Modal */}
      <MedicalReportModal 
        isOpen={isReportModalOpen} 
        onClose={() => setIsReportModalOpen(false)} 
        patientId={patient.id} 
      />
    </div>
  );
};

export default PatientReviewScreen;
