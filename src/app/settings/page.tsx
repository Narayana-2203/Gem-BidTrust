'use client';
import { useState } from 'react';
import TopBar from '@/components/TopBar';
import { Settings as SettingsIcon, Globe, Brain, User, Save, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const [confidence, setConfidence] = useState(85);
  const [autoFlag, setAutoFlag] = useState(50);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };
  return (
    <>
      <TopBar breadcrumbs={[{ label: 'Settings' }]} />
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Platform configuration, portal API settings, and AI engine parameters</p>
        </div>

        <div className="two-col">
          {/* Portal Config */}
          <div className="card animate-in stagger-1">
            <div className="card-header">
              <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Globe size={16} /> Portal API Configuration</h3>
            </div>
            <div className="card-body">
              {[
                { label: 'GSTN Endpoint', value: 'https://api.gst.gov.in/v1' },
                { label: 'Udyam Endpoint', value: 'https://udyamregistration.gov.in/api' },
                { label: 'PAN / NSDL', value: 'https://tin.tin.nsdl.com/api' },
                { label: 'EPFO Portal', value: 'https://unifiedportal.epfindia.gov.in/api' },
                { label: 'MCA21 Portal', value: 'https://mca.gov.in/api/v2' },
                { label: 'GeM Portal', value: 'https://gem.gov.in/api' },
              ].map((p, i) => (
                <div className="filter-group" key={i} style={{ marginBottom: 12 }}>
                  <label className="filter-label">{p.label}</label>
                  <input className="filter-input" style={{ width: '100%' }} defaultValue={p.value} />
                </div>
              ))}
              <button className="btn btn-primary" style={{ marginTop: 8 }} onClick={handleSave}>
                {isSaved ? <><CheckCircle2 size={14} /> Saved Successfully</> : <><Save size={14} /> Save Configuration</>}
              </button>
            </div>
          </div>

          {/* AI Engine + User */}
          <div>
            <div className="card animate-in stagger-2" style={{ marginBottom: 16 }}>
              <div className="card-header">
                <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Brain size={16} /> AI Engine Configuration</h3>
              </div>
              <div className="card-body">
                <div className="filter-group" style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <label className="filter-label">Confidence Threshold</label>
                    <span className="monospace" style={{ fontSize: 13, fontWeight: 600, color: 'var(--info)' }}>{confidence}%</span>
                  </div>
                  <input type="range" min={0} max={100} value={confidence} onChange={(e) => setConfidence(parseInt(e.target.value))} style={{ width: '100%', accentColor: 'var(--info)' }} />
                </div>
                <div className="filter-group" style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <label className="filter-label">Auto-flag Score Below</label>
                    <span className="monospace" style={{ fontSize: 13, fontWeight: 600, color: 'var(--warning)' }}>{autoFlag}</span>
                  </div>
                  <input type="range" min={0} max={100} value={autoFlag} onChange={(e) => setAutoFlag(parseInt(e.target.value))} style={{ width: '100%', accentColor: 'var(--warning)' }} />
                </div>
                <div className="filter-group" style={{ marginBottom: 12 }}>
                  <label className="filter-label">OCR Engine</label>
                  <select className="filter-select" style={{ width: '100%' }}>
                    <option>PaddleOCR (Default)</option>
                    <option>Tesseract OCR</option>
                    <option>Google Cloud Vision</option>
                  </select>
                </div>
                <div className="filter-group">
                  <label className="filter-label">LLM Model</label>
                  <select className="filter-select" style={{ width: '100%' }}>
                    <option>Llama 3 8B (Local)</option>
                    <option>Gemini 2.5 Pro (API)</option>
                    <option>GPT-4o (API)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="card animate-in stagger-3">
              <div className="card-header">
                <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><User size={16} /> User Profile</h3>
              </div>
              <div className="card-body">
                <div className="filter-group" style={{ marginBottom: 12 }}>
                  <label className="filter-label">Name</label>
                  <input className="filter-input" style={{ width: '100%' }} defaultValue="Arvind Kumar" />
                </div>
                <div className="filter-group" style={{ marginBottom: 12 }}>
                  <label className="filter-label">Role</label>
                  <input className="filter-input" style={{ width: '100%' }} defaultValue="Procurement Officer" />
                </div>
                <div className="filter-group">
                  <label className="filter-label">Organization</label>
                  <input className="filter-input" style={{ width: '100%' }} defaultValue="CPSE — Bharat Heavy Electricals Ltd" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
