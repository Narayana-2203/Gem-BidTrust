'use client';

import TopBar from '@/components/TopBar';
import { api } from '@/services/api';
import { riskDistribution as mockRiskDist } from '@/data/mockData';
import { BarChart3, TrendingUp, TrendingDown, AlertTriangle, ShieldCheck } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useState, useEffect } from 'react';
import CartelGraphViewer from '@/components/CartelGraphViewer';

// Pre-seeded analytics data for instant render
const defaultMonthlyTrend = [
  { month: 'Jan', compliant: 82, flagged: 18 },
  { month: 'Feb', compliant: 85, flagged: 15 },
  { month: 'Mar', compliant: 79, flagged: 21 },
  { month: 'Apr', compliant: 88, flagged: 12 },
  { month: 'May', compliant: 91, flagged: 9 },
  { month: 'Jun', compliant: 87, flagged: 13 },
];

const defaultTopFactors = [
  { factor: 'GST Non-Filing / Cancelled GSTIN', count: 89, pct: 25.6 },
  { factor: 'Turnover Below Threshold (< 5 Cr)', count: 67, pct: 19.3 },
  { factor: 'Shared Director (DIN Overlap)', count: 52, pct: 14.9 },
  { factor: 'Same IP Address Submission', count: 41, pct: 11.8 },
  { factor: 'Blacklisted / CVC Debarred Entity', count: 38, pct: 10.9 },
  { factor: 'EMD / Bank Guarantee Missing', count: 31, pct: 8.9 },
  { factor: 'PDF Metadata Author Match', count: 30, pct: 8.6 },
];

export default function RiskPage() {
  const [data] = useState<any>({
    monthlyTrend: defaultMonthlyTrend,
    topFactors: defaultTopFactors,
    riskDistribution: mockRiskDist,
  });

  const { monthlyTrend, topFactors: topRiskFactors, riskDistribution } = data;

  return (
    <>
      <TopBar breadcrumbs={[{ label: 'Risk & Analytics' }]} />
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Risk & Analytics</h1>
          <p className="page-subtitle">
            Bidder risk classification, trend analysis, and anomaly detection insights
          </p>
        </div>

        {/* KPIs */}
        <div className="kpi-grid" style={{ marginBottom: 24 }}>
          <div className="kpi-card kpi-green animate-in stagger-1">
            <div className="kpi-label">Low Risk Bids</div>
            <div className="kpi-value">64%</div>
            <div className="kpi-sub"><TrendingUp size={13} /> <span className="up">+4.1%</span></div>
            <div className="kpi-icon" style={{ color: 'var(--success)' }}><ShieldCheck size={38} /></div>
          </div>
          <div className="kpi-card kpi-amber animate-in stagger-2">
            <div className="kpi-label">Medium Risk Bids</div>
            <div className="kpi-value">26%</div>
            <div className="kpi-sub"><TrendingDown size={13} /> <span className="up">-2.3%</span></div>
            <div className="kpi-icon" style={{ color: 'var(--warning)' }}><AlertTriangle size={38} /></div>
          </div>
          <div className="kpi-card kpi-red animate-in stagger-3">
            <div className="kpi-label">High Risk Bids</div>
            <div className="kpi-value">10%</div>
            <div className="kpi-sub"><TrendingDown size={13} /> <span className="up">-1.8%</span></div>
            <div className="kpi-icon" style={{ color: 'var(--danger)' }}><AlertTriangle size={38} /></div>
          </div>
          <div className="kpi-card kpi-blue animate-in stagger-4">
            <div className="kpi-label">Fraud Signals</div>
            <div className="kpi-value">28</div>
            <div className="kpi-sub">Shared DIN / Address matches</div>
            <div className="kpi-icon" style={{ color: 'var(--info)' }}><BarChart3 size={38} /></div>
          </div>
        </div>

        {/* Charts */}
        <div className="charts-grid" style={{ marginBottom: 24 }}>
          {/* Monthly Trend */}
          <div className="card animate-in" style={{ animationDelay: '0.2s' }}>
            <div className="card-header">
              <h3 className="card-title">Monthly Bid Compliance Trend</h3>
            </div>
            <div className="card-body" style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrend} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCompliant" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorFlagged" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e0" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e7e5e0', borderRadius: 8, fontSize: 12 }} />
                  <Area type="monotone" dataKey="compliant" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorCompliant)" name="Compliant" />
                  <Area type="monotone" dataKey="flagged" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorFlagged)" name="Flagged" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Risk Pie */}
          <div className="card animate-in" style={{ animationDelay: '0.25s' }}>
            <div className="card-header">
              <h3 className="card-title">Risk Classification</h3>
            </div>
            <div className="card-body" style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={riskDistribution} cx="50%" cy="45%" innerRadius={65} outerRadius={95} paddingAngle={3} dataKey="value" stroke="none">
                    {riskDistribution.map((entry: any, index: number) => (<Cell key={index} fill={entry.color} />))}
                  </Pie>
                  <Legend verticalAlign="bottom" formatter={(value: string) => <span style={{ color: '#525252', fontSize: 12, fontWeight: 500 }}>{value}</span>} />
                  <Tooltip formatter={(value: any, name: any, props: any) => [`${value}%`, props.payload.name]} contentStyle={{ background: '#fff', border: '1px solid #e7e5e0', borderRadius: 8, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Cartel Detection Graph */}
        <div className="card animate-in" style={{ animationDelay: '0.28s', marginBottom: 24 }}>
          <div className="card-header">
            <h3 className="card-title">Cartel & Proxy Ring Detection Network</h3>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Interactive relationship graph based on shared digital footprints</span>
          </div>
          <div className="card-body" style={{ padding: '20px' }}>
             <CartelGraphViewer />
          </div>
        </div>

        {/* Top Risk Factors */}
        <div className="card animate-in" style={{ animationDelay: '0.3s' }}>
          <div className="card-header">
            <h3 className="card-title">Top Risk Factors — Identified by AI</h3>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Based on 348 flagged bids</span>
          </div>
          <div className="card-body" style={{ padding: '4px 20px 20px' }}>
            {topRiskFactors.map((rf: any, i: number) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: i < topRiskFactors.length - 1 ? '1px solid var(--surface-200)' : 'none' }}>
                <span className="monospace" style={{ width: 24, textAlign: 'right', fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>
                  {i + 1}.
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 4 }}>{rf.factor}</div>
                  <div style={{ height: 6, background: 'var(--surface-200)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${rf.pct}%`, background: rf.pct > 20 ? 'var(--danger)' : rf.pct > 10 ? 'var(--warning)' : 'var(--info)', borderRadius: 3, transition: 'width 0.6s ease' }} />
                  </div>
                </div>
                <span className="monospace" style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', minWidth: 40, textAlign: 'right' }}>
                  {rf.count}
                </span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', minWidth: 36 }}>
                  ({rf.pct}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
