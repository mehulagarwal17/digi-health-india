
import React from 'react';
import { X, Printer, Download, FileText, ShieldCheck } from 'lucide-react';

interface MedicalReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
}

const MedicalReportModal: React.FC<MedicalReportModalProps> = ({ isOpen, onClose, patientId }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl flex flex-col max-h-[95vh]">
        {/* Modal Toolbar */}
        <div className="bg-slate-800 text-white px-6 py-3 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2 text-sm font-bold">
            <FileText size={18} className="text-blue-400" />
            <span>DHI-REPORT-{patientId}.pdf (Read-Only)</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="hover:text-blue-400 transition-colors p-1" title="Print">
              <Printer size={18} />
            </button>
            <button className="hover:text-blue-400 transition-colors p-1" title="Download">
              <Download size={18} />
            </button>
            <div className="w-px h-6 bg-slate-600 mx-2"></div>
            <button onClick={onClose} className="hover:text-red-400 transition-colors p-1" title="Close">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* PDF Content Area */}
        <div className="flex-1 overflow-y-auto bg-slate-200 p-8 flex justify-center">
          <div className="bg-white w-full max-w-[210mm] min-h-[297mm] shadow-lg p-12 text-slate-900 font-serif leading-relaxed print:shadow-none">
            {/* Header */}
            <div className="border-b-2 border-slate-900 pb-6 mb-8 text-center relative">
              <div className="absolute left-0 top-0 opacity-10">
                <ShieldCheck size={80} />
              </div>
              <h1 className="text-2xl font-black uppercase tracking-tight">DIGI-HEALTH INDIA</h1>
              <p className="text-sm font-bold uppercase tracking-widest text-slate-600">National Public Health Digital Platform</p>
              <p className="text-[10px] font-bold mt-1 text-blue-800 underline uppercase tracking-tighter">(Clinical Document – Read Only)</p>
              
              <div className="mt-6 grid grid-cols-2 text-left text-xs">
                <div className="space-y-1">
                  <p><span className="font-bold">Issuing Facility:</span> Rampur PHC Sector B</p>
                  <p><span className="font-bold">Facility Type:</span> Primary Health Centre</p>
                  <p><span className="font-bold">Location:</span> Rampur District</p>
                </div>
                <div className="space-y-1 text-right">
                  <p><span className="font-bold">Report Type:</span> OPD Clinical Note</p>
                  <p><span className="font-bold">Report ID:</span> DHI-OPD-2026-01982</p>
                  <p><span className="font-bold">Report Date:</span> 12 January 2026</p>
                </div>
              </div>
            </div>

            {/* Content Sections */}
            <div className="space-y-8">
              {/* Patient Details */}
              <section>
                <h2 className="text-sm font-black border-b border-slate-300 pb-1 mb-3 uppercase tracking-wider">PATIENT DETAILS</h2>
                <div className="grid grid-cols-2 text-xs gap-y-2">
                  <p><span className="font-bold">Patient ID:</span> {patientId}</p>
                  <p><span className="font-bold">Age:</span> 60 years</p>
                  <p><span className="font-bold">Gender:</span> Male</p>
                  <p><span className="font-bold">Village/Area:</span> Rampur Rural</p>
                  <p className="col-span-2"><span className="font-bold">ABHA ID:</span> Linked (Masked for privacy)</p>
                </div>
              </section>

              {/* Visit Details */}
              <section>
                <h2 className="text-sm font-black border-b border-slate-300 pb-1 mb-3 uppercase tracking-wider">VISIT DETAILS</h2>
                <div className="grid grid-cols-2 text-xs gap-y-2">
                  <p><span className="font-bold">Encounter Type:</span> OPD Visit</p>
                  <p><span className="font-bold">Visit Date:</span> 12 January 2026</p>
                  <p><span className="font-bold">Department:</span> General Medicine</p>
                  <p><span className="font-bold">Referring Facility:</span> None</p>
                </div>
              </section>

              {/* Chief Complaints */}
              <section>
                <h2 className="text-sm font-black border-b border-slate-300 pb-1 mb-3 uppercase tracking-wider">CHIEF COMPLAINTS</h2>
                <ul className="text-xs list-disc list-inside space-y-1 ml-2">
                  <li>Fever for 3 days</li>
                  <li>Body ache</li>
                  <li>Weakness</li>
                  <li>Reduced appetite</li>
                </ul>
              </section>

              {/* Clinical Findings */}
              <section>
                <h2 className="text-sm font-black border-b border-slate-300 pb-1 mb-3 uppercase tracking-wider">CLINICAL FINDINGS</h2>
                <div className="text-xs space-y-1 ml-2">
                  <p><span className="font-bold">• Temperature:</span> 102°F</p>
                  <p><span className="font-bold">• Pulse:</span> 110 bpm</p>
                  <p><span className="font-bold">• Observation:</span> Mild dehydration noted; patient appears fatigued.</p>
                </div>
              </section>

              {/* Investigations */}
              <section>
                <h2 className="text-sm font-black border-b border-slate-300 pb-1 mb-3 uppercase tracking-wider">INVESTIGATIONS</h2>
                <table className="w-full text-xs border-collapse mt-2">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="border border-slate-300 px-3 py-2 text-left w-1/3">Test Name</th>
                      <th className="border border-slate-300 px-3 py-2 text-left">Result Summary</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-slate-300 px-3 py-2 font-bold">CBC</td>
                      <td className="border border-slate-300 px-3 py-2">Platelet count mildly low</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 px-3 py-2 font-bold">RBS</td>
                      <td className="border border-slate-300 px-3 py-2">Within normal range</td>
                    </tr>
                  </tbody>
                </table>
                <p className="text-[9px] text-slate-500 italic mt-2">"Detailed lab reports retained at issuing facility."</p>
              </section>

              {/* Diagnosis */}
              <section>
                <h2 className="text-sm font-black border-b border-slate-300 pb-1 mb-3 uppercase tracking-wider">DIAGNOSIS</h2>
                <div className="ml-2">
                  <p className="text-xs font-bold underline mb-1">Provisional Diagnosis:</p>
                  <p className="text-sm font-bold">Suspected Dengue Fever</p>
                </div>
              </section>

              {/* Treatment */}
              <section>
                <h2 className="text-sm font-black border-b border-slate-300 pb-1 mb-3 uppercase tracking-wider">TREATMENT PROVIDED</h2>
                <ul className="text-xs list-disc list-inside space-y-1 ml-2">
                  <li>Oral rehydration advised</li>
                  <li>Paracetamol prescribed</li>
                  <li>Rest recommended</li>
                  <li>Monitoring of platelet count advised</li>
                </ul>
              </section>

              {/* Advice */}
              <section>
                <h2 className="text-sm font-black border-b border-slate-300 pb-1 mb-3 uppercase tracking-wider">ADVICE & FOLLOW-UP</h2>
                <div className="text-xs space-y-2 ml-2">
                  <p>• Maintain hydration levels at all times.</p>
                  <p>• Monitor fever daily and maintain record.</p>
                  <p>• Follow-up visit scheduled in 2 days.</p>
                  <p className="font-bold text-slate-800 underline">Return immediately if any bleeding symptoms occur.</p>
                </div>
              </section>
            </div>

            {/* Signature Footer */}
            <div className="mt-16 flex justify-between items-end border-t pt-8">
              <div className="text-[10px] text-slate-400 font-bold space-y-1">
                <p>Digitally Generated Clinical Document</p>
                <p>DIGI-HEALTH INDIA Platform</p>
                <p>Timestamp: 12 Jan 2026 – 11:42 AM</p>
                <p className="uppercase mt-4 tracking-widest text-slate-500">READ-ONLY CLINICAL DOCUMENT – NOT EDITABLE</p>
              </div>
              <div className="text-center text-xs">
                <div className="mb-4 opacity-50 italic text-[10px]">(Digital Signature)</div>
                <p className="font-bold">Dr. Satish Kumar</p>
                <p className="text-[10px]">Medical Officer – Rampur PHC</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer (Actionable) */}
        <div className="bg-white border-t px-6 py-4 flex justify-end shrink-0">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-slate-100 text-slate-600 rounded-lg font-bold text-sm hover:bg-slate-200 transition-colors"
          >
            Close Document
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicalReportModal;
