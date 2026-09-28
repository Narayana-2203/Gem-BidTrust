'use client';

import TopBar from '@/components/TopBar';
import { api } from '@/services/api';
import {
  Upload,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Globe,
  Award,
  Download,
  Search,
  FileText,
  Link as LinkIcon,
} from 'lucide-react';
import { useState, useEffect } from 'react';

const typeConfig: Record<string, { icon: typeof Upload; dotClass: string; label: string }> = {
  upload: { icon: Upload, dotClass: 'upload', label: 'Document Upload' },
  ai_verification: { icon: CheckCircle2, dotClass: 'verification', label: 'AI Verification' },
  ai_flag: { icon: AlertTriangle, dotClass: 'flag', label: 'AI Flag' },
  officer_decision: { icon: UserCheck, dotClass: 'decision', label: 'Officer Decision' },
  portal_query: { icon: Globe, dotClass: 'portal', label: 'Portal Query' },
  final_verdict: { icon: Award, dotClass: 'verdict', label: 'Final Verdict' },
};

export default function AuditPage() {
  const [auditEntries] = useState<any[]>([
    { id: 'a-001', timestamp: '2026-04-22T14:32:00', type: 'upload', title: 'Bid Documents Uploaded', detail: 'GST Certificate, PAN Card, Balance Sheet FY24 uploaded for bidder-1', actor: 'GeM Portal', bidId: 'GEM/2026/B/892', evidence: '3 documents', prevHash: '0000...0000', entryHash: 'a1b2c3d4e5f6...' },
    { id: 'a-002', timestamp: '2026-04-22T14:33:00', type: 'ai_verification', title: 'AI Compliance Check — PASS', detail: 'Automated verification: GST Active, PAN Valid, Turnover above threshold', actor: 'AI Verification Engine', bidId: 'GEM/2026/B/892', evidence: 'Score: 92/100', prevHash: 'a1b2c3d4e5f6...', entryHash: 'b2c3d4e5f6g7...' },
    { id: 'a-003', timestamp: '2026-04-22T14:34:00', type: 'ai_flag', title: 'Cartel Risk Flag Raised', detail: 'Shared DIN-00123456 detected between bidder-3 and bidder-17', actor: 'Cartel Detection Engine', bidId: 'GEM/2026/B/892', evidence: 'DIN overlap + same IP', prevHash: 'b2c3d4e5f6g7...', entryHash: 'c3d4e5f6g7h8...' },
    { id: 'a-004', timestamp: '2026-04-22T14:35:00', type: 'portal_query', title: 'GSTN Portal Verification', detail: 'Live query to GSTN portal for GSTIN 29ABCDE1234F1Z5 — Status: Active', actor: 'Portal Simulator', bidId: 'GEM/2026/B/892', evidence: 'Latency: 450ms', prevHash: 'c3d4e5f6g7h8...', entryHash: 'd4e5f6g7h8i9...' },
    { id: 'a-005', timestamp: '2026-04-22T14:36:00', type: 'officer_decision', title: 'Manual Review — Approved', detail: 'Procurement officer approved bidder-1 after reviewing AI compliance report', actor: 'Lakshmi Narayana (Officer)', bidId: 'GEM/2026/B/892', evidence: 'Decision: Approved', prevHash: 'd4e5f6g7h8i9...', entryHash: 'e5f6g7h8i9j0...' },
    { id: 'a-006', timestamp: '2026-04-22T14:37:00', type: 'final_verdict', title: 'Tender Evaluation Complete', detail: 'All 8 bidders evaluated. 5 compliant, 2 flagged, 1 non-compliant', actor: 'System', bidId: 'GEM/2026/B/892', evidence: 'Hash chain verified', prevHash: 'e5f6g7h8i9j0...', entryHash: 'f6g7h8i9j0k1...' },
  ]);

  const [typeFilter, setTypeFilter] = useState('all');

  const filtered = auditEntries.filter(e => typeFilter === 'all' || e.type === typeFilter);

  const handleExport = () => {
    const lines = filtered.map(e => {
      const t = new Date(e.timestamp);
      return `[${t.toLocaleString()}] ${e.title}\n  Detail: ${e.detail}\n  Actor: ${e.actor}\n  Evidence: ${e.evidence}\n  Hash: ${e.entryHash}\n  Prev Hash: ${e.prevHash}\n`;
    });
    const content = `=====================================================
IMMUTABLE AUDIT TRAIL EXPORT
=====================================================
Bid Reference: GEM/2026/B/10231
Generated: ${new Date().toISOString()}
Total Entries: ${filtered.length}
Blockchain Integrity: VERIFIED
=====================================================

${lines.join('\n')}
=====================================================
END OF AUDIT LOG — TAMPER-PROOF EXPORT
=====================================================`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'BidTrust_Audit_Trail_Export.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <TopBar breadcrumbs={[{ label: 'Audit Trail' }]} />

      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Audit Trail</h1>
          <p className="page-subtitle">
            Complete, tamper-proof chronological record of all verification activities and officer decisions
          </p>
        </div>

        {/* Filters */}
        <div className="filter-section animate-in">
          <div className="filter-row">
            <div className="filter-group">
              <label className="filter-label">Start Date</label>
              <input className="filter-input" type="date" defaultValue="2026-04-22" />
            </div>
            <div className="filter-group">
              <label className="filter-label">End Date</label>
              <input className="filter-input" type="date" defaultValue="2026-04-22" />
            </div>
            <div className="filter-group">
              <label className="filter-label">Bid ID</label>
              <div style={{ position: 'relative' }}>
                <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
                <input className="filter-input" style={{ width: '100%', paddingLeft: 32 }} placeholder="GEM/2026/B/..." />
              </div>
            </div>
            <div className="filter-group" style={{ minWidth: 150 }}>
              <label className="filter-label">Action Type</label>
              <select className="filter-select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                <option value="all">All Actions</option>
                <option value="upload">Document Upload</option>
                <option value="ai_verification">AI Verification</option>
                <option value="ai_flag">AI Flag</option>
                <option value="officer_decision">Officer Decision</option>
                <option value="portal_query">Portal Query</option>
                <option value="final_verdict">Final Verdict</option>
              </select>
            </div>
            <div style={{ alignSelf: 'flex-end' }}>
              <button className="btn btn-ghost" onClick={handleExport}>
                <Download size={14} />
                Export Report
              </button>
            </div>
          </div>
        </div>

        {/* Bid Reference Card */}
        <div className="card animate-in" style={{ marginBottom: 20, animationDelay: '0.1s' }}>
          <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px' }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 'var(--radius-md)',
                background: 'var(--info-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FileText size={18} color="var(--info)" />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                Audit Log for Bid <span className="monospace" style={{ color: 'var(--info)' }}>GEM/2026/B/10231</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Bharat Electronics Limited · IT Hardware · {filtered.length} entries
              </div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{
                padding: '4px 10px',
                background: 'var(--success-light)',
                color: 'var(--success)',
                fontSize: 11,
                fontWeight: 600,
                borderRadius: 'var(--radius-sm)',
                borderLeft: '3px solid var(--success)',
              }}>
                Qualified with Conditions
              </span>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="card animate-in" style={{ animationDelay: '0.15s' }}>
          <div className="card-body" style={{ padding: '24px 24px 24px 40px' }}>
            <div className="timeline">
              {filtered.map((entry, i) => {
                const config = typeConfig[entry.type];
                const Icon = config.icon;
                const time = new Date(entry.timestamp);
                const formattedTime = time.toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                });
                const formattedDate = time.toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                });

                return (
                  <div className="timeline-entry" key={entry.id} style={{ animationDelay: `${i * 0.06}s` }}>
                    <div className={`timeline-dot ${config.dotClass}`}>
                      <Icon size={12} color="#fff" />
                    </div>
                    <div className="timeline-content">
                      <div className="timeline-time">
                        {formattedDate}, {formattedTime}
                      </div>
                      <div className="timeline-title">{entry.title}</div>
                      <div className="timeline-detail">{entry.detail}</div>
                      <div className="timeline-actor">— {entry.actor}</div>
                      {entry.evidence && (
                        <div className="timeline-evidence">
                          <LinkIcon size={10} />
                          {entry.evidence}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
