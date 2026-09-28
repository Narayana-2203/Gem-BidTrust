'use client';

import TopBar from '@/components/TopBar';
import { CloudDownload, Sparkles, CheckCircle2, ShieldAlert, FileText, Database, Settings } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ImportPage() {
  const [tenderId, setTenderId] = useState('GEM/2026/B/10231');
  const [isFetching, setIsFetching] = useState(false);
  const [fetchResult, setFetchResult] = useState<{ bidders: number; docs: number; time: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'uploading' | 'success' | 'error' | null>(null);
  const [parsedData, setParsedData] = useState<any>(null);
  const router = useRouter();

  const handleFetch = () => {
    setIsFetching(true);
    setFetchResult(null);
    // Simulate API call to GeM
    setTimeout(() => {
      setIsFetching(false);
      setFetchResult({ bidders: 124, docs: 1364, time: '0.4s' });
    }, 400);
  };

  const handleStartAI = () => {
    setIsProcessing(true);
    setTimeout(() => {
      router.push(`/tenders/${encodeURIComponent(tenderId.replace(/\//g, '-'))}`);
    }, 400);
  };

  return (
    <>
      <TopBar breadcrumbs={[{ label: 'Import Tender' }]} />

      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">GeM API Integration</h1>
          <p className="page-subtitle">
            Directly fetch tender details, bidder lists, and submitted documents from GeM using secure API integration. Zero manual uploads required.
          </p>
        </div>

        <div className="two-col">
          {/* LEFT: Fetch Configuration */}
          <div className="card animate-in stagger-1">
            <div className="card-header">
              <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CloudDownload size={18} />
                Fetch Tender Data
              </h3>
            </div>
            <div className="card-body">
              <div className="filter-group" style={{ marginBottom: 20 }}>
                <label className="filter-label" style={{ fontSize: 13 }}>Tender ID (GeM Bid Number)</label>
                <div style={{ display: 'flex', gap: 12 }}>
                  <input
                    className="filter-input"
                    style={{ flex: 1, fontSize: 16, padding: '12px 16px', fontFamily: '"JetBrains Mono", monospace' }}
                    value={tenderId}
                    onChange={(e) => setTenderId(e.target.value)}
                    placeholder="e.g. GEM/2026/B/10231"
                  />
                  <button
                    className="btn btn-primary"
                    onClick={handleFetch}
                    disabled={isFetching || !tenderId}
                    style={{ padding: '0 24px' }}
                  >
                    {isFetching ? (
                      <>
                        <span className="spinner" /> Fetching...
                      </>
                    ) : (
                      'Fetch Data'
                    )}
                  </button>
                </div>
              </div>

              <div style={{ padding: '16px', background: 'var(--surface-100)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-medium)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <Database size={16} color="var(--text-muted)" />
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Integration Settings</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                    <input type="checkbox" defaultChecked /> Pull Bidder Profiles (GST, PAN, Udyam)
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                    <input type="checkbox" defaultChecked /> Pull Submitted Documents (PDFs)
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                    <input type="checkbox" defaultChecked /> Sync Financial Data (ITR references)
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Results & Processing */}
          <div className="card animate-in stagger-2">
            <div className="card-header">
              <h3 className="card-title">Integration Status</h3>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 250 }}>
              
              {!fetchResult && !isFetching && (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                  <CloudDownload size={48} style={{ opacity: 0.2, margin: '0 auto 16px' }} />
                  <p>Enter a Tender ID to pull data from GeM.</p>
                </div>
              )}

              {isFetching && (
                <div style={{ textAlign: 'center' }}>
                  <div className="spinner" style={{ width: 32, height: 32, borderWidth: 3, borderColor: 'var(--info) transparent var(--info) transparent', margin: '0 auto 16px' }} />
                  <p style={{ fontWeight: 500, color: 'var(--text-primary)' }}>Establishing secure connection to GeM API...</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Authenticating via OAuth 2.0</p>
                </div>
              )}

              {fetchResult && (
                <div className="animate-in" style={{ animationDelay: '0.1s' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 24, padding: '16px', background: 'var(--success-light)', border: '1px solid var(--success)', borderRadius: 'var(--radius-md)' }}>
                    <CheckCircle2 size={24} color="var(--success)" style={{ flexShrink: 0 }} />
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: 14, color: 'var(--text-primary)' }}>Successfully synchronized with GeM</h4>
                      <p style={{ margin: 0, fontSize: 12.5, color: 'var(--text-secondary)' }}>
                        Retrieved all bidder data and documents for {tenderId} in {fetchResult.time}.
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
                    <div style={{ flex: 1, padding: '16px', background: 'var(--surface-50)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                      <div style={{ fontSize: 24, fontWeight: 700, fontFamily: '"Inter", sans-serif', color: 'var(--text-primary)' }}>
                        {fetchResult.bidders}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>Bidders Found</div>
                    </div>
                    <div style={{ flex: 1, padding: '16px', background: 'var(--surface-50)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                      <div style={{ fontSize: 24, fontWeight: 700, fontFamily: '"Inter", sans-serif', color: 'var(--info)' }}>
                        {(fetchResult.docs / 1000).toFixed(1)}k
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>Documents Pulled</div>
                    </div>
                  </div>

                  <button
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '14px', fontSize: 15, justifyContent: 'center' }}
                    onClick={handleStartAI}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <span className="spinner" /> Analyzing {fetchResult.bidders} Bidders...
                      </>
                    ) : (
                      <>
                        <Sparkles size={18} />
                        Run AI Batch Verification
                      </>
                    )}
                  </button>
                  <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-muted)', marginTop: 12 }}>
                    This will automatically cross-verify all {fetchResult.bidders} bidders against GSTN, EPFO, and MCA portals.
                  </p>
                </div>
              )}

            </div>
          </div>
        </div>
        
        {/* MANUAL DOCUMENT UPLOAD & AI OCR */}
        <div className="card animate-in stagger-3" style={{ marginTop: 32 }}>
          <div className="card-header">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FileText size={18} />
              AI Document OCR & Manual Parsing
            </h3>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Upload standalone PDF documents for direct entity extraction (PAN, GSTIN, Turnover)</span>
          </div>
          <div className="card-body">
             <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 300px' }}>
                  <div 
                    style={{ 
                      border: '2px dashed var(--border-medium)', 
                      borderRadius: 'var(--radius-lg)', 
                      padding: 40, 
                      textAlign: 'center',
                      background: 'var(--surface-50)',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onClick={() => {
                        // Simulate file selection and upload
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'application/pdf';
                        input.onchange = async (e: any) => {
                           const file = e.target.files[0];
                           if (!file) return;
                           
                           setUploadStatus('uploading');
                           
                           // Send to FastAPI
                           const formData = new FormData();
                           formData.append('file', file);
                           
                           try {
                             const res = await fetch('http://localhost:8000/api/v1/import/parse-pdf', {
                               method: 'POST',
                               body: formData
                             });
                             const data = await res.json();
                             setParsedData(data);
                             setUploadStatus('success');
                           } catch (err) {
                             console.error(err);
                             setUploadStatus('error');
                           }
                        };
                        input.click();
                    }}
                  >
                     <CloudDownload size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 12px' }} />
                     <h4 style={{ margin: '0 0 8px 0', color: 'var(--text-primary)' }}>Click to Upload PDF</h4>
                     <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0 }}>Financials, MSME Certificates, or Audit Reports</p>
                  </div>
                </div>
                
                <div style={{ flex: '2 1 400px', background: 'var(--surface-100)', borderRadius: 'var(--radius-md)', padding: 20, minHeight: 200, border: '1px solid var(--border-light)' }}>
                   {!uploadStatus && (
                     <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                        Parsed data will appear here
                     </div>
                   )}
                   {uploadStatus === 'uploading' && (
                     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        <div className="spinner" style={{ width: 32, height: 32, borderWidth: 3, borderColor: 'var(--primary) transparent var(--primary) transparent', marginBottom: 12 }} />
                        <div style={{ color: 'var(--primary)', fontWeight: 500 }}>Running AI OCR & Extraction...</div>
                     </div>
                   )}
                   {uploadStatus === 'success' && parsedData && (
                     <div className="animate-in fade-in" style={{ height: '100%', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                          <h4 style={{ margin: 0, fontWeight: 600, color: 'var(--text-primary)' }}>Extraction Results</h4>
                          <span style={{ fontSize: 11, background: 'var(--success-light)', color: 'var(--success)', padding: '2px 8px', borderRadius: 12, fontWeight: 600 }}>
                            AI Confidence: {parsedData.extractedData?.aiConfidenceScore * 100}%
                          </span>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                           {Object.entries(parsedData.extractedData?.extractedEntities || {}).map(([key, val]: any, idx) => (
                             <div key={idx} style={{ background: '#fff', padding: '10px 14px', borderRadius: 6, border: '1px solid var(--border-light)' }}>
                                <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, marginBottom: 4 }}>{key}</div>
                                <div style={{ fontSize: 13, fontWeight: 500, fontFamily: 'monospace' }}>
                                   {typeof val === 'object' ? JSON.stringify(val) : val}
                                </div>
                             </div>
                           ))}
                        </div>

                        <h4 style={{ margin: '16px 0 8px 0', fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase' }}>File Metadata (Fingerprinting)</h4>
                        <div style={{ background: '#fff', padding: '10px 14px', borderRadius: 6, border: '1px solid var(--border-light)', fontSize: 12, color: 'var(--text-secondary)' }}>
                           <div><strong>Author:</strong> {parsedData.extractedData?.metadata?.author}</div>
                           <div><strong>Software:</strong> {parsedData.extractedData?.metadata?.software}</div>
                           <div><strong>Tampered:</strong> {parsedData.extractedData?.tamperCheck?.hasModifications ? 'Yes (Flagged)' : 'No'}</div>
                        </div>
                     </div>
                   )}
                   {uploadStatus === 'error' && (
                     <div style={{ color: 'var(--danger)', textAlign: 'center', marginTop: 80 }}>Failed to parse document. Check backend connection.</div>
                   )}
                </div>
             </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top: 2px solid #fff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          display: inline-block;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
