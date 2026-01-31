
import React, { useState, useMemo } from 'react';
import { X, Info, CheckCircle2, AlertCircle, Clock, Filter, Layers, LayoutGrid } from 'lucide-react';

type BedStatus = 'Available' | 'Ready' | 'Occupied-Stable' | 'Occupied-Critical' | 'Maintenance';
type WardType = 'General' | 'ICU' | 'Isolation';

interface Bed {
  id: string;
  floor: number;
  status: BedStatus;
  wardType: WardType;
  lastCleaned: string;
}

interface BedHeatmapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BedHeatmapModal: React.FC<BedHeatmapModalProps> = ({ isOpen, onClose }) => {
  const [filter, setFilter] = useState<'All' | 'Available' | 'ICU' | 'Isolation'>('All');
  const [selectedBed, setSelectedBed] = useState<Bed | null>(null);
  const [hoveredBed, setHoveredBed] = useState<Bed | null>(null);

  // Generate mock bed data
  const beds: Bed[] = useMemo(() => {
    const data: Bed[] = [];
    const statuses: BedStatus[] = ['Available', 'Ready', 'Occupied-Stable', 'Occupied-Critical', 'Maintenance'];
    const wards: WardType[] = ['General', 'ICU', 'Isolation'];

    for (let f = 1; f <= 4; f++) {
      for (let b = 1; b <= 20; b++) {
        // Pseudo-random but stable distribution for the prototype
        const seed = f * 100 + b;
        const status = statuses[seed % 5];
        const wardType = b <= 5 ? 'ICU' : b <= 8 ? 'Isolation' : 'General';
        
        data.push({
          id: `F${f}-B${String(b).padStart(2, '0')}`,
          floor: f,
          status: status,
          wardType: wardType,
          lastCleaned: '2h 15m ago'
        });
      }
    }
    return data;
  }, []);

  const filteredBeds = beds.filter(b => {
    if (filter === 'Available') return b.status === 'Available' || b.status === 'Ready';
    if (filter === 'ICU') return b.wardType === 'ICU';
    if (filter === 'Isolation') return b.wardType === 'Isolation';
    return true;
  });

  if (!isOpen) return null;

  const getStatusColor = (status: BedStatus) => {
    switch (status) {
      case 'Available': return 'bg-emerald-200 border-emerald-300';
      case 'Ready': return 'bg-emerald-500 border-emerald-600';
      case 'Occupied-Stable': return 'bg-rose-300 border-rose-400';
      case 'Occupied-Critical': return 'bg-rose-600 border-rose-700';
      case 'Maintenance': return 'bg-slate-300 border-slate-400';
      default: return 'bg-slate-100';
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-5xl rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border-4 border-white">
        
        {/* Header HUD */}
        <div className="px-10 py-8 bg-[#1e2b58] text-white flex justify-between items-center shrink-0">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg"><Layers size={24} /></div>
              <h3 className="text-2xl font-black uppercase tracking-tight">Floor-wise Bed Availability</h3>
            </div>
            <p className="text-blue-300 text-[10px] font-bold uppercase tracking-[0.3em] mt-1 ml-11">Real-time bed occupancy overview</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all text-slate-300 hover:text-white">
            <X size={28} />
          </button>
        </div>

        {/* Top Bar / Filters */}
        <div className="px-10 py-4 bg-slate-50 border-b flex justify-between items-center shrink-0">
          <div className="flex gap-2">
            {(['All', 'Available', 'ICU', 'Isolation'] as const).map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-[#1e2b58] text-white shadow-lg' : 'bg-white border text-slate-500 hover:bg-slate-100'}`}
              >
                {f}
              </button>
            ))}
          </div>
          
          {/* Legend */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-emerald-500"></div>
              <span className="text-[9px] font-black text-slate-400 uppercase">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-rose-500"></div>
              <span className="text-[9px] font-black text-slate-400 uppercase">Occupied</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-slate-300"></div>
              <span className="text-[9px] font-black text-slate-400 uppercase">Maintenance</span>
            </div>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="flex-1 overflow-y-auto p-10 bg-white relative">
          <div className="space-y-12">
            {[4, 3, 2, 1].map(floor => (
              <div key={floor} className="space-y-4">
                <div className="flex items-center gap-3 border-l-4 border-[#1e2b58] pl-4">
                  <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">Floor {floor}</h4>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">({beds.filter(b => b.floor === floor && b.status.startsWith('Available')).length} Available Units)</span>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {beds.filter(b => b.floor === floor).map(bed => {
                    const isVisible = filter === 'All' || 
                      (filter === 'Available' && (bed.status === 'Available' || bed.status === 'Ready')) ||
                      (filter === 'ICU' && bed.wardType === 'ICU') ||
                      (filter === 'Isolation' && bed.wardType === 'Isolation');
                    
                    return (
                      <div 
                        key={bed.id}
                        onMouseEnter={() => setHoveredBed(bed)}
                        onMouseLeave={() => setHoveredBed(null)}
                        onClick={() => setSelectedBed(bed)}
                        className={`w-10 h-10 rounded-lg border-2 cursor-pointer transition-all duration-300 ${getStatusColor(bed.status)} ${!isVisible ? 'opacity-10 pointer-events-none scale-90' : 'hover:scale-110 hover:shadow-xl hover:z-20 shadow-sm'} flex items-center justify-center`}
                      >
                        {bed.wardType === 'ICU' && <div className="w-1 h-1 bg-white/40 rounded-full absolute top-1 right-1"></div>}
                        <span className="text-[8px] font-black text-black/20 select-none">{bed.id.split('-B')[1]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Hover Tooltip Overlay */}
          {hoveredBed && (
            <div 
              className="fixed pointer-events-none z-[150] bg-[#1e2b58] text-white p-4 rounded-2xl shadow-2xl border border-white/20 animate-in fade-in zoom-in-95 duration-100"
              style={{ left: '20px', bottom: '20px' }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-blue-500/20 p-2 rounded-lg"><LayoutGrid size={16} /></div>
                <div>
                  <p className="text-lg font-black leading-none">{hoveredBed.id}</p>
                  <p className="text-[9px] font-black text-blue-300 uppercase tracking-widest mt-1">Floor {hoveredBed.floor} • {hoveredBed.wardType}</p>
                </div>
              </div>
              <div className="space-y-1.5 border-t border-white/10 pt-2">
                <p className="text-[10px] font-bold flex items-center justify-between gap-4">
                  <span className="opacity-60 uppercase tracking-widest">Status:</span>
                  <span className="font-black text-emerald-400 uppercase">{hoveredBed.status}</span>
                </p>
                <p className="text-[10px] font-bold flex items-center justify-between gap-4">
                  <span className="opacity-60 uppercase tracking-widest">Cleaning:</span>
                  <span className="font-black opacity-90">{hoveredBed.lastCleaned}</span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Selected Bed Quick Control Panel */}
        {selectedBed && (
          <div className="bg-slate-50 border-t p-8 flex items-center justify-between animate-in slide-in-from-bottom-full duration-300">
            <div className="flex items-center gap-6">
              <div className={`w-16 h-16 rounded-2xl border-4 ${getStatusColor(selectedBed.status)} flex items-center justify-center font-black text-xl text-black/10`}>
                {selectedBed.id.split('-B')[1]}
              </div>
              <div>
                <h5 className="text-xl font-black text-slate-800 tracking-tight">Manage Unit {selectedBed.id}</h5>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                  Floor {selectedBed.floor} • Ward: {selectedBed.wardType} • Last Sanitized: {selectedBed.lastCleaned}
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button className="bg-white border-2 border-slate-200 px-6 py-3 rounded-2xl text-[10px] font-black text-slate-600 uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center gap-2">
                <Clock size={16} /> Mark for Cleaning
              </button>
              <button className="bg-white border-2 border-slate-200 px-6 py-3 rounded-2xl text-[10px] font-black text-slate-600 uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center gap-2">
                <Info size={16} /> Assign Patient
              </button>
              <button onClick={() => setSelectedBed(null)} className="bg-slate-800 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all">
                Close
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default BedHeatmapModal;
