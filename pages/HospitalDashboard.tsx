
import React, { useState, useEffect } from 'react';
import { EmergencyCase, Severity, ReadinessStatus, AdmissionRecord } from '../types';
import { Activity, Clock, MapPin, CheckCircle, Database, History, User, Heart, Wind, Thermometer, AlertCircle, Info, Image, Zap, Phone, ExternalLink, FileText, UserCheck, ShieldCheck } from 'lucide-react';
import ImageModal from '../components/ImageModal';

interface Props {
  activeCase: EmergencyCase;
  updateCase: (updates: Partial<EmergencyCase>, targetId?: string) => void;
}

const MOCK_HISTORY: AdmissionRecord[] = [
  { date: '2023-11-12', condition: 'Severe Asthma Attack', doctor: 'Dr. Sanders', outcome: 'Recovered' },
  { date: '2021-04-05', condition: 'Type 1 Diabetes Triage', doctor: 'Dr. Lee', outcome: 'Stable' }
];

const HospitalDashboard: React.FC<Props> = ({ activeCase, updateCase }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'medical' | 'telemetry' | 'records'>('info');
  const [selectedPhoto, setSelectedPhoto] = useState<{ src: string, title: string } | null>(null);
  const [livePulse, setLivePulse] = useState(activeCase.vitals.pulse);

  useEffect(() => {
    if (activeTab === 'telemetry') {
      const interval = setInterval(() => {
        setLivePulse(activeCase.vitals.pulse + (activeCase.vitals.pulse > 0 ? Math.floor(Math.random() * 3) - 1 : 0));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [activeTab, activeCase.vitals.pulse]);

  const toggleReadiness = (key: keyof ReadinessStatus) => {
    updateCase({
      readiness: { ...activeCase.readiness, [key]: !activeCase.readiness[key] }
    });
  };

  const statusColor = activeCase.severity === Severity.CRITICAL ? 'red' : activeCase.severity === Severity.MEDIUM ? 'yellow' : 'emerald';

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto flex flex-col gap-8 animate-in fade-in duration-500 pb-24 relative z-10">
      {selectedPhoto && (
        <ImageModal src={selectedPhoto.src} title={selectedPhoto.title} onClose={() => setSelectedPhoto(null)} />
      )}

      {/* Hospital Node Header */}
      <div className={`bg-white border-2 border-${statusColor}-100 p-8 rounded-[3rem] shadow-2xl flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden`}>
        <div className={`absolute left-0 top-0 bottom-0 w-3 bg-${statusColor}-600 shadow-xl shadow-${statusColor}-900/20`} />
        
        <div className="flex items-center gap-8">
          <div className={`w-24 h-24 rounded-[2rem] bg-${statusColor}-600 text-white flex flex-col items-center justify-center shadow-2xl shadow-${statusColor}-900/30`}>
             <span className="text-4xl font-black italic">{activeCase.eta}</span>
             <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Mins</span>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-black text-slate-950 uppercase italic tracking-tighter">Inbound Node: {activeCase.ambulanceId}</h1>
              {activeCase.identity.isPoliceVerified && (
                <div className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-emerald-200">
                  <ShieldCheck size={12} /> Authority Sync OK
                </div>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-2 px-4 py-1.5 bg-slate-50 rounded-xl text-xs font-bold text-slate-600 border border-slate-100 uppercase tracking-widest">
                <User size={14} className="text-blue-500" /> {activeCase.isUnknown ? 'Session UID: ' + activeCase.identity.temporaryId : activeCase.identity.name}
              </span>
              <span className="flex items-center gap-2 px-4 py-1.5 bg-slate-50 rounded-xl text-xs font-bold text-slate-600 border border-slate-100 uppercase tracking-widest">
                <AlertCircle size={14} className="text-red-500" /> {activeCase.severity} Priority Node
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 p-1.5 bg-slate-50 rounded-2xl border border-slate-100 backdrop-blur-md">
          {[
            { id: 'info', icon: Info, label: 'Admission' },
            { id: 'medical', icon: FileText, label: 'Nurse Feedback' },
            { id: 'telemetry', icon: Activity, label: 'Live Mesh' },
            { id: 'records', icon: Database, label: 'EMR Vault' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                activeTab === tab.id ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-900'
              }`}
            >
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          {activeTab === 'info' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
              <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-200">
                <h2 className="text-xl font-black text-slate-950 uppercase italic tracking-tight mb-8">Clinical Intelligence Node</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 shadow-inner">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-4 italic underline underline-offset-4 decoration-blue-500/20">Authenticated Identity Stream</span>
                      <p className="text-2xl font-black text-slate-900 tracking-tight leading-tight italic">
                        {activeCase.isUnknown ? 'Forensic Inquiry: ' + activeCase.identity.temporaryId : activeCase.identity.name}
                      </p>
                      {activeCase.identity.isPoliceVerified && (
                        <div className="mt-6 space-y-3 p-6 bg-white border border-emerald-100 rounded-3xl shadow-sm">
                          <div className="flex justify-between text-[10px] font-black">
                            <span className="text-slate-400 uppercase tracking-tighter italic decoration-emerald-500 underline underline-offset-2">Registry Auth Node</span>
                            <span className="text-emerald-600">{activeCase.identity.govIdType}</span>
                          </div>
                          <div className="flex justify-between text-[10px] font-black">
                            <span className="text-slate-400 uppercase tracking-tighter italic decoration-emerald-500 underline underline-offset-2">Authenticated UID</span>
                            <span className="text-emerald-600 font-mono tracking-tighter">{activeCase.identity.govIdNumber}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div 
                      onClick={() => activeCase.evidence.patientPhoto && setSelectedPhoto({ src: activeCase.evidence.patientPhoto, title: 'Admission Biometric Capture' })}
                      className={`aspect-square bg-slate-100 rounded-[3rem] border border-slate-200 overflow-hidden relative group cursor-pointer ${!activeCase.evidence.patientPhoto && 'cursor-default opacity-50'}`}
                    >
                      {activeCase.evidence.patientPhoto ? (
                        <img src={activeCase.evidence.patientPhoto} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="Patient" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                          <Image size={48} strokeWidth={1} />
                          <span className="text-[9px] font-black uppercase mt-4 text-center px-8 leading-relaxed opacity-60">Forensic Assets Pending Upload</span>
                        </div>
                      )}
                      <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center">
                         <div className="bg-slate-900/90 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest backdrop-blur-md border border-white/10 italic shadow-xl">Biometric Ref</div>
                         {activeCase.evidence.patientPhoto && <ExternalLink size={16} className="text-white opacity-50" />}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {activeCase.geminiSummary && (
                <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group border border-slate-800 border-l-[16px] border-l-red-600 shadow-red-950/20">
                  <div className="absolute -top-10 -right-10 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000">
                    <Activity size={300} />
                  </div>
                  <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-6 flex items-center gap-2 italic underline underline-offset-4 decoration-red-600/30">
                    <Zap className="text-yellow-400" size={14} fill="currentColor" /> Gemini AI decision support synthesis
                  </h3>
                  <p className="text-2xl font-medium leading-tight italic relative z-10 text-slate-100 tracking-tight leading-relaxed">"{activeCase.geminiSummary}"</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'medical' && (
            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-200 animate-in fade-in slide-in-from-bottom-4 space-y-10">
              <div className="flex items-center justify-between border-b border-slate-100 pb-8">
                <h2 className="text-xl font-black text-slate-950 uppercase italic tracking-tight flex items-center gap-3">
                  <FileText className="text-blue-600" size={24} /> Nurse Clinical Feedback (Inbound)
                </h2>
                {activeCase.medicalCondition.lastUpdatedByEMS && (
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 italic underline underline-offset-4 decoration-blue-500/20">
                    <Clock size={12} /> Live Matrix Sync: {new Date(activeCase.medicalCondition.lastUpdatedByEMS).toLocaleTimeString()}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className={`p-10 rounded-[2.5rem] border-l-[12px] text-white shadow-2xl transition-all duration-500 ${activeCase.medicalCondition.state === 'CRITICAL' || activeCase.medicalCondition.state === 'UNCONSCIOUS' ? 'bg-red-950 border-l-red-600' : 'bg-slate-950 border-l-blue-600'}`}>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-4 italic underline underline-offset-4 decoration-white/10">Clinical Field State</span>
                  <div className={`text-3xl font-black uppercase italic tracking-tighter ${activeCase.medicalCondition.state === 'CRITICAL' || activeCase.medicalCondition.state === 'UNCONSCIOUS' ? 'text-red-500' : 'text-blue-500'}`}>
                    {activeCase.medicalCondition.state ? activeCase.medicalCondition.state.replace('-', ' ') : 'Awaiting EMS Log...'}
                  </div>
                </div>
                
                <div className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 shadow-inner flex flex-col justify-center border-2 border-slate-100">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-3 italic">Clinical Priority Node</span>
                  <div className="text-lg font-black text-slate-950 uppercase tracking-tighter flex items-center gap-3 italic">
                    <Activity size={20} className="text-red-600 animate-pulse" /> {activeCase.severity} PRIORITY DEPLOYMENT
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="p-12 bg-slate-50 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.02] text-slate-900"><Activity size={180} /></div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-10 italic underline underline-offset-8 decoration-blue-500/20">Synced Clinical Findings Matrix</span>
                  <div className="space-y-12">
                    <div className="flex gap-8 group">
                       <div className="w-1.5 h-auto bg-red-600 rounded-full shadow-lg shadow-red-600/30 group-hover:scale-y-110 transition-transform" />
                       <div className="flex-1">
                         <p className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-tighter italic">Trauma Presentation Log</p>
                         <p className="text-2xl font-black text-slate-900 italic leading-tight tracking-tight">
                           {activeCase.medicalCondition.injuries || 'No primary trauma reported by ambulance node.'}
                         </p>
                       </div>
                    </div>
                    <div className="flex gap-8 group">
                       <div className="w-1.5 h-auto bg-amber-500 rounded-full shadow-lg shadow-amber-500/30 group-hover:scale-y-110 transition-transform" />
                       <div className="flex-1">
                         <p className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-tighter italic">Field Symptom Matrix</p>
                         <p className="text-2xl font-black text-slate-900 italic leading-tight tracking-tight">
                           {activeCase.medicalCondition.symptoms || 'Awaiting clinical log updates from EMS.'}
                         </p>
                       </div>
                    </div>
                  </div>
                </div>

                <div className="p-12 bg-blue-900 rounded-[3rem] shadow-2xl relative overflow-hidden text-white border border-blue-800 shadow-blue-950/20">
                  <div className="absolute top-0 right-0 p-8 opacity-5"><Zap size={220} /></div>
                  <span className="text-[10px] font-black text-blue-300 uppercase tracking-widest block mb-6 relative z-10 italic underline underline-offset-4 decoration-blue-500/30">EMS Administered Matrix</span>
                  <p className="text-xl font-bold leading-relaxed relative z-10 italic text-blue-50 leading-relaxed tracking-tight">
                    "{activeCase.medicalCondition.treatment || "No specific field interventions synchronized for this registry context."}"
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'telemetry' && (
            <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-slate-200 animate-in fade-in duration-700">
              <div className="flex items-center justify-between mb-16">
                <h2 className="text-xl font-black text-slate-950 uppercase italic tracking-tight flex items-center gap-3">
                  <Activity className="text-red-600" size={24} /> Field Telemetry Feed
                </h2>
                <div className="px-6 py-2 bg-red-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse flex items-center gap-3 shadow-xl shadow-red-900/30">
                  <div className="w-2.5 h-2.5 bg-white rounded-full shadow-lg" /> MESH DATA SYNC ACTIVE
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                {[
                  { label: 'Pulse Rate', val: livePulse, unit: 'BPM', icon: Heart, color: 'text-red-600', pulse: true },
                  { label: 'BP Systolic', val: activeCase.vitals.bp_sys, unit: 'mmHg', icon: Activity, color: 'text-purple-600' },
                  { label: 'O2 Saturation', val: activeCase.vitals.spo2 + '%', unit: 'SpO2', icon: Wind, color: 'text-blue-600' },
                  { label: 'Core Temp', val: activeCase.vitals.temp, unit: '°C', icon: Thermometer, color: 'text-orange-600' },
                ].map((v) => (
                  <div key={v.label} className="space-y-4">
                    <div className={`flex items-center gap-2.5 text-[10px] font-black uppercase tracking-widest ${v.color}`}>
                      <v.icon size={14} className={v.pulse && activeCase.vitals.pulse > 0 ? 'animate-pulse' : ''} /> {v.label}
                    </div>
                    <div className="text-7xl font-black text-slate-950 tracking-tighter leading-none">{v.val || '--'}</div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{v.unit}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'records' && (
            <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-slate-200 animate-in fade-in duration-500">
              <h2 className="text-xl font-black text-slate-950 uppercase italic tracking-tight mb-12 flex items-center gap-3">
                <History className="text-blue-600" size={24} /> Clinical Registry Repository
              </h2>
              {activeCase.isUnknown ? (
                <div className="p-20 bg-slate-50 rounded-[3rem] text-center border-2 border-dashed border-slate-200 shadow-inner">
                  <div className="w-20 h-20 bg-slate-200 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-slate-400 shadow-xl shadow-slate-900/5">
                    <User size={40} />
                  </div>
                  <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-4 italic">Registry Node Encrypted</h4>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest max-w-sm mx-auto leading-relaxed italic">Identity-linked history is locked until Police Authority authenticate the registry node handshake.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {MOCK_HISTORY.map((rec, i) => (
                    <div key={i} className="p-10 bg-slate-50 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center gap-8 border border-slate-100 hover:border-blue-300 transition-all group cursor-default shadow-sm hover:shadow-xl">
                      <div className="flex gap-8 items-center">
                        <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-blue-600 shadow-2xl shadow-slate-900/5 group-hover:scale-110 transition-transform border border-blue-100">
                          <History size={28} />
                        </div>
                        <div>
                          <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 italic">{rec.date}</div>
                          <div className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight italic">Admission: {rec.condition}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic underline underline-offset-4 decoration-slate-200">Attending Clinician</div>
                        <div className="text-lg font-black text-slate-900 italic tracking-tighter">{rec.doctor}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Readiness Side Controller */}
        <div className="space-y-8">
          <div className="bg-slate-950 p-12 rounded-[3rem] border border-slate-800 shadow-2xl relative overflow-hidden shadow-slate-900/60">
            <div className="absolute top-0 right-0 p-8 opacity-5"><AlertCircle size={150} /></div>
            <h3 className="text-[11px] font-black text-slate-600 uppercase tracking-widest mb-12 relative z-10 italic underline underline-offset-8 decoration-white/5">Clinical Readiness Matrix</h3>
            <div className="space-y-5 relative z-10">
              {[
                { key: 'icu', label: 'ICU Recovery Unit' },
                { key: 'blood', label: 'Blood Node Arranged' },
                { key: 'specialist', label: 'Clinical Specialist' },
                { key: 'equipment', label: 'Trauma Bay Triage' },
                { key: 'medicines', label: 'Clinical Pharmacy' },
              ].map((item) => (
                <button 
                  key={item.key}
                  onClick={() => toggleReadiness(item.key as any)}
                  className={`w-full p-7 rounded-3xl flex items-center justify-between transition-all border-2 shadow-sm ${
                    activeCase.readiness[item.key as keyof ReadinessStatus] 
                      ? 'bg-emerald-600 border-emerald-500 text-white shadow-2xl shadow-emerald-900/40 scale-[1.03]' 
                      : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/10'
                  }`}
                >
                  <span className="font-black text-[11px] uppercase tracking-widest">{item.label}</span>
                  {activeCase.readiness[item.key as keyof ReadinessStatus] ? <CheckCircle size={20} /> : <div className="w-5 h-5 rounded-full border-2 border-slate-800" />}
                </button>
              ))}
            </div>
            <div className="mt-10 pt-8 border-t border-white/5 relative z-10">
              <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest italic leading-relaxed">Broadcasted to EMS node in real-time.</p>
            </div>
          </div>
          
          <div className="p-12 bg-blue-600 rounded-[3rem] text-white shadow-2xl shadow-blue-900/40 group hover:scale-[1.02] transition-transform duration-500">
             <h4 className="text-[11px] font-black uppercase tracking-widest opacity-60 mb-8 italic underline underline-offset-4 decoration-white/20">Forensic Auth Stream</h4>
             <div className="p-8 bg-white/10 rounded-[2.5rem] border border-white/10 backdrop-blur-sm shadow-xl">
               <div className="flex items-center gap-4 text-base font-black italic">
                 <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-xl shadow-emerald-400/50 animate-pulse" />
                 Secure Link OK
               </div>
               <p className="text-[10px] mt-6 opacity-80 uppercase leading-relaxed font-black tracking-tighter italic">
                 Handshake active with Police node.
               </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalDashboard;
