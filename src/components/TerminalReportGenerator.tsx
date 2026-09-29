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
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)', animation: 'fadeInUp 0.2s ease-out' }}>
          <div style={{ background: '#0f172a', borderRadius: '12px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', width: '650px', overflow: 'hidden', display: 'flex', flexDirection: 'column', border: '1px solid #334155', fontFamily: '"JetBrains Mono", monospace', textAlign: 'left' }}>
            
            {/* Terminal Header */}
            <div style={{ background: '#020617', color: '#94a3b8', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                 <Terminal size={14} /> root@bidtrust-ai-engine:~
               </div>
               <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = '#94a3b8'}>
                 <X size={16}/>
               </button>
            </div>
            
            {/* Terminal Body */}
            <div style={{ padding: '24px', height: '320px', overflowY: 'auto', color: '#4ade80', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', lineHeight: 1.6 }}>
               {logs.map((log, index) => (
                 <div key={index} style={{ animation: 'fadeInUp 0.3s ease-out' }}>
                   {log}
                 </div>
               ))}
               {!isDone && (
                 <div style={{ animation: 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite', color: '#4ade80' }}>_</div>
               )}
            </div>

            {/* Terminal Footer */}
            {isDone && (
              <div style={{ background: '#020617', padding: '16px', borderTop: '1px solid #1e293b', display: 'flex', justifyContent: 'flex-end', animation: 'fadeInUp 0.5s ease-out' }}>
                <button onClick={handleDownload} style={{ background: '#16a34a', color: 'white', padding: '10px 20px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '14px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} onMouseOver={e => e.currentTarget.style.background = '#15803d'} onMouseOut={e => e.currentTarget.style.background = '#16a34a'}>
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
