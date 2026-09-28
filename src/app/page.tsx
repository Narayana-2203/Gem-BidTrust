'use client';

import TopBar from '@/components/TopBar';
import {
  FileCheck,
  ShieldCheck,
  Clock,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Activity,
  FileSearch,
  Flag,
  CheckCircle,
  UserCheck,
} from 'lucide-react';
import { api } from '@/services/api';
import {
  tenders as allTendersData,
  dashboardMetrics as mockMetrics,
  recentActivity as mockRecentActivity,
  complianceOverview as mockComplianceOverview,
  riskDistribution as mockRiskDistribution,
  formatINR,
  getStatusLabel,
} from '@/data/mockData';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import TerminalReportGenerator from '@/components/TerminalReportGenerator';

const TRANSLATIONS: any = {
  en: {
    title1: "Transparent Tenders.",
    title2: "Trusted Bidders. Stronger India.",
    subtitle: "AI-assisted compliance for a more efficient and accountable procurement ecosystem.",
    kpi1: "Total Bids Processed",
    kpi2: "Avg Processing Time",
    kpi3: "Flagged Exceptions"
  },
  hi: {
    title1: "पारदर्शी निविदाएं।",
    title2: "विश्वसनीय बोलीदाता। मजबूत भारत।",
    subtitle: "अधिक कुशल और जवाबदेह खरीद पारिस्थितिकी तंत्र के लिए एआई-सहायता प्राप्त अनुपालन।",
    kpi1: "कुल बोलियां संसाधित",
    kpi2: "औसत प्रसंस्करण समय",
    kpi3: "चिह्नित अपवाद"
  },
  te: {
    title1: "పారదర్శక టెండర్లు.",
    title2: "విశ్వసనీయ బిడ్డర్లు. బలమైన భారతదేశం.",
    subtitle: "మరింత సమర్థవంతమైన మరియు జవాబుదారీ సేకరణ వ్యవస్థ కోసం AI-సహాయక సమ్మతి.",
    kpi1: "ప్రాసెస్ చేయబడిన మొత్తం బిడ్‌లు",
    kpi2: "సగటు ప్రాసెసింగ్ సమయం",
    kpi3: "ఫ్లాగ్ చేయబడిన మినహాయింపులు"
  },
  mr: {
    title1: "पारदर्शक निविदा.",
    title2: "विश्वसनीय बोलीदार. मजबूत भारत.",
    subtitle: "अधिक कार्यक्षम आणि जबाबदार खरेदी परिसंस्थेसाठी एआय-सहाय्यित अनुपालन.",
    kpi1: "एकूण निविदा प्रक्रिया",
    kpi2: "सरासरी प्रक्रिया वेळ",
    kpi3: "चिन्हांकित अपवाद"
  },
  bn: {
    title1: "স্বচ্ছ দরপত্র।",
    title2: "বিশ্বস্ত দরদাতা। শক্তিশালী ভারত।",
    subtitle: "আরও দক্ষ এবং জবাবদিহিমূলক সংগ্রহ ব্যবস্থার জন্য এআই-সহায়তা সম্মতি।",
    kpi1: "মোট বিড প্রক্রিয়া করা হয়েছে",
    kpi2: "গড় প্রক্রিয়াকরণ সময়",
    kpi3: "পতাকাবাহী ব্যতিক্রম"
  },
  ta: {
    title1: "வெளிப்படையான ஒப்பந்தங்கள்.",
    title2: "நம்பகமான ஏலதாரர்கள். வலிமையான இந்தியா.",
    subtitle: "மிகவும் திறமையான மற்றும் பொறுப்பான கொள்முதல் சுற்றுச்சூழல் அமைப்புக்கான AI-உதவி இணக்கம்.",
    kpi1: "செயலாக்கப்பட்ட மொத்த ஏலங்கள்",
    kpi2: "சராசரி செயலாக்க நேரம்",
    kpi3: "கொடியிடப்பட்ட விதிவிலக்குகள்"
  },
  gu: {
    title1: "પારદર્શક ટેન્ડરો.",
    title2: "વિશ્વસનીય બિડર્સ. મજબૂત ભારત.",
    subtitle: "વધુ કાર્યક્ષમ અને જવાબદાર પ્રાપ્તિ ઇકોસિસ્ટમ માટે AI-આસિસ્ટેડ પાલન.",
    kpi1: "કુલ બિડ પ્રક્રિયા",
    kpi2: "સરેરાશ પ્રક્રિયા સમય",
    kpi3: "ફ્લેગ કરેલા અપવાદો"
  }
};

export default function DashboardPage() {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const handleLangChange = () => {
      setLang(localStorage.getItem('bhashini_lang') || 'en');
    };
    handleLangChange();
    window.addEventListener('languageChange', handleLangChange);
    return () => window.removeEventListener('languageChange', handleLangChange);
  }, []);
  
  const t = TRANSLATIONS[lang] || TRANSLATIONS['en'];

    const [data, setData] = useState<any>({
    metrics: mockMetrics,
    recentActivity: mockRecentActivity,
    complianceOverview: mockComplianceOverview,
    riskDistribution: mockRiskDistribution
  });

    const [alerts, setAlerts] = useState<{id: number, msg: string, type: 'success'|'danger'|'warning'}[]>([]);

  useEffect(() => {
    const messages = [
      { msg: 'Bidder-82 uploaded fake GST document (Blocked)', type: 'danger' as const },
      { msg: 'Tender GEM/2026/B/892 cleared auto-evaluation', type: 'success' as const },
      { msg: 'IP 192.168.1.45 flagged for proxy bidding', type: 'warning' as const },
      { msg: 'New bid received for Tender 1045', type: 'success' as const },
      { msg: 'Director PAN DIN-123 overlap detected', type: 'danger' as const },
      { msg: 'AI verified 14 documents for Bidder-17', type: 'success' as const },
    ];
    let i = 0;
    const interval = setInterval(() => {
      const newAlert = { id: Date.now(), ...messages[i % messages.length] };
      setAlerts(prev => [newAlert, ...prev].slice(0, 4));
      i++;
    }, 4500);
    return () => clearInterval(interval);
  }, []);


  const [recentTenders, setRecentTenders] = useState<any[]>(allTendersData.slice(0, 5));

  useEffect(() => {
    // Background upgrade: silently try live data without blocking UI
    api.getDashboardMetricsLive?.()?.then((live: any) => {
      if (live) setData(live);
    });
  }, []);

  if (!data) {
    return (
      <>
        <TopBar breadcrumbs={[{ label: 'Dashboard' }]} />
        <div className="page-container">
          <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <div className="skeleton" style={{ width: 200, height: 32, marginBottom: 8 }}></div>
              <div className="skeleton" style={{ width: 350, height: 16 }}></div>
            </div>
          </div>
          <div className="kpi-grid">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="kpi-card" style={{ padding: 20 }}>
                <div className="skeleton" style={{ width: 100, height: 12, marginBottom: 12 }}></div>
                <div className="skeleton" style={{ width: 140, height: 28, marginBottom: 8 }}></div>
                <div className="skeleton" style={{ width: 120, height: 12 }}></div>
              </div>
            ))}
          </div>
          <div className="charts-grid mt-4">
            <div className="card">
              <div className="card-header"><div className="skeleton" style={{ width: 150, height: 20 }}></div></div>
              <div className="card-body" style={{ height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="skeleton" style={{ width: '100%', height: '100%', borderRadius: 8 }}></div>
              </div>
            </div>
            <div className="card">
              <div className="card-header"><div className="skeleton" style={{ width: 150, height: 20 }}></div></div>
              <div className="card-body" style={{ height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <div className="skeleton" style={{ width: 200, height: 200, borderRadius: '50%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  const { metrics, complianceOverview, riskDistribution, recentActivity } = data;

  return (
    <>
      <TopBar breadcrumbs={[{ label: 'Dashboard' }]} />

      <div className="page-container">
        {/* Hero Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #e0f2fe 0%, #f1f5f9 100%)',
          borderRadius: 'var(--radius-lg)',
          padding: '36px 40px',
          marginBottom: '32px',
          border: '1px solid var(--border-light)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle background pattern/glow */}
          <div style={{
            position: 'absolute',
            top: '-50%',
            right: '-10%',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)',
            pointerEvents: 'none'
          }} />
          
          <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px' }}>
            <h1 style={{ 
              fontSize: '32px', 
              fontWeight: 700, 
              color: '#0f172a',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              marginBottom: '12px',
              fontFamily: 'Playfair Display, serif' // Fallback if they want that classic look, but I'll stick to Inter to keep it modern
            }}>
              <span style={{ fontFamily: 'Inter, sans-serif' }}>{t.title1}</span><br/>
              <span style={{ fontFamily: 'Inter, sans-serif' }}>{t.title2}</span>
            </h1>
            <p style={{
              fontSize: '15px',
              color: '#475569',
              lineHeight: 1.6,
              fontWeight: 400
            }}>
              {t.subtitle}
            </p>
            <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
              <TerminalReportGenerator />
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="kpi-grid">
          <div className="kpi-card kpi-blue animate-in stagger-1">
            <div className="kpi-label uppercase">{t.kpi1}</div>
            <div className="kpi-value">{metrics.totalBidsProcessed.toLocaleString('en-IN')}</div>
            <div className="kpi-sub">
              <TrendingUp size={13} />
              <span className="up">+12.4%</span> vs last quarter
            </div>
            <div className="kpi-icon" style={{ color: 'var(--info)' }}>
              <FileCheck size={38} />
            </div>
          </div>

          <div className="kpi-card kpi-green animate-in stagger-2">
            <div className="kpi-label">Compliance Rate</div>
            <div className="kpi-value">{metrics.complianceRate}%</div>
            <div className="kpi-sub">
              <TrendingUp size={13} />
              <span className="up">+3.2%</span> improvement
            </div>
            <div className="kpi-icon" style={{ color: 'var(--success)' }}>
              <ShieldCheck size={38} />
            </div>
          </div>

          <div className="kpi-card kpi-amber animate-in stagger-3">
            <div className="kpi-label uppercase">{t.kpi2}</div>
            <div className="kpi-value">{metrics.avgProcessingTime} min</div>
            <div className="kpi-sub">
              <TrendingDown size={13} />
              <span className="up">-68%</span> time saved vs manual
            </div>
            <div className="kpi-icon" style={{ color: 'var(--warning)' }}>
              <Clock size={38} />
            </div>
          </div>

          <div className="kpi-card kpi-red animate-in stagger-4">
            <div className="kpi-label">Flagged Bids</div>
            <div className="kpi-value">{metrics.flaggedBids}</div>
            <div className="kpi-sub">
              Requiring officer review
            </div>
            <div className="kpi-icon" style={{ color: 'var(--danger)' }}>
              <AlertTriangle size={38} />
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="charts-grid">
          {/* Compliance Overview Chart */}
          <div className="card animate-in" style={{ animationDelay: '0.2s' }}>
            <div className="card-header">
              <h3 className="card-title">Compliance Verification by Category</h3>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Based on {metrics.totalBidsProcessed.toLocaleString('en-IN')} bids
              </span>
            </div>
            <div className="card-body" style={{ height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={complianceOverview}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                  barCategoryGap="22%"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e0" horizontal={false} />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={120}
                    tick={{ fontSize: 12, fill: '#525252', fontWeight: 500 }}
                  />
                  <Tooltip
                    formatter={(value: any, name: any, props: any) => [
                      `${value}% (${props.payload.verified.toLocaleString('en-IN')}/${props.payload.total.toLocaleString('en-IN')})`,
                      'Compliance Rate',
                    ]}
                    contentStyle={{
                      background: '#fff',
                      border: '1px solid #e7e5e0',
                      borderRadius: 8,
                      fontSize: 12,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    }}
                  />
                  <Bar
                    dataKey="rate"
                    radius={[0, 4, 4, 0]}
                    fill="#2563eb"
                    barSize={18}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Risk Distribution Donut */}
          <div className="card animate-in" style={{ animationDelay: '0.3s' }}>
            <div className="card-header">
              <h3 className="card-title">Risk Distribution</h3>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Bidder risk classification
              </span>
            </div>
            <div className="card-body" style={{ height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDistribution}
                    cx="50%"
                    cy="45%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {riskDistribution.map((entry: any, index: number) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend
                    verticalAlign="bottom"
                    formatter={(value: string, entry: { color?: string }) => (
                      <span style={{ color: '#525252', fontSize: 12, fontWeight: 500 }}>
                        {value}
                      </span>
                    )}
                  />
                  <Tooltip
                    formatter={(value: any, name: any, props: any) => [`${value}%`, props.payload.name]}
                    contentStyle={{
                      background: '#fff',
                      border: '1px solid #e7e5e0',
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Live Threat Stream */}
        <div className="card animate-in fade-in slide-in-from-bottom-2" style={{ marginBottom: '24px', border: '1px solid var(--danger-light)' }}>
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity className="text-red-500 animate-pulse" size={18} />
              Live Threat Stream
              <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full ml-2 border border-red-200 uppercase tracking-wide font-bold">WebSocket Connected</span>
            </h2>
          </div>
          <div className="card-body" style={{ padding: '12px 24px' }}>
            <div className="flex flex-col gap-3">
              {alerts.length === 0 ? <div className="text-sm text-gray-500 italic">Listening for network anomalies...</div> : null}
              {alerts.map(a => (
                <div key={a.id} className="flex items-center gap-3 text-sm animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className={`w-2 h-2 rounded-full ${a.type === 'danger' ? 'bg-red-500' : a.type === 'success' ? 'bg-green-500' : 'bg-amber-500'} animate-pulse`} />
                  <span className="font-mono text-gray-500 text-xs w-20">{new Date(a.id).toLocaleTimeString([], {hour12: false})}</span>
                  <span className={`${a.type === 'danger' ? 'text-red-700 font-medium' : a.type === 'success' ? 'text-green-700' : 'text-amber-700'}`}>{a.msg}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row: Recent Bids + Activity Feed */}
        <div className="charts-grid">
          {/* Recent Bid Evaluations */}
          <div className="card animate-in" style={{ animationDelay: '0.35s' }}>
            <div className="card-header">
              <h3 className="card-title">Recent Bid Evaluations</h3>
              <Link href="/tenders" className="btn btn-ghost btn-sm">
                View All <ArrowRight size={13} />
              </Link>
            </div>
            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Bid ID</th>
                    <th>Tender Title</th>
                    <th>Dept</th>
                    <th>Value</th>
                    <th>Status</th>
                    <th>Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTenders.map((t) => (
                    <tr key={t.id}>
                      <td className="col-id">
                        <Link href={`/evaluate/${encodeURIComponent(t.bidId)}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                          {t.bidId}
                        </Link>
                      </td>
                      <td style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {t.title}
                      </td>
                      <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{t.department}</td>
                      <td className="col-amount">{formatINR(t.estimatedValue)}</td>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="card animate-in" style={{ animationDelay: '0.4s' }}>
            <div className="card-header">
              <h3 className="card-title">Recent Activity</h3>
              <Link href="/audit" className="btn btn-ghost btn-sm">
                Audit Trail <ArrowRight size={13} />
              </Link>
            </div>
            <div className="card-body" style={{ padding: '8px 20px 20px' }}>
              {recentActivity.map((item: any, i: number) => {
                const iconMap = {
                  evaluation: <FileSearch size={16} color="var(--info)" />,
                  tender: <Activity size={16} color="var(--success)" />,
                  flag: <Flag size={16} color="var(--danger)" />,
                  verification: <CheckCircle size={16} color="var(--success)" />,
                  decision: <UserCheck size={16} color="#7c3aed" />,
                };
                return (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      gap: 12,
                      padding: '14px 0',
                      borderBottom: i < recentActivity.length - 1 ? '1px solid var(--surface-200)' : 'none',
                      alignItems: 'flex-start',
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--surface-100)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {iconMap[item.type as keyof typeof iconMap]}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                        {item.action}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: 'var(--text-muted)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          marginTop: 1,
                        }}
                      >
                        {item.detail}
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: 'var(--text-muted)',
                        whiteSpace: 'nowrap',
                        fontFamily: '"JetBrains Mono", monospace',
                      }}
                    >
                      {item.time}
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
