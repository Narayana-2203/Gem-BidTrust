'use client';
import { useState } from 'react';
import TopBar from '@/components/TopBar';
import { Users, Search } from 'lucide-react';

const allBidders = [
  { name: 'Bharat Electronics Ltd', gstin: '29AABCB1234F1ZP', pan: 'AABCB1234F', state: 'Karnataka', msme: 'Large', bids: 24, score: 82, risk: 'medium' },
  { name: 'HCL Technologies Ltd', gstin: '09AABCH1234G1ZQ', pan: 'AABCH1234G', state: 'UP', msme: 'Large', bids: 18, score: 96, risk: 'low' },
  { name: 'Micro Systems Pvt Ltd', gstin: '27AAECM4321H1ZR', pan: 'AAECM4321H', state: 'Maharashtra', msme: 'Micro', bids: 6, score: 71, risk: 'medium' },
  { name: 'GreenTech Solutions', gstin: '06AADCG5678I1ZS', pan: 'AADCG5678I', state: 'Haryana', msme: 'Small', bids: 12, score: 58, risk: 'high' },
  { name: 'Tata Consulting Engineers', gstin: '27AAACT1234J1ZT', pan: 'AAACT1234J', state: 'Maharashtra', msme: 'Large', bids: 31, score: 94, risk: 'low' },
];

export default function BiddersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [msmeFilter, setMsmeFilter] = useState('all');

  const filtered = allBidders.filter(b => {
    const matchSearch = !searchTerm || 
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      b.gstin.toLowerCase().includes(searchTerm.toLowerCase()) || 
      b.pan.toLowerCase().includes(searchTerm.toLowerCase());
    const matchMsme = msmeFilter === 'all' || b.msme.toLowerCase() === msmeFilter.toLowerCase();
    return matchSearch && matchMsme;
  });

  return (
    <>
      <TopBar breadcrumbs={[{ label: 'Bidders' }]} />
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Bidder Registry</h1>
          <p className="page-subtitle">Registered bidders with verification history and compliance profiles</p>
        </div>
        <div className="filter-section animate-in">
          <div className="filter-row">
            <div className="filter-group" style={{ flex: 2 }}>
              <label className="filter-label">Search Bidder</label>
              <div style={{ position: 'relative' }}>
                <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  className="filter-input" 
                  style={{ width: '100%', paddingLeft: 36 }} 
                  placeholder="Search by company name, GSTIN, PAN..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="filter-group" style={{ minWidth: 130 }}>
              <label className="filter-label">MSME Category</label>
              <select className="filter-select" value={msmeFilter} onChange={(e) => setMsmeFilter(e.target.value)}>
                <option value="all">All Categories</option>
                <option value="micro">Micro</option>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
            <div style={{ alignSelf: 'flex-end' }}>
              <button className="btn btn-primary">
                <Search size={14} /> Search
              </button>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div style={{ margin: '12px 0', fontSize: 13, color: 'var(--text-muted)' }}>
          Showing <strong style={{ color: 'var(--text-primary)' }}>{filtered.length}</strong> of <strong style={{ color: 'var(--text-primary)' }}>{allBidders.length}</strong> bidders
        </div>

        <div className="card animate-in" style={{ animationDelay: '0.15s' }}>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead><tr><th>#</th><th>Company Name</th><th>GSTIN</th><th>PAN</th><th>State</th><th>MSME</th><th>Bids Filed</th><th>Avg Score</th><th>Risk</th></tr></thead>
              <tbody>
                {filtered.map((b, i) => (
                  <tr key={i}>
                    <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{i + 1}</td>
                    <td style={{ fontWeight: 600 }}>{b.name}</td>
                    <td className="col-id">{b.gstin}</td>
                    <td className="monospace" style={{ fontSize: 12 }}>{b.pan}</td>
                    <td style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>{b.state}</td>
                    <td><span className="status-badge status-active">{b.msme}</span></td>
                    <td className="col-number">{b.bids}</td>
                    <td className="col-number" style={{ fontWeight: 600, color: b.score >= 80 ? 'var(--success)' : b.score >= 60 ? 'var(--warning)' : 'var(--danger)' }}>{b.score}</td>
                    <td><span className={`risk-indicator risk-${b.risk}`}><span className="risk-dot" />{b.risk.charAt(0).toUpperCase() + b.risk.slice(1)}</span></td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={9} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                      No bidders found matching your search criteria.
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
