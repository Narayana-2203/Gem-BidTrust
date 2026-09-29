'use client';

import { useState } from 'react';
import TopBar from '@/components/TopBar';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  Download,
  Calendar,
  Building2,
} from 'lucide-react';
import Link from 'next/link';

// Mock data for reviewed bids
const mockDecisions = [
  {
    id: 'DEC-8921',
    bidderId: 'BID-8291',
    companyName: 'Nexora Tech Solutions Pvt Ltd',
    tenderId: 'GEM/2026/B/10231',
    status: 'qualified',
    timestamp: '2026-09-28T14:22:10Z',
    officer: 'Officer A. Sharma',
    remarks: 'All documents verified. Financials match NSDL.',
    score: 94
  },
  {
    id: 'DEC-8922',
    bidderId: 'BID-9012',
    companyName: 'Global Supply Corporation',
    tenderId: 'GEM/2026/B/10231',
    status: 'disqualified',
    timestamp: '2026-09-28T15:10:05Z',
    officer: 'Officer A. Sharma',
    remarks: 'Disqualified due to CVC debarment list match on Director DIN.',
    score: 32
  },
  {
    id: 'DEC-8923',
    bidderId: 'BID-7734',
    companyName: 'Apex Healthcare Limited',
    tenderId: 'GEM/2026/B/10237',
    status: 'review',
    timestamp: '2026-09-29T09:14:22Z',
    officer: 'Officer K. Patel',
    remarks: 'Flagged for manual review. IP overlap detected with competitor.',
    score: 68
  },
  {
    id: 'DEC-8924',
    bidderId: 'BID-5521',
    companyName: 'SecureIT Systems Ltd',
    tenderId: 'GEM/2026/B/10231',
    status: 'qualified',
    timestamp: '2026-09-29T10:05:11Z',
    officer: 'Officer K. Patel',
    remarks: 'Cleared. DigiLocker hashes confirmed.',
    score: 88
  },
  {
    id: 'DEC-8925',
    bidderId: 'BID-1102',
    companyName: 'Metro Builders Co.',
    tenderId: 'GEM/2026/B/10452',
    status: 'disqualified',
    timestamp: '2026-09-27T11:45:00Z',
    officer: 'Officer A. Sharma',
    remarks: 'Forged GST certificate detected via OCR and live API check.',
    score: 12
  }
];

export default function DecisionsPage() {
  const [tabFilter, setTabFilter] = useState<'all' | 'qualified' | 'disqualified' | 'review'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDecisions = mockDecisions.filter(d => {
    if (tabFilter !== 'all' && d.status !== tabFilter) return false;
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      return (
        d.companyName.toLowerCase().includes(lower) ||
        d.bidderId.toLowerCase().includes(lower) ||
        d.tenderId.toLowerCase().includes(lower)
      );
    }
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'qualified':
        return (
          <span className="status-badge" style={{ background: 'var(--success-light)', color: 'var(--success)', border: '1px solid var(--success)' }}>
            <CheckCircle2 size={12} />
            Qualified
          </span>
        );
      case 'disqualified':
        return (
          <span className="status-badge" style={{ background: 'var(--danger-light)', color: 'var(--danger)', border: '1px solid var(--danger)' }}>
            <XCircle size={12} />
            Disqualified
          </span>
        );
      case 'review':
        return (
          <span className="status-badge" style={{ background: 'var(--warning-light)', color: 'var(--warning)', border: '1px solid var(--warning)' }}>
            <AlertTriangle size={12} />
            Manual Review
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <TopBar breadcrumbs={[{ label: 'Reviewed Bids' }]} />
      
      <div className="page-container">
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '28px',
          borderBottom: '1px solid var(--border-light)',
          paddingBottom: '16px'
        }}>
          <div>
            <h1 className="page-title" style={{ marginBottom: '6px' }}>Reviewed Bids Log</h1>
            <p className="page-subtitle">
              Comprehensive ledger of all officer decisions: Qualifications, Disqualifications, and Manual Reviews.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-ghost btn-sm">
              <Download size={14} /> Export CSV
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="filter-section">
          <div className="filter-row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '8px', background: 'var(--surface-100)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <button 
                onClick={() => setTabFilter('all')}
                className={`btn ${tabFilter === 'all' ? '' : 'btn-ghost'}`} 
                style={{ background: tabFilter === 'all' ? 'var(--info)' : 'transparent', color: tabFilter === 'all' ? '#fff' : 'var(--text-secondary)', border: 'none', fontSize: '12.5px', padding: '6px 14px' }}>
                All Decisions
              </button>
              <button 
                onClick={() => setTabFilter('qualified')}
                className={`btn ${tabFilter === 'qualified' ? '' : 'btn-ghost'}`} 
                style={{ background: tabFilter === 'qualified' ? 'var(--success)' : 'transparent', color: tabFilter === 'qualified' ? '#fff' : 'var(--text-secondary)', border: 'none', fontSize: '12.5px', padding: '6px 14px' }}>
                Qualified
              </button>
              <button 
                onClick={() => setTabFilter('review')}
                className={`btn ${tabFilter === 'review' ? '' : 'btn-ghost'}`} 
                style={{ background: tabFilter === 'review' ? 'var(--warning)' : 'transparent', color: tabFilter === 'review' ? '#fff' : 'var(--text-secondary)', border: 'none', fontSize: '12.5px', padding: '6px 14px' }}>
                Manual Review
              </button>
              <button 
                onClick={() => setTabFilter('disqualified')}
                className={`btn ${tabFilter === 'disqualified' ? '' : 'btn-ghost'}`} 
                style={{ background: tabFilter === 'disqualified' ? 'var(--danger)' : 'transparent', color: tabFilter === 'disqualified' ? '#fff' : 'var(--text-secondary)', border: 'none', fontSize: '12.5px', padding: '6px 14px' }}>
                Disqualified
              </button>
            </div>

            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div className="filter-group" style={{ margin: 0, width: 250 }}>
                <div style={{ position: 'relative' }}>
                  <Search size={14} style={{ position: 'absolute', left: 10, top: 10, color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    className="filter-input"
                    placeholder="Search company or ID..."
                    style={{ paddingLeft: 32 }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <button className="btn btn-primary" style={{ padding: '8px 16px' }}>
                <Filter size={14} />
                Filter
              </button>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="card animate-in">
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '12%' }}>Decision ID</th>
                  <th style={{ width: '25%' }}>Bidder & Tender</th>
                  <th style={{ width: '15%' }}>Officer Status</th>
                  <th style={{ width: '10%' }}>AI Score</th>
                  <th style={{ width: '25%' }}>Remarks</th>
                  <th style={{ width: '13%' }}>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {filteredDecisions.length > 0 ? (
                  filteredDecisions.map((d) => (
                    <tr key={d.id}>
                      <td className="col-id" style={{ fontSize: 12 }}>
                        {d.id}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Building2 size={13} color="var(--text-muted)" />
                          {d.companyName}
                        </div>
                        <div style={{ fontSize: 11.5, color: 'var(--text-muted)', display: 'flex', gap: 8 }}>
                          <span>Bid: <Link href={`/evaluate/${d.bidderId}`} style={{ color: 'var(--info)' }}>{d.bidderId}</Link></span>
                          <span>|</span>
                          <span>Tender: {d.tenderId}</span>
                        </div>
                      </td>
                      <td>
                        {getStatusBadge(d.status)}
                      </td>
                      <td>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 32, height: 32,
                          borderRadius: '50%',
                          background: d.score > 80 ? 'var(--success-light)' : d.score > 50 ? 'var(--warning-light)' : 'var(--danger-light)',
                          color: d.score > 80 ? 'var(--success)' : d.score > 50 ? 'var(--warning)' : 'var(--danger)',
                          fontWeight: 700,
                          fontSize: 12
                        }}>
                          {d.score}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                          {d.remarks}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                          By: {d.officer}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-muted)', fontFamily: '"JetBrains Mono", monospace' }}>
                          <Calendar size={12} />
                          {new Date(d.timestamp).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                      No decisions found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </>
  );
}
