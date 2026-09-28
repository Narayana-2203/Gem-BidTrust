import TopBar from '@/components/TopBar';
import { ShieldCheck, Lock, FileText, Scale } from 'lucide-react';

export default function PoliciesPage() {
  return (
    <>
      <TopBar breadcrumbs={[{ label: 'Policies & Legal Framework' }]} />
      <div className="page-container">
        
        <div className="card animate-in" style={{ padding: 40, maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>
              Legal Framework & Compliance Policies
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 15, maxWidth: 600, margin: '0 auto' }}>
              Guidelines governing the AI-driven verification, data privacy, and automated compliance enforcement within the GeM BidTrust platform.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
            
            {/* Section 1 */}
            <section style={{ display: 'flex', gap: 20 }}>
              <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: 16, borderRadius: 'var(--radius-lg)', height: 'fit-content' }}>
                <Lock size={28} />
              </div>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, color: 'var(--text-primary)' }}>1. Data Privacy & AI Processing Protocol</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6, marginBottom: 12 }}>
                  The GeM BidTrust platform processes sensitive bidder information, including GSTINs, PANs, Financial Statements, and Director Identification Numbers (DINs). 
                  To ensure maximum data sovereignty:
                </p>
                <ul style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <li>All OCR and AI parsing is conducted in isolated environments. Bidder documents are never transmitted to public LLMs or external servers for training.</li>
                  <li>Data fetched from government APIs (GSTN, EPFO, MCA) is used strictly for real-time verification and is purged from cache in accordance with the Digital Personal Data Protection Act, 2023.</li>
                  <li>Cryptographic hashing is applied to all uploaded PDFs to ensure non-repudiation and verify document integrity.</li>
                </ul>
              </div>
            </section>

            {/* Section 2 */}
            <section style={{ display: 'flex', gap: 20 }}>
              <div style={{ background: '#fce7f3', color: '#db2777', padding: 16, borderRadius: 'var(--radius-lg)', height: 'fit-content' }}>
                <Scale size={28} />
              </div>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, color: 'var(--text-primary)' }}>2. Anti-Collusion & Cartel Detection</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6, marginBottom: 12 }}>
                  BidTrust actively mitigates the risk of cartel formation and bid rigging by analyzing latent relationships between competing bidders.
                </p>
                <ul style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <li><strong>Metadata Analysis:</strong> PDF authorship, creation timestamps, and software signatures are analyzed across competing bids to detect common origins.</li>
                  <li><strong>Network Overlaps:</strong> The system maps shared IP addresses, overlapping Director/Promoter DINs, and subsidiary relationships via the MCA portal.</li>
                  <li>Flags raised by the Cartel Detection Engine are advisory. Final disqualification requires human review by a designated Procurement Officer.</li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section style={{ display: 'flex', gap: 20 }}>
              <div style={{ background: '#dcfce7', color: '#16a34a', padding: 16, borderRadius: 'var(--radius-lg)', height: 'fit-content' }}>
                <ShieldCheck size={28} />
              </div>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, color: 'var(--text-primary)' }}>3. Automated Compliance Framework</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6, marginBottom: 12 }}>
                  The system automatically cross-references bid data against mandatory government procurement rules (e.g., GFR 2017).
                </p>
                <ul style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <li><strong>Rule GFR-149 / 170:</strong> GSTIN validity and EMD/Bid Security thresholds are strictly enforced via API lookups.</li>
                  <li><strong>Exemptions:</strong> Startups (DPIIT) and Micro/Small Enterprises (Udyam) automatically receive exemptions from prior turnover and EMD requirements as per policy.</li>
                  <li><strong>CVC Debarment:</strong> Real-time checks ensure no bidder is on the Central Vigilance Commission&apos;s debarment list at the time of evaluation.</li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section style={{ display: 'flex', gap: 20 }}>
              <div style={{ background: '#fef3c7', color: '#d97706', padding: 16, borderRadius: 'var(--radius-lg)', height: 'fit-content' }}>
                <FileText size={28} />
              </div>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, color: 'var(--text-primary)' }}>4. Audit Trail & Non-Repudiation</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6, marginBottom: 12 }}>
                  To maintain absolute transparency in the procurement process, BidTrust implements an immutable audit log.
                </p>
                <ul style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <li>Every API ping, AI compliance check, and manual officer override is recorded with a cryptographic timestamp.</li>
                  <li>Audit logs are exportable and can be presented during CAG audits or vigilance inquiries.</li>
                </ul>
              </div>
            </section>

          </div>
          
          <div style={{ marginTop: 60, paddingTop: 24, borderTop: '1px solid var(--border-light)', textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' }}>
            This framework is designed for the SIH Evaluation Prototype. Do not use as legally binding terms in production without appropriate counsel.
          </div>
        </div>

      </div>
    </>
  );
}
