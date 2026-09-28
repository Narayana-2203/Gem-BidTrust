'use client';
import TopBar from '@/components/TopBar';
import { api } from '@/services/api';
import { Shield, Globe, Server, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';

import { Activity, Clock } from 'lucide-react';

// Pre-seeded portal data for instant render
const defaultPortals = [
  { id: 'int-gstn', name: 'GSTN Portal', endpoint: 'https://gstn.gov.in/api/v2', status: 'connected', health: { successRate: 97.1, avgLatencyMs: 420, circuitBreakerOpen: false }, recordsSynced: 384, lastSync: '2026-04-22T14:30:00' },
  { id: 'int-udyam', name: 'Udyam Portal', endpoint: 'https://udyamregistration.gov.in/api', status: 'connected', health: { successRate: 95.2, avgLatencyMs: 580, circuitBreakerOpen: false }, recordsSynced: 189, lastSync: '2026-04-22T14:28:00' },
  { id: 'int-nsdl', name: 'NSDL / Income Tax', endpoint: 'https://nsdl.co.in/pan-verify', status: 'degraded', health: { successRate: 89.4, avgLatencyMs: 920, circuitBreakerOpen: false }, recordsSynced: 210, lastSync: '2026-04-22T14:15:00' },
  { id: 'int-epfo', name: 'EPFO Portal', endpoint: 'https://unifiedportal.epfindia.gov.in/api', status: 'connected', health: { successRate: 96.0, avgLatencyMs: 650, circuitBreakerOpen: false }, recordsSynced: 154, lastSync: '2026-04-22T14:25:00' },
  { id: 'int-esic', name: 'ESIC Portal', endpoint: 'https://esic.in/employer-api', status: 'connected', health: { successRate: 96.3, avgLatencyMs: 530, circuitBreakerOpen: false }, recordsSynced: 121, lastSync: '2026-04-22T14:20:00' },
  { id: 'int-mca', name: 'MCA21 Portal', endpoint: 'https://mca.gov.in/mcafov2/api', status: 'degraded', health: { successRate: 91.8, avgLatencyMs: 870, circuitBreakerOpen: false }, recordsSynced: 98, lastSync: '2026-04-22T14:10:00' },
  { id: 'int-gem', name: 'GeM Portal', endpoint: 'https://gem.gov.in/api/v3', status: 'connected', health: { successRate: 99.2, avgLatencyMs: 180, circuitBreakerOpen: false }, recordsSynced: 452, lastSync: '2026-04-22T14:32:00' },
  { id: 'int-dpiit', name: 'DPIIT / Startup India', endpoint: 'https://dpiit.gov.in/startup-api', status: 'disconnected', health: { successRate: 78.5, avgLatencyMs: 1200, circuitBreakerOpen: true }, recordsSynced: 34, lastSync: '2026-04-22T12:00:00' },
  { id: 'int-cvc', name: 'CVC Debarment List', endpoint: 'https://cvc.gov.in/debarment-api', status: 'connected', health: { successRate: 97.8, avgLatencyMs: 480, circuitBreakerOpen: false }, recordsSynced: 89, lastSync: '2026-04-22T14:29:00' },
  { id: 'int-digi', name: 'DigiLocker', endpoint: 'https://digilocker.gov.in/api/v1', status: 'connected', health: { successRate: 98.1, avgLatencyMs: 320, circuitBreakerOpen: false }, recordsSynced: 267, lastSync: '2026-04-22T14:31:00' },
  { id: 'int-nsic', name: 'NSIC Portal', endpoint: 'https://nsic.co.in/api/verify', status: 'connected', health: { successRate: 99.0, avgLatencyMs: 290, circuitBreakerOpen: false }, recordsSynced: 53, lastSync: '2026-04-22T14:30:00' },
];

export default function IntegrationsPage() {
  const [portals, setPortals] = useState<any[]>(defaultPortals);
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState<string | null>(null);

  async function loadData() {
    setLoading(true);
    const data = await api.getIntegrationsStatus();
    if (data.length > 0) setPortals(data);
    setLoading(false);
  }

  const handleTest = async (portalId: string) => {
    setTesting(portalId);
    const result = await api.testIntegration(portalId);
    setTesting(null);
  };

  const handleSync = async (portalId: string) => {
    setTesting(portalId);
    await api.syncIntegration(portalId);
    setTesting(null);
  };

  return (
    <>
      <TopBar breadcrumbs={[{ label: 'Data & Integrations' }]} />
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Data & Integrations</h1>
          <p className="page-subtitle">
            Multi-portal integration status — real-time connectivity with Government databases
          </p>
        </div>

        {/* Integration KPI */}
        <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 24 }}>
          <div className="kpi-card kpi-green animate-in stagger-1">
            <div className="kpi-label">Portals Connected</div>
            <div className="kpi-value">{portals.filter(p => p.status === 'connected').length} / {portals.length}</div>
            <div className="kpi-icon" style={{ color: 'var(--success)' }}><Globe size={38} /></div>
          </div>
          <div className="kpi-card kpi-blue animate-in stagger-2">
            <div className="kpi-label">Total Records Synced</div>
            <div className="kpi-value">{portals.reduce((acc, p) => acc + (p.recordsSynced || 0), 0).toLocaleString('en-IN')}</div>
            <div className="kpi-icon" style={{ color: 'var(--info)' }}><Server size={38} /></div>
          </div>
          <div className="kpi-card kpi-amber animate-in stagger-3">
            <div className="kpi-label">API Health</div>
            <div className="kpi-value">
              {portals.length > 0 ? Math.round(portals.reduce((acc, p) => acc + (p.health?.successRate || 100), 0) / portals.length) : 0}%
            </div>
            <div className="kpi-sub">Success rate overall</div>
            <div className="kpi-icon" style={{ color: 'var(--warning)' }}><Shield size={38} /></div>
          </div>
        </div>

        {/* Portals Grid */}
        <div className="card animate-in" style={{ animationDelay: '0.2s' }}>
          <div className="card-header">
            <h3 className="card-title">Government Portal Integrations</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => loadData()}>
              <RefreshCw size={13} className={loading ? 'spin' : ''} />
              Refresh Health
            </button>
          </div>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Portal</th>
                  <th>API Endpoint</th>
                  <th>Status & Latency</th>
                  <th>Last Synced</th>
                  <th style={{ textAlign: 'center' }}>Records</th>
                  <th style={{ textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {portals.map((p, i) => (
                  <tr key={i}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{p.name}</div>
                      {p.health?.circuitBreakerOpen && (
                        <div style={{ fontSize: 11, color: 'var(--danger)', marginTop: 2, fontWeight: 500 }}>
                          Circuit Breaker: OPEN
                        </div>
                      )}
                    </td>
                    <td>
                      <span className="monospace" style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
                        {p.endpoint}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {p.status === 'connected' ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: 'var(--success)', fontSize: 12.5, fontWeight: 600 }}>
                            <CheckCircle2 size={14} /> Connected
                          </span>
                        ) : p.status === 'error' ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: 'var(--danger)', fontSize: 12.5, fontWeight: 600 }}>
                            <AlertTriangle size={14} /> Error
                          </span>
                        ) : (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: 'var(--warning)', fontSize: 12.5, fontWeight: 600 }}>
                            <AlertTriangle size={14} /> Limited
                          </span>
                        )}
                        {p.health && (
                          <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Activity size={10} /> {p.health.avgLatencyMs}ms avg
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ fontSize: 12, fontFamily: '"JetBrains Mono", monospace', color: 'var(--text-muted)' }}>
                      {p.lastSync}
                    </td>
                    <td className="col-number" style={{ fontWeight: 600 }}>{p.recordsSynced?.toLocaleString('en-IN') || p.records}</td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                        <button 
                          className="btn btn-ghost btn-sm" 
                          onClick={() => handleTest(p.id)}
                          disabled={testing === p.id}
                          title="Test Connection Latency"
                        >
                          <Clock size={12} /> Test
                        </button>
                        <button 
                          className="btn btn-ghost btn-sm" 
                          onClick={() => handleSync(p.id)}
                          disabled={testing === p.id}
                        >
                          <RefreshCw size={12} className={testing === p.id ? 'spin' : ''} /> Sync
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Data Source Legend */}
        <div className="card animate-in" style={{ marginTop: 20, animationDelay: '0.3s' }}>
          <div className="card-body" style={{ display: 'flex', gap: 32, padding: '16px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--success)' }} />
              <span style={{ fontSize: 12.5 }}><strong>Live / Verified</strong> — Data from connected source</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
              <span style={{ fontSize: 12.5 }}><strong>Mock / Simulated</strong> — Sample data for demonstration</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--info)' }} />
              <span style={{ fontSize: 12.5 }}><strong>Platform Generated</strong> — AI/Rule engine analysis</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
