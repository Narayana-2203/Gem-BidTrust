'use client';
import { useState, useEffect } from 'react';
import { Terminal, Download, FileDown, X } from 'lucide-react';

export default function TerminalReportGenerator() {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLogs([]);
      setIsDone(false);
      const script = [
        "> INITIALIZING GLOBAL CVC THREAT DOSSIER...",
        "> Establishing secure connection to GeM Central DB...",
        "> [OK] Connection Established (Latency: 12ms)",
        "> Scanning 3,842 active tenders for high-risk anomalies...",
        "> Running Cartel Graph Analysis across all bidder networks...",
        "> [ALERT] Detected 3 potential bidding rings (Cross-referencing DINs)...",
        "> Compiling Flagged Exceptions and AI Risk profiles...",
        "> Securing global intelligence report with SHA-256 Blockchain Hash...",
        "> Hash generated: 0x9f86d081884c7d659a2feaa0c55ad015a3bf4f1b",
        "> [SUCCESS] CVC Master Intelligence Report PDF Ready."
      ];
      
      let i = 0;
      const interval = setInterval(() => {
        if (i < script.length) {
          setLogs(prev => [...prev, script[i]]);
          i++;
        } else {
          setIsDone(true);
          clearInterval(interval);
        }
      }, 700);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const handleDownload = () => {
    const content = `=====================================================
CVC MASTER THREAT INTELLIGENCE DOSSIER
=====================================================
Date Generated: ${new Date().toISOString()}
Security Hash: 0x9f86d081884c7d659a2feaa0c55ad015a3bf4f1b
Scope: 3,842 Active Tenders

[ALERT] 3 Potential Bidding Rings Detected (Cartelization)
- Ring Alpha: Cross-referenced DIN matches on Tender GEM/2026/B/892
- Ring Beta: Suspicious bid timing anomalies on IT Hardware tenders
- Ring Gamma: Shared IP address detected across 4 competing bidders

ACTION REQUIRED: Immediate manual audit recommended for Ring Alpha.
=====================================================
CONFIDENTIAL - FOR AUTHORIZED OFFICERS ONLY
=====================================================`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'CVC_Master_Threat_Report.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Close modal after a short delay
    setTimeout(() => setIsOpen(false), 500);
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="btn btn-primary" style={{ padding: '8px 16px', borderRadius: 'var(--radius-md)', border: 'none', display: 'flex', alignItems: 'center', gap: 8, background: '#1e293b', color: 'white', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
        <FileDown size={16} /> Export CVC Report
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0f172a] rounded-xl shadow-2xl w-[650px] overflow-hidden flex flex-col border border-gray-700 font-mono text-sm text-left">
            <div className="bg-black/50 text-gray-400 p-3 flex justify-between items-center border-b border-gray-800">
               <div className="flex items-center gap-2">
                 <Terminal size={14} /> root@bidtrust-secure-server:~
               </div>
               <button onClick={() => setIsOpen(false)} className="hover:text-white cursor-pointer"><X size={16}/></button>
            </div>
            
            <div className="p-6 h-[320px] overflow-y-auto text-green-400 flex flex-col gap-3 font-mono text-[13px] leading-relaxed">
               {logs.map((log, index) => (
                 <div key={index} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                   {log}
                 </div>
               ))}
               {!isDone && (
                 <div className="animate-pulse text-green-400">_</div>
               )}
            </div>

            {isDone && (
              <div className="bg-gray-900 p-4 border-t border-gray-800 flex justify-end animate-in fade-in duration-500">
                <button className="bg-green-600 hover:bg-green-500 text-white px-5 py-2.5 rounded-md flex items-center gap-2 font-sans font-medium transition-colors cursor-pointer shadow-lg" onClick={handleDownload}>
                  <Download size={16} /> Download Intelligence Log
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
