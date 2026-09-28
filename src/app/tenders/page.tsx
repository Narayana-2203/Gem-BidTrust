'use client';

import TopBar from '@/components/TopBar';
import { formatINR, getStatusLabel, tenders as mockTenders } from '@/data/mockData';
import { api } from '@/services/api';
import { Search, RotateCcw, Filter } from 'lucide-react';
import Link from 'next/link';
import { useState, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

function TendersContent() {
  const searchParams = useSearchParams();
  const [tenders, setTenders] = useState<any[]>(mockTenders);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [statusFilter, setStatusFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [tabFilter, setTabFilter] = useState('all'); // 'all', 'active', 'closing', 'risk', 'dept'
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null) {
      setTimeout(() => {
        setSearchTerm(q);
        setCurrentPage(1); // Reset to page 1 on new search
      }, 0);
    }
  }, [searchParams]);

  const filtered = tenders.filter((t) => {
    const matchSearch =
      !searchTerm ||
      t.bidId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchRisk = riskFilter === 'all' || t.riskLevel === riskFilter;
    
    // Tab filtering logic
    let matchTab = true;
    if (tabFilter === 'active') matchTab = t.status === 'active';
    if (tabFilter === 'closing') matchTab = parseInt(t.closingDate.split(' ')[0]) <= 25; // Dummy logic for "soon"
    if (tabFilter === 'risk') matchTab = t.riskLevel === 'high';
    if (tabFilter === 'dept') matchTab = t.department === 'MeitY'; // Mock user department

    return matchSearch && matchStatus && matchRisk && matchTab;
  });

  // Prototype Pagination Logic (Illusion of Scale)
  const ITEMS_PER_PAGE = 10;
  const totalFakeCount = filtered.length > 0 ? (filtered.length * 384) + 2 : 0;
  const totalPages = Math.ceil(totalFakeCount / ITEMS_PER_PAGE);
  
  // Change the order slightly on different pages so it looks like new data
  const displayTenders = currentPage % 2 === 0 ? [...filtered].reverse() : filtered;
  
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endIndex = Math.min(currentPage * ITEMS_PER_PAGE, totalFakeCount);

  return (
    <>
      <TopBar breadcrumbs={[{ label: 'Tender Explorer' }]} />

      <div className="page-container">
        {/* Premium Page Header with Tabs */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '28px',
          borderBottom: '1px solid var(--border-light)',
          paddingBottom: '16px'
        }}>
          <div>
            <h1 className="page-title" style={{ marginBottom: '6px' }}>Tender Explorer</h1>
            <p className="page-subtitle">
              Search and explore GeM tenders with AI-driven compliance insights
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px', background: 'var(--surface-100)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            <button 
              onClick={() => setTabFilter('all')}
              className={`btn ${tabFilter === 'all' ? '' : 'btn-ghost'}`} 
              style={{ background: tabFilter === 'all' ? 'var(--info)' : 'transparent', color: tabFilter === 'all' ? '#fff' : 'var(--text-secondary)', border: 'none', fontSize: '12.5px', padding: '6px 14px' }}>
              All Tenders
            </button>
            <button 
              onClick={() => setTabFilter('active')}
              className={`btn ${tabFilter === 'active' ? '' : 'btn-ghost'}`} 
              style={{ background: tabFilter === 'active' ? 'var(--info)' : 'transparent', color: tabFilter === 'active' ? '#fff' : 'var(--text-secondary)', border: 'none', fontSize: '12.5px', padding: '6px 14px' }}>
              Active
            </button>
            <button 
              onClick={() => setTabFilter('closing')}
              className={`btn ${tabFilter === 'closing' ? '' : 'btn-ghost'}`} 
              style={{ background: tabFilter === 'closing' ? 'var(--info)' : 'transparent', color: tabFilter === 'closing' ? '#fff' : 'var(--text-secondary)', border: 'none', fontSize: '12.5px', padding: '6px 14px' }}>
              Closing Soon
            </button>
            <button 
              onClick={() => setTabFilter('risk')}
              className={`btn ${tabFilter === 'risk' ? '' : 'btn-ghost'}`} 
              style={{ background: tabFilter === 'risk' ? 'var(--info)' : 'transparent', color: tabFilter === 'risk' ? '#fff' : 'var(--text-secondary)', border: 'none', fontSize: '12.5px', padding: '6px 14px' }}>
              High Risk
            </button>
            <button 
              onClick={() => setTabFilter('dept')}
              className={`btn ${tabFilter === 'dept' ? '' : 'btn-ghost'}`} 
              style={{ background: tabFilter === 'dept' ? 'var(--info)' : 'transparent', color: tabFilter === 'dept' ? '#fff' : 'var(--text-secondary)', border: 'none', fontSize: '12.5px', padding: '6px 14px' }}>
              My Department
            </button>
          </div>
        </div>

        {/* KPI Row */}
        <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 20 }}>
          <div className="kpi-card kpi-blue animate-in stagger-1">
            <div className="kpi-label">Total Tenders (Demo Dataset)</div>
            <div className="kpi-value">384</div>
          </div>
          <div className="kpi-card kpi-green animate-in stagger-2">
            <div className="kpi-label">Active Tenders</div>
            <div className="kpi-value">273</div>
          </div>
          <div className="kpi-card kpi-amber animate-in stagger-3">
            <div className="kpi-label">Closing in 7 Days</div>
            <div className="kpi-value">21</div>
          </div>
        </div>

        {/* Filters */}
        <div className="filter-section animate-in" style={{ animationDelay: '0.15s' }}>
          <div className="filter-row">
            <div className="filter-group" style={{ flex: 2 }}>
              <label className="filter-label">Search</label>
              <div style={{ position: 'relative' }}>
                <Search
                  size={15}
                  color="var(--text-muted)"
                  style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  className="filter-input"
                  style={{ width: '100%', paddingLeft: 36 }}
                  placeholder="Search by Bid ID, Tender Title, Keywords (e.g., laptops, medical, construction)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="filter-group" style={{ minWidth: 140 }}>
              <label className="filter-label">Tender Status</label>
              <select
                className="filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="under_evaluation">Under Evaluation</option>
                <option value="clarification">Clarification</option>
                <option value="awarded">Awarded</option>
              </select>
            </div>
            <div className="filter-group" style={{ minWidth: 130 }}>
              <label className="filter-label">Risk Level</label>
              <select
                className="filter-select"
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
              >
                <option value="all">All Risk Levels</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: 8, alignSelf: 'flex-end' }}>
              <button className="btn btn-primary">
                <Filter size={14} />
                Search
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setRiskFilter('all');
                }}
              >
                <RotateCcw size={14} />
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Showing <strong style={{ color: 'var(--text-primary)' }}>1 – {filtered.length}</strong> of{' '}
            <strong style={{ color: 'var(--text-primary)' }}>384</strong> tenders
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Sort by</span>
            <select
              className="filter-select"
              style={{ padding: '5px 10px', fontSize: 12 }}
            >
              <option>Closing Date (Nearest)</option>
              <option>Value (High to Low)</option>
              <option>Risk Level</option>
              <option>Bidders Count</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="card animate-in" style={{ animationDelay: '0.2s' }}>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: 40 }}>#</th>
                  <th style={{ width: '13%' }}>Bid ID</th>
                  <th style={{ width: '32%' }}>Tender Title & Department</th>
                  <th>Category</th>
                  <th>Est. Value</th>
                  <th style={{ textAlign: 'center' }}>Bidders</th>
                  <th>Closing Date</th>
                  <th>Status</th>
                  <th>Risk</th>
                  <th style={{ textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {displayTenders.map((t, i) => (
                  <tr key={`${t.id}-${currentPage}`}>
                    <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{startIndex + i}</td>
                    <td className="col-id">
                      <Link href={`/tenders/${encodeURIComponent(t.bidId.replace(/\//g, '-'))}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {t.bidId}
                      </Link>
                    </td>
                    <td style={{ maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2, fontSize: 13, textOverflow: 'ellipsis', overflow: 'hidden' }} title={t.title}>
                        {t.title}
                      </div>
                      <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
                        {t.department}
                      </div>
                    </td>
                    <td style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>{t.category}</td>
                    <td className="col-amount">{formatINR(t.estimatedValue)}</td>
                    <td className="col-number">{t.bidders}</td>
                    <td style={{ fontSize: 12.5, whiteSpace: 'nowrap' }}>{t.closingDate}</td>
                    <td>
                      <span className={`status-badge status-${t.status.replace('_', '-')}`}>
                        {getStatusLabel(t.status)}
                      </span>
                    </td>
                    <td>
                      <span className={`risk-indicator risk-${t.riskLevel}`}>
                        <span className="risk-dot" />
                        {t.riskLevel.charAt(0).toUpperCase() + t.riskLevel.slice(1)}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <Link href={`/tenders/${encodeURIComponent(t.bidId.replace(/\//g, '-'))}`} className="btn btn-ghost btn-sm">
                        Open
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filtered.length === 0 && (
            <div style={{ padding: '60px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'var(--surface-50)' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--surface-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Search size={28} color="var(--text-muted)" />
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>No tenders found</h3>
              <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', maxWidth: 400, marginBottom: 20, lineHeight: 1.5 }}>
                We couldn&apos;t find any tenders matching your current filter criteria. Try adjusting your search term or clearing the filters.
              </p>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setRiskFilter('all');
                  setTabFilter('all');
                }}
              >
                Clear All Filters
              </button>
            </div>
          )}


          {/* Pagination */}
          <div className="pagination">
            <div className="pagination-info">
              Showing <strong>{totalFakeCount > 0 ? startIndex : 0} – {endIndex}</strong> of <strong>{totalFakeCount.toLocaleString('en-IN')}</strong> tenders
            </div>
            <div className="pagination-controls">
              <button 
                className="page-btn" 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                ‹
              </button>
              
              {/* Show pages around current page */}
              {[...Array(5)].map((_, idx) => {
                let pageNum;
                if (currentPage <= 3) pageNum = idx + 1;
                else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + idx;
                else pageNum = currentPage - 2 + idx;
                
                if (pageNum > 0 && pageNum <= totalPages) {
                  return (
                    <button
                      key={pageNum}
                      className={`page-btn ${pageNum === currentPage ? 'active' : ''}`}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                }
                return null;
              })}
              
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <>
                  <span style={{ padding: '0 4px', color: 'var(--text-muted)' }}>…</span>
                  <button 
                    className="page-btn"
                    onClick={() => setCurrentPage(totalPages)}
                  >
                    {totalPages}
                  </button>
                </>
              )}
              
              <button 
                className="page-btn"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                ›
              </button>
            </div>
          </div>
        </div>

        {/* Prototype Notice */}
        <div
          className="animate-in"
          style={{
            marginTop: 20,
            padding: '14px 20px',
            background: 'var(--info-light)',
            border: '1px solid #bfdbfe',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            animationDelay: '0.3s',
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: 'var(--info)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <span style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>i</span>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>
              Prototype Environment
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              This is a demonstration platform. Tender and bidder data shown here is simulated (mock data) for the purpose of SIH prototype.
              The platform is designed to integrate with GeM and other government portals through authorized APIs in a production environment.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function TendersPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TendersContent />
    </Suspense>
  );
}
