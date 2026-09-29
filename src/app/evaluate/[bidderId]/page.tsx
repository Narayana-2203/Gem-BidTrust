'use client';
import { useRouter } from 'next/navigation';

import TopBar from '@/components/TopBar';
import { api } from '@/services/api';
import AIDocumentScanner from '@/components/AIDocumentScanner';
import {
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Clock,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  Building2,
  MapPin,
  Calendar,
  Users,
  ChevronDown,
  ChevronUp,
  Activity
} from 'lucide-react';
import { useState, useEffect, use } from 'react';

const statusConfig = {
  verified: {
    icon: CheckCircle2,
    label: 'Verified',
    class: 'verified',
    color: 'var(--success)',
    bg: 'var(--success-light)',
  },
  needs_review: {
    icon: AlertTriangle,
    label: 'Needs Review',
    class: 'needs-review',
    color: 'var(--warning)',
    bg: 'var(--warning-light)',
  },
  non_compliant: {
    icon: XCircle,
    label: 'Non-Compliant',
    class: 'non-compliant',
    color: 'var(--danger)',
    bg: 'var(--danger-light)',
  },
  pending: {
    icon: Clock,
    label: 'Pending',
    class: 'pending',
    color: 'var(--info)',
    bg: 'var(--info-light)',
  },
  not_applicable: {
    icon: Clock,
    label: 'N/A',
    class: 'pending',
    color: 'var(--text-muted)',
    bg: 'var(--surface-100)',
  },
};

export default function EvaluateBidderPage({ params }: { params: Promise<{ bidderId: string }> }) {
  const router = useRouter();
  const { bidderId } = use(params);
  const [bidder, setBidder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedCheck, setExpandedCheck] = useState<string | null>('gst');
  const [showDecisionConfirm, setShowDecisionConfirm] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  
  // Async Verification State
  const [verifying, setVerifying] = useState(false);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [taskProgress, setTaskProgress] = useState(0);
  const [taskStep, setTaskStep] = useState('Initializing...');

  async function loadBidder() {
    const decodedId = decodeURIComponent(bidderId);
    const data = await api.getBidderEvaluation(decodedId);
    setBidder(data);
    setLoading(false);
  }

  useEffect(() => {
    loadBidder();
  }, [bidderId]);

  // Polling for async verification task
  useEffect(() => {
    if (!taskId) return;
    
    const interval = setInterval(async () => {
      const task = await api.pollTask(taskId);
      if (task.error || task.status === 'failed') {
        clearInterval(interval);
        setVerifying(false);
        setTaskId(null);
        alert(task.error || 'Verification failed');
        return;
      }
      
      setTaskProgress(task.progress);
      if (task.steps && task.steps.length > 0) {
        setTaskStep(task.steps[task.steps.length - 1].message);
      }
      
      if (task.status === 'completed') {
        clearInterval(interval);
        setTimeout(() => {
          setVerifying(false);
          setTaskId(null);
          loadBidder(); // Reload to show new data
        }, 1000);
      }
    }, 500);
    
    return () => clearInterval(interval);
  }, [taskId]);

  const handleStartVerification = async () => {
    setVerifying(true);
    setTaskProgress(0);
    setTaskStep('Starting AI verification pipeline...');
    const res = await api.startVerification(decodeURIComponent(bidderId));
    if (res.taskId) {
      setTaskId(res.taskId);
    } else {
      setVerifying(false);
    }
  };

  const handleLogDecision = () => {
    setShowDecisionConfirm(null);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      router.push('/tenders');
    }, 2500);
  };

  if (loading) {
    return (
      <>
        <TopBar breadcrumbs={[{ label: 'Tenders', href: '/tenders' }, { label: 'Bid Evaluation' }]} />
        <div className="page-container">
          <div className="page-header">
            <div className="skeleton" style={{ width: 250, height: 32, marginBottom: 8 }}></div>
            <div className="skeleton" style={{ width: 400, height: 16 }}></div>
          </div>
          
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-body" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div className="skeleton" style={{ width: 48, height: 48, borderRadius: 12 }}></div>
                <div>
                  <div className="skeleton" style={{ width: 200, height: 20, marginBottom: 8 }}></div>
                  <div className="skeleton" style={{ width: 300, height: 14 }}></div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <div className="skeleton" style={{ width: 80, height: 48, borderRadius: 8 }}></div>
                <div className="skeleton" style={{ width: 80, height: 48, borderRadius: 8 }}></div>
                <div className="skeleton" style={{ width: 80, height: 48, borderRadius: 8 }}></div>
              </div>
            </div>
          </div>

          <div className="eval-layout">
            <div>
              <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                <div className="skeleton" style={{ flex: 1, height: 60, borderRadius: 8 }}></div>
                <div className="skeleton" style={{ flex: 1, height: 60, borderRadius: 8 }}></div>
                <div className="skeleton" style={{ flex: 1, height: 60, borderRadius: 8 }}></div>
              </div>
              <div className="card">
                <div className="card-header"><div className="skeleton" style={{ width: 150, height: 20 }}></div></div>
                <div style={{ padding: 16 }}>
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="skeleton" style={{ width: '100%', height: 48, borderRadius: 8, marginBottom: 8 }}></div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <div className="skeleton" style={{ width: '100%', height: 250, borderRadius: 12, marginBottom: 16 }}></div>
              <div className="skeleton" style={{ width: '100%', height: 120, borderRadius: 12 }}></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!bidder) return null;

  // Dynamic Scoring Logic
  const checkWeights: Record<string, number> = {
    gst: 10, pan: 10, itr: 10, mii: 10, msme: 10, epfo: 8, esic: 7, startup: 5, nsic: 5, oem: 5, digilocker: 10, blacklist: 10
  };
  
  let dynamicScore = 0;
  bidder.checks.forEach((c: any) => {
    const weight = checkWeights[c.id] || 0;
    if (c.status === 'verified') dynamicScore += weight;
    if (c.status === 'needs_review') dynamicScore += (weight / 2); // 50% credit
  });
  const calculatedScore = Math.round(dynamicScore);

  const verifiedCount = bidder.checks.filter((c: any) => c.status === 'verified').length;
  const reviewCount = bidder.checks.filter((c: any) => c.status === 'needs_review').length;
  const failCount = bidder.checks.filter((c: any) => c.status === 'non_compliant').length;

  // Compute score gauge SVG
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const scoreOffset = circumference - (calculatedScore / 100) * circumference;
  const scoreColor =
    calculatedScore >= 80
      ? 'var(--success)'
      : calculatedScore >= 60
        ? 'var(--warning)'
        : 'var(--danger)';

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: 'Tenders', href: '/tenders' },
          { label: 'Bid Evaluation' },
        ]}
      />

      <div className="page-container">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="page-title">Bid Evaluation</h1>
            <p className="page-subtitle">
              AI-assisted compliance verification for {bidder.companyName}
            </p>
          </div>
          <div>
            <button 
              className="btn btn-primary" 
              onClick={handleStartVerification}
              disabled={verifying}
              style={{ display: 'flex', gap: 6, alignItems: 'center' }}
            >
              {verifying ? <Clock size={16} className="spin" /> : <Sparkles size={16} />}
              {verifying ? 'Verifying...' : 'Re-run AI Verification'}
            </button>
          </div>
        </div>

        {/* Verification Progress Bar */}
        {verifying && (
          <div className="card animate-in" style={{ marginBottom: 20, padding: 16, background: 'var(--primary-dark)', color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Activity size={14} /> AI Verification Pipeline Running
              </div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{taskProgress}%</div>
            </div>
            <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.2)', borderRadius: 3, overflow: 'hidden', marginBottom: 8 }}>
              <div style={{ width: `${taskProgress}%`, height: '100%', background: 'var(--success)', transition: 'width 0.3s ease' }} />
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontStyle: 'italic' }}>
              {taskStep}
            </div>
          </div>
        )}

        {/* Bidder Info Card */}
        <div className="card animate-in" style={{ marginBottom: 20 }}>
          <div
            className="card-body"
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--surface-200)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--info)',
                }}
              >
                <Building2 size={24} />
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                  {bidder.companyName}
                </div>
                <div style={{ display: 'flex', gap: 16, marginTop: 4 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <FileText size={12} />
                    <span className="monospace" style={{ color: 'var(--info)' }}>{bidder.bidId}</span>
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MapPin size={12} />
                    {bidder.state}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Calendar size={12} />
                    Est. {bidder.incorporationDate.split('-')[0]}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Users size={12} />
                    {bidder.employeeCount.toLocaleString('en-IN')} employees
                  </span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'center', padding: '8px 16px', background: 'var(--surface-100)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>GSTIN</div>
                <div className="monospace" style={{ fontSize: 12.5, fontWeight: 500, marginTop: 2 }}>{bidder.gstin}</div>
              </div>
              <div style={{ textAlign: 'center', padding: '8px 16px', background: 'var(--surface-100)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>PAN</div>
                <div className="monospace" style={{ fontSize: 12.5, fontWeight: 500, marginTop: 2 }}>{bidder.pan}</div>
              </div>
              <div style={{ textAlign: 'center', padding: '8px 16px', background: 'var(--surface-100)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Category</div>
                <div style={{ fontSize: 12.5, fontWeight: 600, marginTop: 2 }}>{bidder.category}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Evaluation Grid */}
        <div className="eval-layout">
          {/* LEFT: Compliance Checks */}
          <div>
            {/* Summary Row */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              <div
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  background: 'var(--success-light)',
                  borderRadius: 'var(--radius-md)',
                  borderLeft: '3px solid var(--success)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <ShieldCheck size={18} color="var(--success)" />
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, fontFamily: '"Inter", sans-serif' }}>{verifiedCount}</div>
                  <div style={{ fontSize: 11, color: 'var(--success)', fontWeight: 600 }}>Verified</div>
                </div>
              </div>
              <div
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  background: 'var(--warning-light)',
                  borderRadius: 'var(--radius-md)',
                  borderLeft: '3px solid var(--warning)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <ShieldAlert size={18} color="var(--warning)" />
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, fontFamily: '"Inter", sans-serif' }}>{reviewCount}</div>
                  <div style={{ fontSize: 11, color: 'var(--warning)', fontWeight: 600 }}>Needs Review</div>
                </div>
              </div>
              <div
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  background: 'var(--danger-light)',
                  borderRadius: 'var(--radius-md)',
                  borderLeft: '3px solid var(--danger)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <ShieldX size={18} color="var(--danger)" />
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, fontFamily: '"Inter", sans-serif' }}>{failCount}</div>
                  <div style={{ fontSize: 11, color: 'var(--danger)', fontWeight: 600 }}>Non-Compliant</div>
                </div>
              </div>
            </div>

            {/* Compliance Check List */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Compliance Checks ({bidder.checks.length})</h3>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Click to expand details</span>
              </div>
              <div style={{ padding: '12px 16px' }}>
                {bidder.checks.map((check: any) => {
                  const config = statusConfig[check.status as keyof typeof statusConfig] || statusConfig.pending;
                  const StatusIcon = config.icon;
                  const isExpanded = expandedCheck === check.id;

                  return (
                    <div
                      key={check.id}
                      style={{
                        border: `1px solid ${isExpanded ? config.color + '40' : 'var(--border-light)'}`,
                        borderLeft: `3px solid ${config.color}`,
                        borderRadius: 'var(--radius-md)',
                        marginBottom: 8,
                        overflow: 'hidden',
                        transition: 'all 0.15s ease',
                        background: isExpanded ? config.bg : '#fff',
                      }}
                    >
                      {/* Check Header */}
                      <div
                        onClick={() => setExpandedCheck(isExpanded ? null : check.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '11px 14px',
                          cursor: 'pointer',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <StatusIcon size={16} color={config.color} />
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                              {check.name}
                            </div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{check.source}</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>
                            {checkWeights[check.id] || 0} pts
                          </span>
                          <span
                            className="status-badge"
                            style={{
                              background: config.bg,
                              color: config.color,
                              fontSize: 11,
                              fontWeight: 600,
                            }}
                          >
                            {config.label}
                          </span>
                          {isExpanded ? (
                            <ChevronUp size={14} color="var(--text-muted)" />
                          ) : (
                            <ChevronDown size={14} color="var(--text-muted)" />
                          )}
                        </div>
                      </div>

                      {/* Expanded Detail */}
                      {isExpanded && (
                        <div
                          style={{
                            padding: '0 14px 14px',
                            borderTop: '1px solid var(--border-light)',
                          }}
                        >
                          <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65, padding: '12px 0 8px' }}>
                            {check.detail}
                          </div>
                          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                            {check.verifiedAt && (
                              <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                <Clock size={11} />
                                Verified at{' '}
                                {new Date(check.verifiedAt).toLocaleTimeString('en-IN', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            )}
                            <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                              Confidence: <strong style={{ color: config.color }}>{check.confidence}%</strong>
                            </span>
                            {check.documentRef && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <span
                                  style={{
                                    fontSize: 11,
                                    color: 'var(--info)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 4,
                                    cursor: 'pointer',
                                  }}
                                >
                                  <ExternalLink size={11} />
                                  {check.documentRef}
                                </span>
                                <AIDocumentScanner label="AI Deep Scan Document" />
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT: Score + AI Recommendation */}
          <div>
            {/* Score Card */}
            <div className="card animate-in" style={{ animationDelay: '0.15s', marginBottom: 16 }}>
              <div className="card-header">
                <h3 className="card-title">Compliance Score</h3>
                <span className={`risk-indicator risk-${bidder.riskLevel}`}>
                  <span className="risk-dot" />
                  {bidder.riskLevel.toUpperCase()} RISK
                </span>
              </div>
              <div className="card-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 28, paddingBottom: 28 }}>
                <div className="score-gauge">
                  <svg width="140" height="140" viewBox="0 0 140 140">
                    <circle
                      cx="70"
                      cy="70"
                      r={radius}
                      fill="none"
                      stroke="var(--surface-200)"
                      strokeWidth="10"
                    />
                    <circle
                      cx="70"
                      cy="70"
                      r={radius}
                      fill="none"
                      stroke={scoreColor}
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={scoreOffset}
                      transform="rotate(-90 70 70)"
                      style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                    />
                  </svg>
                  <div className="score-gauge-value">
                    <div className="score-gauge-number" style={{ color: scoreColor }}>
                      {calculatedScore}
                    </div>
                    <div className="score-gauge-label">out of 100</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3-Year Turnover */}
            <div className="card animate-in" style={{ animationDelay: '0.2s', marginBottom: 16 }}>
              <div className="card-header">
                <h3 className="card-title">3-Year Turnover (₹ Cr)</h3>
              </div>
              <div className="card-body">
                <div style={{ display: 'flex', gap: 12 }}>
                  {['FY 2022-23', 'FY 2023-24', 'FY 2024-25'].map((fy, i) => (
                    <div
                      key={fy}
                      style={{
                        flex: 1,
                        padding: '12px',
                        background: 'var(--surface-100)',
                        borderRadius: 'var(--radius-md)',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 4 }}>{fy}</div>
                      <div
                        className="monospace"
                        style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}
                      >
                        ₹{(bidder.turnover3yr[i] / 100).toFixed(0)} Cr
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Recommendation */}
            <div className="ai-recommendation animate-in" style={{ animationDelay: '0.25s', marginBottom: 16 }}>
              <div className="ai-recommendation-header">
                <Sparkles size={16} color="#6d28d9" />
                <span className="ai-recommendation-title">AI Recommendation</span>
              </div>
              
              {typeof bidder.aiRecommendation === 'string' ? (
                <p className="ai-recommendation-text">{bidder.aiRecommendation}</p>
              ) : (
                <div style={{ marginTop: 12 }}>
                  <p className="ai-recommendation-text" style={{ marginBottom: 16 }}>{bidder.aiRecommendation?.summary}</p>
                  
                  {bidder.aiRecommendation?.citations?.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                      {bidder.aiRecommendation.citations.map((cite: any, i: number) => (
                        <div key={i} style={{ 
                          padding: 12, 
                          background: 'var(--surface-100)', 
                          borderRadius: 'var(--radius-sm)',
                          borderLeft: `3px solid ${cite.severity === 'critical' ? 'var(--danger)' : 'var(--warning)'}` 
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>{cite.source}</span>
                            <span style={{ fontSize: 11, color: cite.severity === 'critical' ? 'var(--danger)' : 'var(--warning)' }}>
                              {cite.confidence}% Conf.
                            </span>
                          </div>
                          <div style={{ fontSize: 12.5, fontStyle: 'italic', color: 'var(--text-primary)' }}>&quot;{cite.quote}&quot;</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {bidder.aiRecommendation?.modelInfo && (
                    <div style={{ 
                      marginTop: 16, 
                      paddingTop: 12, 
                      borderTop: '1px solid var(--border-light)',
                      fontSize: 10,
                      color: 'var(--text-muted)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span>Engine: {bidder.aiRecommendation.modelInfo.engine}</span>
                        <span>Processing: {bidder.aiRecommendation.modelInfo.processingTime}</span>
                      </div>
                      <div style={{ fontStyle: 'italic' }}>{bidder.aiRecommendation.disclaimer}</div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Officer Decision Bar */}
            <div className="decision-bar animate-in" style={{ animationDelay: '0.3s' }}>
              <span className="decision-bar-label">Officer Decision</span>
              <button
                className="btn btn-success btn-sm"
                onClick={() => setShowDecisionConfirm('qualify')}
              >
                <CheckCircle2 size={14} />
                Qualify
              </button>
              <button
                className="btn btn-warning btn-sm"
                onClick={() => setShowDecisionConfirm('review')}
              >
                <AlertTriangle size={14} />
                Manual Review
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => setShowDecisionConfirm('reject')}
              >
                <XCircle size={14} />
                Disqualify
              </button>
            </div>

            {showDecisionConfirm && (
              <div
                style={{
                  marginTop: 12,
                  padding: '14px 18px',
                  background:
                    showDecisionConfirm === 'qualify'
                      ? 'var(--success-light)'
                      : showDecisionConfirm === 'review'
                        ? 'var(--warning-light)'
                        : 'var(--danger-light)',
                  border: `1px solid ${
                    showDecisionConfirm === 'qualify'
                      ? 'var(--success)'
                      : showDecisionConfirm === 'review'
                        ? 'var(--warning)'
                        : 'var(--danger)'
                  }`,
                  borderRadius: 'var(--radius-lg)',
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                  Confirm Decision: {showDecisionConfirm === 'qualify' ? 'QUALIFY' : showDecisionConfirm === 'review' ? 'MANUAL REVIEW' : 'DISQUALIFY'}
                </div>
                <textarea
                  placeholder="Add remarks (optional)..."
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-md)',
                    fontFamily: 'inherit',
                    fontSize: 13,
                    resize: 'vertical',
                    minHeight: 60,
                    outline: 'none',
                  }}
                />
                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  <button className="btn btn-primary btn-sm" onClick={handleLogDecision}>Confirm & Log Decision</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setShowDecisionConfirm(null)}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Success Toast Notification */}
      {showToast && (
        <div
          className="animate-in"
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: '#ffffff',
            border: '1px solid var(--success)',
            borderLeft: '4px solid var(--success)',
            padding: '16px 20px',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-hover)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            zIndex: 9999,
            animation: 'fadeInUp 0.3s ease-out'
          }}
        >
          <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--success-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={14} color="var(--success)" />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Decision Logged</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>The bidder status has been updated.</div>
          </div>
        </div>
      )}
    </>
  );
}
