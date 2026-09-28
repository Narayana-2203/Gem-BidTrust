'use client';
import { useState, useEffect } from 'react';
import { Scan, CheckCircle2, X, ShieldAlert, Cpu, Fingerprint, Lock } from 'lucide-react';

export default function AIDocumentScanner({ label = "AI Deep Scan Document" }: { label?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scanStep, setScanStep] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setScanStep(0);
      const timer1 = setTimeout(() => setScanStep(1), 1500);
      const timer2 = setTimeout(() => setScanStep(2), 3500);
      const timer3 = setTimeout(() => setScanStep(3), 5500);
      const timer4 = setTimeout(() => setScanStep(4), 7000);
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
      };
    }
  }, [isOpen]);

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="btn btn-outline btn-sm" style={{ padding: '6px 12px', fontSize: '11px', borderRadius: 'var(--radius-md)', border: '1px solid #3b82f6', color: '#3b82f6', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, background: '#eff6ff', cursor: 'pointer' }}>
        <Scan size={14} /> {label}
      </button>

      {isOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'fadeIn 0.3s ease-out'
        }}>
          <div style={{
            background: '#0f172a',
            border: '1px solid #1e293b',
            borderRadius: '16px',
            width: '90%',
            maxWidth: '900px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(59, 130, 246, 0.5)',
            overflow: 'hidden'
          }}>
            {/* Header */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #1e293b',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'linear-gradient(to right, #0f172a, #1e293b)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Cpu size={20} color="#3b82f6" />
                <span style={{ color: '#f8fafc', fontWeight: 600, fontSize: '15px', letterSpacing: '0.05em' }}>
                  AI FORENSIC DEEP SCAN <span style={{ color: '#64748b', fontWeight: 400 }}>{`// ENGINE v4.2`}</span>
                </span>
              </div>
              <button onClick={() => setIsOpen(false)} style={{
                background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 4
              }}>
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div style={{ display: 'flex', flex: 1, minHeight: '500px', background: '#020617' }}>
              
              {/* Left Column: Image & Scanner */}
              <div style={{ flex: 2, position: 'relative', borderRight: '1px solid #1e293b', padding: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '450px',
                  height: '500px',
                  background: '#fff',
                  borderRadius: '4px',
                  boxShadow: '0 0 20px rgba(0,0,0,0.5)',
                  overflow: 'hidden',
                  padding: '24px'
                }}>
                  {/* Fake Document Content */}
                  <div style={{ borderBottom: '2px solid #000', paddingBottom: '10px', marginBottom: '20px', textAlign: 'center' }}>
                    <h2 style={{ margin: 0, fontSize: '18px', fontFamily: 'serif' }}>GOVERNMENT OF INDIA</h2>
                    <p style={{ margin: '4px 0 0', fontSize: '12px' }}>GST Registration Certificate</p>
                  </div>
                  
                  <div style={{ fontFamily: 'monospace', fontSize: '12px', lineHeight: 2, color: '#333' }}>
                    <div style={{ color: '#666', fontSize: '10px' }}>1. LEGAL NAME</div>
                    <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '16px' }}>RELIABLE TECH SOLUTIONS PVT LTD</div>
                    
                    <div style={{ color: '#666', fontSize: '10px' }}>2. TRADE NAME, IF ANY</div>
                    <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '16px' }}>RELIABLE TECH</div>
                    
                    <div style={{ color: '#666', fontSize: '10px' }}>3. GSTIN / UIN</div>
                    <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '16px' }}>29ABCDE1234F1Z5</div>
                  </div>

                  {/* Laser Scanner */}
                  {scanStep < 4 && (
                    <div style={{
                      position: 'absolute',
                      top: 0, left: 0, right: 0,
                      height: '2px',
                      background: '#3b82f6',
                      boxShadow: '0 0 10px 2px rgba(59, 130, 246, 0.8), 0 0 20px 4px rgba(59, 130, 246, 0.4)',
                      animation: 'scan-laser 2s infinite ease-in-out alternate'
                    }} />
                  )}

                  {/* Validation Highlights */}
                  {scanStep >= 2 && (
                    <div style={{ position: 'absolute', top: '180px', left: '20px', right: '20px', height: '30px', border: '2px solid #22c55e', background: 'rgba(34, 197, 94, 0.1)' }}>
                      <span style={{ position: 'absolute', right: 0, top: '-20px', background: '#22c55e', color: '#fff', fontSize: '10px', padding: '2px 6px', fontWeight: 'bold' }}>PIXEL VARIANCE MATCH</span>
                    </div>
                  )}
                  {scanStep >= 3 && (
                    <div style={{ position: 'absolute', top: '240px', left: '20px', right: '20px', height: '30px', border: '2px solid #22c55e', background: 'rgba(34, 197, 94, 0.1)' }}>
                      <span style={{ position: 'absolute', right: 0, top: '-20px', background: '#22c55e', color: '#fff', fontSize: '10px', padding: '2px 6px', fontWeight: 'bold' }}>TAMPER CHECK PASSED</span>
                    </div>
                  )}

                  <style>{`
                    @keyframes scan-laser {
                      0% { top: 0%; }
                      100% { top: 98%; }
                    }
                  `}</style>
                </div>
              </div>

              {/* Right Column: Logs */}
              <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <h3 style={{ color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>Forensic Analysis Log</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontFamily: 'monospace' }}>
                    <div style={{ display: 'flex', gap: '12px', opacity: scanStep >= 0 ? 1 : 0, transition: 'opacity 0.3s' }}>
                      <Lock size={16} color="#3b82f6" />
                      <div>
                        <div style={{ color: '#f8fafc', fontSize: '13px' }}>Initializing Tensor Core...</div>
                        <div style={{ color: '#64748b', fontSize: '11px' }}>Loading document boundaries</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', opacity: scanStep >= 1 ? 1 : 0, transition: 'opacity 0.3s' }}>
                      <Fingerprint size={16} color={scanStep >= 2 ? '#22c55e' : '#eab308'} />
                      <div>
                        <div style={{ color: scanStep >= 2 ? '#22c55e' : '#eab308', fontSize: '13px' }}>{scanStep >= 2 ? 'Metadata Extracted' : 'Extracting Metadata...'}</div>
                        <div style={{ color: '#64748b', fontSize: '11px' }}>Analyzing EXIF & creation origins</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', opacity: scanStep >= 2 ? 1 : 0, transition: 'opacity 0.3s' }}>
                      <ShieldAlert size={16} color={scanStep >= 3 ? '#22c55e' : '#eab308'} />
                      <div>
                        <div style={{ color: scanStep >= 3 ? '#22c55e' : '#eab308', fontSize: '13px' }}>{scanStep >= 3 ? 'No Forgery Artifacts' : 'Pixel Variance Analysis...'}</div>
                        <div style={{ color: '#64748b', fontSize: '11px' }}>Scanning for Photoshop/GIMP traces</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', opacity: scanStep >= 3 ? 1 : 0, transition: 'opacity 0.3s' }}>
                      <CheckCircle2 size={16} color={scanStep >= 4 ? '#22c55e' : '#eab308'} />
                      <div>
                        <div style={{ color: scanStep >= 4 ? '#22c55e' : '#eab308', fontSize: '13px' }}>{scanStep >= 4 ? 'Digital Signature Verified' : 'Checking cryptographic seals...'}</div>
                        <div style={{ color: '#64748b', fontSize: '11px' }}>Validating CA authority</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Final Verdict */}
                <div style={{ 
                  marginTop: 'auto', 
                  background: scanStep >= 4 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(30, 41, 59, 0.5)',
                  border: `1px solid ${scanStep >= 4 ? '#22c55e' : '#334155'}`,
                  borderRadius: '8px',
                  padding: '16px',
                  opacity: scanStep >= 4 ? 1 : 0.5,
                  transition: 'all 0.5s'
                }}>
                  <div style={{ color: scanStep >= 4 ? '#22c55e' : '#94a3b8', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Final Verdict</div>
                  <div style={{ color: scanStep >= 4 ? '#4ade80' : '#f8fafc', fontSize: '16px', fontWeight: 600 }}>
                    {scanStep >= 4 ? 'Authentic Document. No modifications detected.' : 'Analysis in progress...'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
