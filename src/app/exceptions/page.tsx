'use client';
import { useState } from 'react';
import TopBar from '@/components/TopBar';
import { AlertTriangle, CheckCircle2, Filter, Search } from 'lucide-react';

const initialExceptions = [
  { bidId: 'GEM/2026/B/10231', company: 'Bharat Electronics Ltd', issue: 'Make in India local content 42% below threshold 50%', severity: 'high', status: 'Pending', date: '22 Apr 2026' },
  { bidId: 'GEM/2026/B/10231', company: 'Bharat Electronics Ltd', issue: 'ITR turnover discrepancy ₹12.4L (AY 2025-26)', severity: 'medium', status: 'Pending', date: '22 Apr 2026' },
  { bidId: 'GEM/2026/B/10238', company: 'CloudNet Solutions', issue: 'GST returns not filed for 4 months', severity: 'high', status: 'Pending', date: '21 Apr 2026' },
  { bidId: 'GEM/2026/B/10238', company: 'CloudNet Solutions', issue: 'EPFO ECR filing delayed by 3 months', severity: 'medium', status: 'Pending', date: '21 Apr 2026' },
  { bidId: 'GEM/2026/B/10236', company: 'RailTech Maintenance Co', issue: 'Shared Director with debarred entity (DIN match)', severity: 'high', status: 'Pending', date: '20 Apr 2026' },
];

export default function ExceptionsPage() {
  const [exceptions, setExceptions] = useState(initialExceptions);
  const [severityFilter, setSeverityFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = exceptions.filter(e => {
    const matchSeverity = severityFilter === 'all' || e.severity === severityFilter;
    const matchSearch = !searchTerm || 
      e.company.toLowerCase().includes(searchTerm.toLowerCase()) || 
      e.bidId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.issue.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSeverity && matchSearch;
  });

  const handleMarkReviewed = (index: number) => {
    setExceptions(prev => prev.map((e, i) => i === index ? { ...e, status: 'Reviewed ✓' } : e));
  };

  return (
    <>
      <TopBar breadcrumbs={[{ label: 'Exceptions' }]} />
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Exceptions & Flags</h1>
          <p className="page-subtitle">AI-identified anomalies, discrepancies, and compliance exceptions requiring officer attention</p>
        </div>

        {/* KPIs */}
        <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 20 }}>
          <div className="kpi-card kpi-red animate-in stagger-1">
            <div className="kpi-label">High Severity</div>
            <div className="kpi-value">{exceptions.filter(e => e.severity === 'high').length}</div>
          </div>
          <div className="kpi-card kpi-amber animate-in stagger-2">
            <div className="kpi-label">Medium Severity</div>
            <div className="kpi-value">{exceptions.filter(e => e.severity === 'medium').length}</div>
          </div>
          <div className="kpi-card kpi-green animate-in stagger-3">
            <div className="kpi-label">Reviewed</div>
            <div className="kpi-value">{exceptions.filter(e => e.status === 'Reviewed ✓').length}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="filter-section animate-in" style={{ animationDelay: '0.1s' }}>
          <div className="filter-row">
            <div className="filter-group" style={{ flex: 2 }}>
              <label className="filter-label">Search</label>
              <div style={{ position: 'relative' }}>
                <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  className="filter-input" 
                  style={{ width: '100%', paddingLeft: 36 }} 
                  placeholder="Search by company, bid ID, or issue..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="filter-group" style={{ minWidth: 140 }}>
              <label className="filter-label">Severity</label>
              <select className="filter-select" value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)}>
                <option value="all">All Severities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card animate-in" style={{ animationDelay: '0.15s' }}>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead><tr><th>Bid ID</th><th>Company</th><th style={{ width: '30%' }}>Issue</th><th>Severity</th><th>Resolution Status</th><th>Date</th><th style={{ textAlign: 'center' }}>Action</th></tr></thead>
              <tbody>
                {filtered.map((e, i) => {
                  const origIndex = exceptions.indexOf(e);
                  return (
                    <tr key={i}>
                      <td className="col-id">{e.bidId}</td>
                      <td style={{ fontWeight: 500 }}>{e.company}</td>
                      <td style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{e.issue}</td>
                      <td>
                        <span className={`status-badge ${e.severity === 'high' ? 'status-clarification' : 'status-under-evaluation'}`} style={{ borderLeft: `3px solid ${e.severity === 'high' ? 'var(--danger)' : 'var(--warning)'}`, background: e.severity === 'high' ? 'var(--danger-light)' : 'var(--warning-light)', color: e.severity === 'high' ? 'var(--danger)' : 'var(--warning)' }}>
                          {e.severity === 'high' ? 'High' : 'Medium'}
                        </span>
                      </td>
                      <td style={{ fontSize: 12.5 }}>
                        {e.status === 'Reviewed ✓' ? (
                          <span style={{ color: 'var(--success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                            <CheckCircle2 size={14} /> Reviewed
                          </span>
                        ) : (
                          <span style={{ color: 'var(--warning)' }}>Pending Review</span>
                        )}
                      </td>
                      <td style={{ fontSize: 12.5, whiteSpace: 'nowrap' }}>{e.date}</td>
                      <td style={{ textAlign: 'center' }}>
                        {e.status !== 'Reviewed ✓' ? (
                          <button 
                            className="btn btn-ghost btn-sm" 
                            onClick={() => handleMarkReviewed(origIndex)}
                            style={{ color: 'var(--success)' }}
                          >
                            <CheckCircle2 size={12} /> Mark Reviewed
                          </button>
                        ) : (
                          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Done</span>
                        )}
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
