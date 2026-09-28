'use client';

import TopBar from '@/components/TopBar';
import { api } from '@/services/api';
import { tenders as mockTenders, tenderBidders as mockBidders } from '@/data/mockData';
import { Search, ShieldCheck, AlertTriangle, Download, ArrowLeft, PlayCircle, Users } from 'lucide-react';
import Link from 'next/link';
import { useState, use, useEffect } from 'react';

export default function TenderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const tenderId = decodeURIComponent(resolvedParams.id).replace(/-/g, '/');
  
    const [tender, setTender] = useState<Record<string, any> | null>(
    mockTenders.find(t => t.bidId === tenderId) || mockTenders[0]
  );
  const [tenderBidders, setTenderBidders] = useState<any>(mockBidders);
  const [loading] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const biddersArray = Array.isArray(tenderBidders) ? tenderBidders : ((tenderBidders as any)?.bidders || []);
  const filteredBidders = biddersArray.filter((b: any) => {
    const matchSearch = !searchTerm || b?.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) || b?.gstin?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRisk = riskFilter === 'all' || b?.riskLevel === riskFilter;
    const matchStatus = statusFilter === 'all' || b?.status === statusFilter;
    return matchSearch && matchRisk && matchStatus;
  });

  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      // Simulate file download
      const link = document.createElement('a');
      link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent('BID EVALUATION COMMITTEE REPORT\n\n' + (tender?.title || ''));
      link.download = `Tender_Report_${tenderId.replace(/\//g, '_')}.pdf`;
      link.click();
    }, 2000);
  };
  
  if (loading || !tender) {
    return (
      <>
        <TopBar breadcrumbs={[{ label: 'Tenders', href: '/tenders' }, { label: tenderId }]} />
        <div className="page-container">Loading...</div>
      </>
    );
  }

  return (
    <>
      <TopBar breadcrumbs={[{ label: 'Tenders', href: '/tenders' }, { label: tenderId }]} />

      <div className="page-container">
        <div style={{ marginBottom: 20 }}>
          <Link href="/tenders" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none' }}>
            <ArrowLeft size={14} /> Back to Tender Explorer
          </Link>
        </div>

        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <span className="monospace" style={{ padding: '4px 8px', background: 'var(--surface-200)', borderRadius: '4px', fontSize: 12, fontWeight: 600 }}>
                {tenderId}
              </span>
              <span className={`status-badge status-${tender.status.replace('_', '-')}`}>
                {tender.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            <h1 className="page-title">{tender.title}</h1>
            <p className="page-subtitle" style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <span><strong>Department:</strong> {tender.department}</span>
              <span><strong>Est. Value:</strong> ₹{(tender.estimatedValue / 100).toFixed(2)} Cr</span>
              <span><strong>Closing:</strong> {tender.closingDate}</span>
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-ghost btn-sm" onClick={handleExport} disabled={isExporting}>
              {isExporting ? <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> : <Download size={14} />} 
              {isExporting ? 'Generating PDF...' : 'Export Report'}
            </button>
            <button className="btn btn-primary btn-sm">
              <PlayCircle size={14} /> Re-run AI Verification
            </button>
          </div>
        </div>

        {/* KPI Row */}
        <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 24 }}>
          <div className="kpi-card kpi-blue animate-in stagger-1">
            <div className="kpi-label">Total Bidders</div>
            <div className="kpi-value">{tenderBidders.length}</div>
            <div className="kpi-icon" style={{ color: 'var(--info)' }}><Users size={38} /></div>
          </div>
          <div className="kpi-card kpi-green animate-in stagger-2">
            <div className="kpi-label">Fully Compliant</div>
            <div className="kpi-value">{tenderBidders.filter((b: any) => b.status === 'verified').length}</div>
            <div className="kpi-icon" style={{ color: 'var(--success)' }}><ShieldCheck size={38} /></div>
          </div>
          <div className="kpi-card kpi-amber animate-in stagger-3">
            <div className="kpi-label">Needs Review</div>
            <div className="kpi-value">{tenderBidders.filter((b: any) => b.status === 'needs_review').length}</div>
            <div className="kpi-icon" style={{ color: 'var(--warning)' }}><AlertTriangle size={38} /></div>
          </div>
          <div className="kpi-card kpi-red animate-in stagger-4">
            <div className="kpi-label">Non-Compliant (High Risk)</div>
            <div className="kpi-value">{tenderBidders.filter((b: any) => b.riskLevel === 'high').length}</div>
            <div className="kpi-icon" style={{ color: 'var(--danger)' }}><AlertTriangle size={38} /></div>
          </div>
        </div>

        {/* Filters */}
        <div className="filter-section animate-in" style={{ animationDelay: '0.1s' }}>
          <div className="filter-row">
            <div className="filter-group" style={{ flex: 2 }}>
              <label className="filter-label">Search Bidders</label>
              <div style={{ position: 'relative' }}>
                <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  className="filter-input"
                  style={{ width: '100%', paddingLeft: 36 }}
                  placeholder="Search by company name, GSTIN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="filter-group" style={{ minWidth: 140 }}>
              <label className="filter-label">Risk Level</label>
              <select className="filter-select" value={riskFilter} onChange={e => setRiskFilter(e.target.value)}>
                <option value="all">All Risk Levels</option>
                <option value="low">Low Risk</option>
                <option value="medium">Medium Risk</option>
                <option value="high">High Risk</option>
              </select>
            </div>
            <div className="filter-group" style={{ minWidth: 140 }}>
              <label className="filter-label">Compliance Status</label>
              <select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="all">All Statuses</option>
                <option value="verified">Verified (Compliant)</option>
                <option value="needs_review">Needs Review</option>
                <option value="non_compliant">Non-Compliant</option>
              </select>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Showing <strong style={{ color: 'var(--text-primary)' }}>{filteredBidders.length}</strong> bidders
          </span>
        </div>

        {/* Data Table */}
        <div className="card animate-in" style={{ animationDelay: '0.15s' }}>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: 40 }}>#</th>
                  <th style={{ width: '25%' }}>Bidder Name</th>
                  <th>GSTIN</th>
                  <th>MSME Category</th>
                  <th style={{ textAlign: 'center' }}>Docs Analysed</th>
                  <th>Compliance Score</th>
                  <th>Risk Level</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredBidders.map((b: any, i: number) => (
                  <tr key={b.id}>
                    <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{i + 1}</td>
                    <td style={{ fontWeight: 600 }}>{b.companyName}</td>
                    <td className="monospace" style={{ fontSize: 12.5 }}>{b.gstin}</td>
                    <td><span style={{ textTransform: 'capitalize', fontSize: 12.5 }}>{b.msmeCategory}</span></td>
                    <td className="col-number">{b.documentsAnalyzed}</td>
                    <td className="col-number" style={{ 
                      fontWeight: 600, 
                      color: b.complianceScore >= 80 ? 'var(--success)' : b.complianceScore >= 60 ? 'var(--warning)' : 'var(--danger)' 
                    }}>
                      {b.complianceScore} / 100
                    </td>
                    <td>
                      <span className={`risk-indicator risk-${b.riskLevel}`}>
                        <span className="risk-dot" />
                        {b.riskLevel.charAt(0).toUpperCase() + b.riskLevel.slice(1)}
                      </span>
                    </td>
                    <td>
                      {b.status === 'verified' && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: 'var(--success)', fontSize: 12, fontWeight: 600 }}><ShieldCheck size={14} /> Verified</span>}
                      {b.status === 'needs_review' && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: 'var(--warning)', fontSize: 12, fontWeight: 600 }}><AlertTriangle size={14} /> Review Needed</span>}
                      {b.status === 'non_compliant' && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: 'var(--danger)', fontSize: 12, fontWeight: 600 }}><AlertTriangle size={14} /> Non-Compliant</span>}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <Link href={`/evaluate/${encodeURIComponent(b.id)}`} className="btn btn-ghost btn-sm">
                        Evaluate
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
