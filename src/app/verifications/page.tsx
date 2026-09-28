'use client';
import { useState } from 'react';
import TopBar from '@/components/TopBar';
import { Shield, CheckCircle2, Clock, XCircle, RefreshCw, Search } from 'lucide-react';

const initialVerifications = [
  { bidId: 'GEM/2026/B/10231', company: 'Bharat Electronics Ltd', type: 'GST + PAN + Udyam', result: 'verified', checks: 10, passed: 8, time: '14 min', date: '22 Apr 2026' },
  { bidId: 'GEM/2026/B/10232', company: 'SecureTech Pvt Ltd', type: 'GST + PAN', result: 'verified', checks: 8, passed: 8, time: '11 min', date: '22 Apr 2026' },
  { bidId: 'GEM/2026/B/10233', company: 'MediCorp India', type: 'Full Compliance', result: 'needs_review', checks: 10, passed: 7, time: '18 min', date: '22 Apr 2026' },
  { bidId: 'GEM/2026/B/10234', company: 'SolarMax Energy', type: 'GST + MII + EPFO', result: 'verified', checks: 9, passed: 9, time: '12 min', date: '21 Apr 2026' },
  { bidId: 'GEM/2026/B/10238', company: 'CloudNet Solutions', type: 'Full Compliance', result: 'non_compliant', checks: 10, passed: 5, time: '22 min', date: '21 Apr 2026' },
];

export default function VerificationsPage() {
  const [verifications, setVerifications] = useState(initialVerifications);
  const [resultFilter, setResultFilter] = useState('all');
  const [rerunning, setRerunning] = useState<number | null>(null);

  const filtered = verifications.filter(v => resultFilter === 'all' || v.result === resultFilter);

  const handleRerun = (index: number) => {
    setRerunning(index);
    setTimeout(() => {
      setVerifications(prev => prev.map((v, i) => i === index ? { ...v, time: `${Math.floor(Math.random() * 10) + 8} min`, date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) } : v));
      setRerunning(null);
    }, 1500);
  };

  return (
    <>
      <TopBar breadcrumbs={[{ label: 'Verifications' }]} />
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Verification History</h1>
          <p className="page-subtitle">Log of all AI-powered verification runs with results and processing times</p>
        </div>

        {/* Filters */}
        <div className="filter-section animate-in" style={{ marginBottom: 16 }}>
          <div className="filter-row">
            <div className="filter-group" style={{ minWidth: 180 }}>
              <label className="filter-label">Result</label>
              <select className="filter-select" value={resultFilter} onChange={(e) => setResultFilter(e.target.value)}>
                <option value="all">All Results</option>
                <option value="verified">Verified</option>
                <option value="needs_review">Needs Review</option>
                <option value="non_compliant">Non-Compliant</option>
              </select>
            </div>
            <div style={{ alignSelf: 'flex-end', marginLeft: 'auto', fontSize: 13, color: 'var(--text-muted)' }}>
              Showing <strong style={{ color: 'var(--text-primary)' }}>{filtered.length}</strong> of <strong style={{ color: 'var(--text-primary)' }}>{verifications.length}</strong> verifications
            </div>
          </div>
        </div>

        <div className="card animate-in" style={{ animationDelay: '0.1s' }}>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead><tr><th>Bid ID</th><th>Company</th><th>Verification Type</th><th>Result</th><th>Checks</th><th>Passed</th><th>Processing Time</th><th>Date</th><th style={{ textAlign: 'center' }}>Action</th></tr></thead>
              <tbody>
                {filtered.map((v, i) => {
                  const origIndex = verifications.indexOf(v);
                  return (
                    <tr key={i}>
                      <td className="col-id">{v.bidId}</td>
                      <td style={{ fontWeight: 500 }}>{v.company}</td>
                      <td style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>{v.type}</td>
                      <td>
                        {v.result === 'verified' && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: 'var(--success)', fontSize: 12.5, fontWeight: 600 }}><CheckCircle2 size={14} /> Verified</span>}
                        {v.result === 'needs_review' && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: 'var(--warning)', fontSize: 12.5, fontWeight: 600 }}><Clock size={14} /> Needs Review</span>}
                        {v.result === 'non_compliant' && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: 'var(--danger)', fontSize: 12.5, fontWeight: 600 }}><XCircle size={14} /> Non-Compliant</span>}
                      </td>
                      <td className="col-number">{v.checks}</td>
                      <td className="col-number" style={{ color: v.passed === v.checks ? 'var(--success)' : 'var(--warning)', fontWeight: 600 }}>{v.passed}/{v.checks}</td>
                      <td className="monospace" style={{ fontSize: 12, color: 'var(--text-muted)' }}>{v.time}</td>
                      <td style={{ fontSize: 12.5 }}>{v.date}</td>
                      <td style={{ textAlign: 'center' }}>
                        <button 
                          className="btn btn-ghost btn-sm" 
                          onClick={() => handleRerun(origIndex)}
                          disabled={rerunning === origIndex}
                        >
                          <RefreshCw size={12} className={rerunning === origIndex ? 'spin' : ''} /> 
                          {rerunning === origIndex ? 'Running...' : 'Re-run'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
