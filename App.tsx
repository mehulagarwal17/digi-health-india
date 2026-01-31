
import React, { useState, useEffect } from 'react';
import { UserRole, Patient, RiskLevel, PatientStatus } from './types';
import LoginPage from './components/LoginPage';
import AshaModule from './modules/AshaModule';
import DoctorModule from './modules/DoctorModule';
import HospitalModule from './modules/HospitalModule';
import AmbulanceModule from './modules/AmbulanceModule';
import DHOModule from './modules/DHOModule';
import { Layout, LogOut } from 'lucide-react';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentRole, setCurrentRole] = useState<UserRole>(UserRole.ASHA_WORKER);
  const [patients, setPatients] = useState<Patient[]>([]);

  // Initial mock data with enriched clinical details
  useEffect(() => {
    const mockPatients: Patient[] = [
      {
        id: 'ABHA-9901-4421',
        age: '62',
        gender: 'Male',
        village: 'Rampur',
        reportingSource: 'ASHA-661 (Sarita Devi)',
        symptoms: ['High Grade Fever', 'Shortness of Breath'],
        vitals: { temp: '102.1', pulse: '112', bp: '140/90', respRate: '24' },
        riskLevel: RiskLevel.HIGH,
        severity: 'Critical',
        status: PatientStatus.OBSERVATION,
        timestamp: new Date().toISOString(),
        aiDiagnosis: 'Possible Severe Viral Infection / Pneumonia',
        aiReasoning: 'Combined high fever with respiratory distress in elderly patient (60+) increases risk score. Local cluster of similar symptoms detected in Rampur village.',
        aiConfidence: 0.88,
        clinicalTimeline: [
          {
            date: '2024-01-29T09:00:00Z',
            note: 'Patient reported moderate fever and dry cough.',
            recordedBy: 'Sarita Devi',
            role: 'ASHA Worker',
            type: 'Symptom',
            progression: 'Stable'
          },
          {
            date: '2024-01-31T10:15:00Z',
            note: 'Temperature spiked to 102.1F. Patient complaining of difficulty in breathing.',
            recordedBy: 'Sarita Devi',
            role: 'ASHA Worker',
            type: 'Vitals',
            progression: 'Worsening'
          }
        ],
        previousCare: {
          lastFacility: 'Rampur PHC Sector B',
          facilityType: 'Primary Health Center',
          location: 'Rampur District',
          lastVisitDate: '2023-11-12',
          encounterType: 'OPD - General Medicine',
          priorDiagnosis: 'Acute respiratory infection suspected; managed with antibiotics.',
          investigations: [
            { test: 'CBC (Complete Blood Count)', status: 'Completed', findings: 'WBC within normal range, low Hb (10.2 g/dL)' },
            { test: 'Chest X-Ray', status: 'Pending', findings: '—' },
            { test: 'RBS (Blood Sugar)', status: 'Completed', findings: '110 mg/dL (Normal)' }
          ],
          reportType: 'OPD Clinical Note',
          reportSummary: 'Patient had history of mild hypertension. Managing with Amlodipine 5mg. General health was satisfactory until current respiratory episode.'
        }
      },
      {
        id: 'ABHA-4452-1209',
        age: '28',
        gender: 'Female',
        village: 'Deri Sector 4',
        reportingSource: 'Self-Reported / PHC Desk',
        symptoms: ['Cough', 'Mild Body Pain'],
        vitals: { temp: '98.8', pulse: '76', bp: '120/80' },
        riskLevel: RiskLevel.LOW,
        severity: 'Normal',
        status: PatientStatus.RECOVERED,
        timestamp: new Date().toISOString(),
        aiDiagnosis: 'Mild Seasonal Flu',
        aiReasoning: 'Stable vitals and isolated symptoms. No age-related risk factors or chronic history matching current presentation.',
        aiConfidence: 0.95,
        clinicalTimeline: [
          {
            date: '2024-01-30T14:30:00Z',
            note: 'Mild cough and fatigue for 2 days.',
            recordedBy: 'Receptionist',
            role: 'PHC Support',
            type: 'Symptom'
          }
        ]
      }
    ];
    setPatients(mockPatients);
  }, []);

  const handleLogin = (role: UserRole) => {
    setCurrentRole(role);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const addPatient = (p: Patient) => setPatients(prev => [p, ...prev]);
  
  const updatePatient = (id: string, updates: Partial<Patient>) => {
    setPatients(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const renderModule = () => {
    switch (currentRole) {
      case UserRole.ASHA_WORKER:
        return <AshaModule onAddPatient={addPatient} patients={patients} />;
      case UserRole.DOCTOR:
        return <DoctorModule patients={patients} onUpdatePatient={updatePatient} />;
      case UserRole.HOSPITAL_MANAGER:
        return <HospitalModule />;
      case UserRole.AMBULANCE_DRIVER:
        return <AmbulanceModule />;
      case UserRole.DHO:
      case UserRole.NATIONAL_AUTHORITY:
        return <DHOModule patients={patients} />;
      default:
        return <div className="p-10 text-center">Module Coming Soon...</div>;
    }
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-slate-900 text-white p-4 flex justify-between items-center shadow-lg border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500 p-2 rounded-lg">
            <Layout size={20} />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tighter leading-none text-white">DIGI-HEALTH INDIA</h1>
            <p className="text-[10px] font-bold text-emerald-400 tracking-widest uppercase mt-1">AI-Powered Ecosystem</p>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <div className="hidden md:block text-right">
             <p className="text-xs font-bold text-slate-400 uppercase">System Active</p>
             <p className="text-[10px] text-emerald-400 uppercase font-black">Encrypted Connection</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-300 transition-colors border border-white/10"
          >
            <LogOut size={14} />
            <span>LOGOUT</span>
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-10">
        {renderModule()}
      </main>

      <footer className="bg-white border-t p-3 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest shrink-0">
        A Prototype for National Digital Healthcare Intelligence Platform © 2024
      </footer>
    </div>
  );
};

export default App;
