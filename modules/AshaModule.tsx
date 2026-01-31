
import React, { useState, useRef } from 'react';
// Added ChevronRight to the imports
import { PlusCircle, History, Pill, Wifi, Camera, Upload, Scan, Loader2, CheckCircle, AlertTriangle, ChevronRight } from 'lucide-react';
import { Patient, RiskLevel, PatientStatus } from '../types';
import { gemini } from '../services/geminiService';

interface AshaModuleProps {
  onAddPatient: (p: Patient) => void;
  patients: Patient[];
}

const AshaModule: React.FC<AshaModuleProps> = ({ onAddPatient, patients }) => {
  const [view, setView] = useState<'form' | 'history' | 'stock'>('form');
  const [formData, setFormData] = useState({
    age: '20-40',
    gender: 'Female',
    village: 'Rampur',
    symptoms: [] as string[],
    temp: '98.6',
    pulse: '72'
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [visionImage, setVisionImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleSymptom = (s: string) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(s) ? prev.symptoms.filter(x => x !== s) : [...prev.symptoms, s]
    }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setVisionImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    
    let visionAnalysis = "";
    if (visionImage) {
      const base64Data = visionImage.split(',')[1];
      visionAnalysis = await gemini.analyzeVision(base64Data, formData.symptoms);
    }

    const aiResult = await gemini.analyzeSymptom(formData.symptoms, formData.age);
    
    const newPatient: Patient = {
      id: `P-${Math.floor(1000 + Math.random() * 9000)}`,
      age: formData.age,
      gender: formData.gender,
      village: formData.village,
      reportingSource: 'ASHA Field Worker',
      symptoms: formData.symptoms,
      vitals: { temp: formData.temp, pulse: formData.pulse },
      riskLevel: aiResult.risk as RiskLevel,
      severity: (aiResult.risk === 'HIGH' ? 'Critical' : aiResult.risk === 'MEDIUM' ? 'Serious' : 'Normal') as any,
      status: PatientStatus.OBSERVATION,
      timestamp: new Date().toISOString(),
      aiDiagnosis: aiResult.diagnosis,
      aiReasoning: visionAnalysis || "System analysis based on reported symptoms.",
      clinicalTimeline: [{
        date: new Date().toISOString(),
        note: `Initial Field Scan Completed. Vision Analysis: ${visionAnalysis || 'N/A'}`,
        recordedBy: 'ASHA Field Worker',
        role: 'ASHA_WORKER',
        type: 'Symptom'
      }]
    };

    onAddPatient(newPatient);
    setIsAnalyzing(false);
    setView('history');
    setFormData({ age: '20-40', gender: 'Female', village: 'Rampur', symptoms: [], temp: '98.6', pulse: '72' });
    setVisionImage(null);
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-6 min-h-screen bg-slate-50">
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-emerald-100">
        <div>
          <h1 className="text-xl font-black text-emerald-800 tracking-tighter">AI FIELD SCAN</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Duty: Sector 7</p>
        </div>
        <div className="bg-emerald-50 text-emerald-600 p-2 rounded-xl">
          <Scan size={24} />
        </div>
      </div>

      <nav className="flex gap-2 bg-slate-200/50 p-1.5 rounded-2xl">
        {['form', 'history', 'stock'].map((v) => (
          <button 
            key={v}
            onClick={() => setView(v as any)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${view === v ? 'bg-white text-emerald-700 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {v}
          </button>
        ))}
      </nav>

      {view === 'form' && (
        <form onSubmit={handleSubmit} className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-emerald-50 space-y-6">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative aspect-video rounded-3xl border-4 border-dashed border-slate-100 bg-slate-50 flex flex-col items-center justify-center cursor-pointer group hover:bg-emerald-50 hover:border-emerald-200 transition-all overflow-hidden"
            >
              {visionImage ? (
                <>
                  <img src={visionImage} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-emerald-600/20 flex items-center justify-center">
                    <div className="bg-white p-2 rounded-full shadow-lg"><CheckCircle className="text-emerald-600" /></div>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-4 bg-white rounded-full shadow-md group-hover:scale-110 transition-transform">
                    <Camera size={32} className="text-emerald-600" />
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase mt-4 tracking-widest">Diagnostic Vision Capture</p>
                </>
              )}
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileSelect} />
            </div>

            <div className="grid grid-cols-2 gap-4">
               {['Age Group', 'Gender'].map((label, i) => (
                 <div key={label}>
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">{label}</label>
                    <select 
                      className="w-full bg-slate-50 border-none rounded-2xl p-3 text-sm font-bold mt-1"
                      value={i === 0 ? formData.age : formData.gender}
                      onChange={e => i === 0 ? setFormData({...formData, age: e.target.value}) : setFormData({...formData, gender: e.target.value})}
                    >
                      {i === 0 ? ['0-12', '13-19', '20-40', '40-60', '60+'].map(o => <option key={o}>{o}</option>) : ['Male', 'Female', 'Other'].map(o => <option key={o}>{o}</option>)}
                    </select>
                 </div>
               ))}
            </div>

            <div className="space-y-3">
              <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Symptom Matrix</label>
              <div className="grid grid-cols-2 gap-2">
                {['Fever', 'Cough', 'Rashes', 'Eye Redness', 'Injury', 'Diarrhea'].map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSymptom(s)}
                    className={`p-3 rounded-2xl text-[11px] font-black border-2 transition-all text-left ${formData.symptoms.includes(s) ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg' : 'bg-white text-slate-600 border-slate-100 hover:border-slate-300'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isAnalyzing}
              className="w-full bg-[#0d47a1] text-white py-4 rounded-[1.5rem] font-black text-lg shadow-xl hover:bg-blue-800 disabled:opacity-50 transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              {isAnalyzing ? <><Loader2 className="animate-spin" /> RUNNING AI ANALYSIS...</> : <><Scan /> SYNC TO CENTRAL</>}
            </button>
          </div>
        </form>
      )}

      {view === 'history' && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
          {patients.map(p => (
            <div key={p.id} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${p.riskLevel === 'HIGH' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                  {p.riskLevel[0]}
                </div>
                <div>
                  <h4 className="font-black text-slate-800 text-sm tracking-tight">{p.id}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{p.village} • {p.age}y</p>
                </div>
              </div>
              {/* Added missing ChevronRight component here */}
              <ChevronRight className="text-slate-300" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AshaModule;
