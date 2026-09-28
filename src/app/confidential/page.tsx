'use client';
import { useState } from 'react';
import { ShieldAlert, Fingerprint, Lock } from 'lucide-react';
import TopBar from '@/components/TopBar';

export default function ConfidentialPage() {
  const [accessState, setAccessState] = useState<'locked' | 'scanning' | 'denied'>('locked');

  const handleScan = () => {
    setAccessState('scanning');
    setTimeout(() => {
      setAccessState('denied');
    }, 4500);
  };

  return (
    <>
      <TopBar breadcrumbs={[{ label: 'Confidential Cartel Investigations' }]} />
      <div className="page-container flex items-center justify-center min-h-[70vh]">
        
        <div className="bg-white border border-gray-200 shadow-2xl rounded-2xl w-[550px] p-10 flex flex-col items-center text-center animate-in fade-in zoom-in duration-300">
           
           {accessState === 'locked' && (
             <>
               <div className="w-24 h-24 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-6 border-4 border-red-100">
                 <Lock size={48} />
               </div>
               <h1 className="text-3xl font-bold text-gray-900 mb-3 font-serif">Level 4 Access Required</h1>
               <p className="text-gray-500 mb-8 text-sm leading-relaxed">
                 This secure zone contains highly sensitive intelligence reports regarding active cartel investigations. Biometric authentication is strictly required for GeM Officials.
               </p>
               <button 
                 onClick={handleScan}
                 className="bg-gray-900 text-white px-8 py-4 rounded-xl font-medium flex items-center gap-3 hover:bg-gray-800 transition-colors shadow-lg cursor-pointer"
               >
                 <Fingerprint size={20} /> Authenticate via Aadhaar Biometrics
               </button>
             </>
           )}

           {accessState === 'scanning' && (
             <>
               <div className="relative mb-8 mt-4 w-32 h-32">
                 <Fingerprint size={128} className="text-gray-100 absolute top-0 left-0" />
                 <div className="absolute top-0 left-0 overflow-hidden" style={{ width: '100%', animation: 'scan 2.5s ease-in-out infinite alternate' }}>
                    <Fingerprint size={128} className="text-blue-600" />
                 </div>
                 <div className="absolute left-0 right-0 h-1 bg-blue-400 shadow-[0_0_12px_4px_rgba(59,130,246,0.7)] z-10 animate-scan-laser"></div>
               </div>
               <h2 className="text-xl font-semibold text-blue-600 mb-2 font-mono animate-pulse tracking-widest">VERIFYING BIOMETRICS...</h2>
               <p className="text-gray-400 text-sm font-mono mt-2">Connecting to secure UIDAI servers</p>
             </>
           )}

           {accessState === 'denied' && (
             <>
               <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
                 <ShieldAlert size={48} />
               </div>
               <h1 className="text-3xl font-bold text-red-600 mb-3 font-mono uppercase tracking-widest">Access Denied</h1>
               <p className="text-gray-800 mb-6 text-sm font-medium leading-relaxed">
                 Biometric signature does not match authorized personnel for Tender GEM/2026/B/892.
               </p>
               <p className="text-red-500 text-xs font-mono bg-red-50 p-3 rounded-lg border border-red-100 inline-block">
                 SECURITY INCIDENT LOGGED TO IMMUTABLE BLOCKCHAIN
               </p>
               <button 
                 onClick={() => setAccessState('locked')}
                 className="mt-10 text-gray-400 hover:text-gray-900 text-sm font-medium underline cursor-pointer"
               >
                 Return to safety
               </button>
             </>
           )}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { height: 0%; }
          100% { height: 100%; }
        }
        .animate-scan-laser {
          animation: scan-laser 2.5s linear infinite alternate;
        }
        @keyframes scan-laser {
          0% { top: 0%; }
          100% { top: 100%; }
        }
      `}} />
    </>
  );
}
