'use client';

import TopBar from '@/components/TopBar';
import { api } from '@/services/api';
import {
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  TrendingUp,
  AlertTriangle,
  FileSearch,
  Settings,
  RefreshCw,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';
import { useState, useEffect } from 'react';
import RuleBuilderModal from '@/components/RuleBuilderModal';

// Pre-seeded compliance rules for instant render
const defaultRules = [
  { rule: 'GFR-149', description: 'Bidder must have active GST registration (non-cancelled, non-suspended)', lastTriggered: '2026-04-22 14:11', triggerCount: 384 },
  { rule: 'GFR-170', description: 'EMD / Bid Security must be valid and within 5% of estimated tender value', lastTriggered: '2026-04-22 13:50', triggerCount: 321 },
  { rule: 'DPIIT-MSME', description: 'MSME-registered bidders are exempt from EMD and prior turnover requirements', lastTriggered: '2026-04-22 12:30', triggerCount: 189 },
  { rule: 'CVC-DEBAR', description: 'Bidder must not appear on CVC / GeM debarment blacklist', lastTriggered: '2026-04-22 14:05', triggerCount: 384 },
  { rule: 'FIN-TURN', description: 'Average annual turnover of last 3 FYs must meet minimum threshold for tender category', lastTriggered: '2026-04-22 13:20', triggerCount: 298 },
  { rule: 'MII-CHECK', description: 'Make in India preference policy compliance and local content percentage verification', lastTriggered: '2026-04-22 11:45', triggerCount: 121 },
];

const defaultOverview = [
  { name: 'GST Verification', rate: 94.2 },
  { name: 'PAN Verification', rate: 97.1 },
  { name: 'MSME Status', rate: 88.5 },
  { name: 'EMD Compliance', rate: 91.3 },
  { name: 'Blacklist Check', rate: 99.1 },
  { name: 'Turnover Check', rate: 85.7 },
];

export default function CompliancePage() {
  const [data] = useState<any>({
    overview: defaultOverview,
    rules: defaultRules,
    radarData: defaultOverview.map((item: any) => ({
      subject: item.name.replace(' ', '\n'),
      A: item.rate,
      fullMark: 100,
    }))
  });
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [customRules, setCustomRules] = useState<any[]>([]);

  const { overview: complianceOverview, rules: ruleEngine, radarData } = data;

  return (
    <>
      <TopBar breadcrumbs={[{ label: 'Compliance Engine' }]} />

      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Compliance Engine</h1>
          <p className="page-subtitle">
            Rule engine configuration, compliance analytics, and verification standards based on GFR 2017, DPIIT, and GeM guidelines
          </p>
        </div>

        {/* KPI Cards */}
        <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 24 }}>
          <div className="kpi-card kpi-green animate-in stagger-1">
            <div className="kpi-label">Rules Active</div>
            <div className="kpi-value">6</div>
            <div className="kpi-sub">Based on GFR 2017 + DPIIT</div>
            <div className="kpi-icon" style={{ color: 'var(--success)' }}>
              <ShieldCheck size={38} />
            </div>
          </div>
          <div className="kpi-card kpi-blue animate-in stagger-2">
            <div className="kpi-label">Total Checks Run</div>
            <div className="kpi-value">16,981</div>
            <div className="kpi-sub">Across 3,842 bids</div>
            <div className="kpi-icon" style={{ color: 'var(--info)' }}>
              <FileSearch size={38} />
            </div>
          </div>
          <div className="kpi-card kpi-amber animate-in stagger-3">
            <div className="kpi-label">Flags Raised</div>
            <div className="kpi-value">348</div>
            <div className="kpi-sub">
              <TrendingUp size={13} />
              <span className="up">Accuracy: 94.2%</span>
            </div>
            <div className="kpi-icon" style={{ color: 'var(--warning)' }}>
              <ShieldAlert size={38} />
            </div>
          </div>
          <div className="kpi-card kpi-red animate-in stagger-4">
            <div className="kpi-label">Non-Compliant</div>
            <div className="kpi-value">89</div>
            <div className="kpi-sub">Auto-disqualification candidates</div>
            <div className="kpi-icon" style={{ color: 'var(--danger)' }}>
              <ShieldX size={38} />
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="charts-grid" style={{ marginBottom: 24 }}>
          {/* Compliance Radar */}
          <div className="card animate-in" style={{ animationDelay: '0.2s' }}>
            <div className="card-header">
              <h3 className="card-title">Compliance Radar</h3>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Cross-category performance</span>
            </div>
            <div className="card-body" style={{ height: 340 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                  <PolarGrid stroke="#e7e5e0" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fontSize: 11, fill: '#525252', fontWeight: 500 }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                  />
                  <Radar
                    name="Compliance Rate"
                    dataKey="A"
                    stroke="#2563eb"
                    fill="#2563eb"
                    fillOpacity={0.15}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Compliance Bar */}
          <div className="card animate-in" style={{ animationDelay: '0.25s' }}>
            <div className="card-header">
              <h3 className="card-title">Verification Success Rate</h3>
            </div>
            <div className="card-body" style={{ height: 340 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={complianceOverview}
                  margin={{ top: 5, right: 20, left: 5, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e0" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                    angle={-30}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    domain={[0, 100]}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#fff',
                      border: '1px solid #e7e5e0',
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    formatter={(value: any) => [`${value}%`, 'Success Rate']}
                  />
                  <Bar
                    dataKey="rate"
                    radius={[4, 4, 0, 0]}
                    fill="#2563eb"
                    barSize={28}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Rules Engine Table */}
        <div className="card animate-in" style={{ animationDelay: '0.3s' }}>
          <div className="card-header">
            <h3 className="card-title">Active Compliance Rules ({ruleEngine.length + customRules.length})</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => setIsBuilderOpen(true)}>
              <Settings size={14} />
              Configure & Add Rule
            </button>
          </div>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Rule Reference</th>
                  <th style={{ width: '35%' }}>Description</th>
                  <th>Status</th>
                  <th>Last Triggered</th>
                  <th style={{ textAlign: 'center' }}>Checks Run</th>
                  <th style={{ textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {/* Render Custom Rules */}
                {customRules.map((rule: any, i: number) => (
                  <tr key={`custom-${i}`} style={{ background: 'var(--surface-50)' }}>
                    <td style={{ fontWeight: 600, fontSize: 13, color: 'var(--primary)' }}>{rule.rule}</td>
                    <td style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 mr-2">[{rule.category}]</span>
                      {rule.description} (Threshold: {rule.threshold}%)
                    </td>
                    <td>
                      <span className="status-badge status-active">Active</span>
                    </td>
                    <td style={{ fontSize: 12, fontFamily: '"JetBrains Mono", monospace', color: 'var(--text-muted)' }}>
                      {rule.lastTriggered}
                    </td>
                    <td className="col-number" style={{ fontWeight: 600 }}>
                      {rule.triggerCount}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button className="btn btn-ghost btn-sm">
                        <RefreshCw size={12} />
                        Re-run
                      </button>
                    </td>
                  </tr>
                ))}
                
                {/* Render Default Rules */}
                {ruleEngine.map((rule: any, i: number) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600, fontSize: 13 }}>{rule.rule}</td>
                    <td style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {rule.description}
                    </td>
                    <td>
                      <span className="status-badge status-active">Active</span>
                    </td>
                    <td style={{ fontSize: 12, fontFamily: '"JetBrains Mono", monospace', color: 'var(--text-muted)' }}>
                      {rule.lastTriggered}
                    </td>
                    <td className="col-number" style={{ fontWeight: 600 }}>
                      {rule.triggerCount.toLocaleString('en-IN')}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button className="btn btn-ghost btn-sm">
                        <RefreshCw size={12} />
                        Re-run
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <RuleBuilderModal 
        isOpen={isBuilderOpen} 
        onClose={() => setIsBuilderOpen(false)}
        onSave={(rule) => setCustomRules([rule, ...customRules])}
      />
    </>
  );
}
