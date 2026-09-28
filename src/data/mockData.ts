// ============================================================
// GeM BidTrust — Mock Data
// Realistic Indian Government Procurement Data
// ============================================================

export interface Tender {
  id: string;
  bidId: string;
  title: string;
  department: string;
  ministry: string;
  category: string;
  estimatedValue: number; // in lakhs
  bidders: number;
  closingDate: string;
  status: 'active' | 'under_evaluation' | 'clarification' | 'awarded' | 'cancelled';
  riskLevel: 'low' | 'medium' | 'high';
  dataSource: 'live' | 'mock' | 'platform' | 'user';
}

export interface ComplianceCheck {
  id: string;
  name: string;
  category: string;
  status: 'verified' | 'needs_review' | 'non_compliant' | 'pending' | 'not_applicable';
  source: string;
  detail: string;
  verifiedAt?: string;
  confidence: number;
  documentRef?: string;
}

export interface BidderProfile {
  companyName: string;
  bidId: string;
  gstin: string;
  pan: string;
  udyamNumber: string;
  category: string;
  state: string;
  incorporationDate: string;
  turnover3yr: number[];
  employeeCount: number;
  msmeCategory: 'micro' | 'small' | 'medium' | 'large';
  complianceScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  aiRecommendation: string;
  checks: ComplianceCheck[];
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  type: 'upload' | 'ai_verification' | 'ai_flag' | 'officer_decision' | 'portal_query' | 'final_verdict';
  title: string;
  detail: string;
  actor: string;
  bidId: string;
  evidence?: string;
}

export const dashboardMetrics = {
  totalBidsProcessed: 384,
  complianceRate: 91.7,
  avgProcessingTime: 14, // minutes
  flaggedBids: 12,
  timeSaved: 68, // percentage
  activeTenders: 273,
  closingIn7Days: 21,
  totalDepartments: 42,
};

export const complianceOverview = [
  { name: 'GST Registration', rate: 94, verified: 361, total: 384 },
  { name: 'PAN Verification', rate: 97, verified: 372, total: 384 },
  { name: 'MSME/Udyam', rate: 82, verified: 315, total: 384 },
  { name: 'EPFO/ESIC', rate: 76, verified: 292, total: 384 },
  { name: 'Make in India', rate: 61, verified: 234, total: 384 },
  { name: 'Income Tax', rate: 89, verified: 341, total: 384 },
  { name: 'OEM Authorization', rate: 71, verified: 272, total: 384 },
  { name: 'Blacklisting Check', rate: 99, verified: 380, total: 384 },
];

export const riskDistribution = [
  { name: 'Low Risk', value: 70, color: '#10b981' },
  { name: 'Medium Risk', value: 20, color: '#f59e0b' },
  { name: 'High Risk', value: 10, color: '#ef4444' },
];

export const tenders: Tender[] = [
  {
    id: '1',
    bidId: 'GEM/2026/B/10231',
    title: 'Supply, Installation and Commissioning of Desktop Computers',
    department: 'MeitY',
    ministry: 'Ministry of Electronics & IT',
    category: 'IT Hardware',
    estimatedValue: 1250,
    bidders: 18,
    closingDate: '30 Apr 2026',
    status: 'under_evaluation',
    riskLevel: 'high',
    dataSource: 'mock',
  },
  {
    id: '2',
    bidId: 'GEM/2026/B/10232',
    title: 'Comprehensive Security Surveillance System for Campus',
    department: 'Ministry of Defence',
    ministry: 'Ministry of Defence',
    category: 'Security Services',
    estimatedValue: 820,
    bidders: 7,
    closingDate: '28 Apr 2026',
    status: 'active',
    riskLevel: 'medium',
    dataSource: 'mock',
  },
  {
    id: '3',
    bidId: 'GEM/2026/B/10233',
    title: 'Procurement of Medical Equipment for District Hospitals',
    department: 'MoHFW',
    ministry: 'Ministry of Health & Family Welfare',
    category: 'Medical Equipment',
    estimatedValue: 2500,
    bidders: 24,
    closingDate: '27 Apr 2026',
    status: 'active',
    riskLevel: 'low',
    dataSource: 'mock',
  },
  {
    id: '4',
    bidId: 'GEM/2026/B/10234',
    title: 'Solar Power Systems for Government Buildings Phase-II',
    department: 'MNRE',
    ministry: 'Ministry of New & Renewable Energy',
    category: 'Renewable Energy',
    estimatedValue: 1875,
    bidders: 12,
    closingDate: '26 Apr 2026',
    status: 'active',
    riskLevel: 'medium',
    dataSource: 'mock',
  },
  {
    id: '5',
    bidId: 'GEM/2026/B/10235',
    title: 'Office Stationery and Consumables Annual Rate Contract',
    department: 'Ministry of Education',
    ministry: 'Ministry of Education',
    category: 'Office Supplies',
    estimatedValue: 210,
    bidders: 9,
    closingDate: '25 Apr 2026',
    status: 'under_evaluation',
    riskLevel: 'low',
    dataSource: 'mock',
  },
  {
    id: '6',
    bidId: 'GEM/2026/B/10236',
    title: 'Annual Maintenance of Railway Signal Equipment',
    department: 'Ministry of Railways',
    ministry: 'Ministry of Railways',
    category: 'AMC Services',
    estimatedValue: 1530,
    bidders: 5,
    closingDate: '24 Apr 2026',
    status: 'active',
    riskLevel: 'high',
    dataSource: 'mock',
  },
  {
    id: '7',
    bidId: 'GEM/2026/B/10237',
    title: 'Supply of Vaccines (Test Data) for Immunization Programme',
    department: 'MoHFW',
    ministry: 'Ministry of Health & Family Welfare',
    category: 'Pharmaceuticals',
    estimatedValue: 960,
    bidders: 11,
    closingDate: '23 Apr 2026',
    status: 'active',
    riskLevel: 'medium',
    dataSource: 'mock',
  },
  {
    id: '8',
    bidId: 'GEM/2026/B/10238',
    title: 'Data Center Infrastructure Upgrade and Cloud Migration',
    department: 'Ministry of Finance',
    ministry: 'Ministry of Finance',
    category: 'IT Infrastructure',
    estimatedValue: 3000,
    bidders: 14,
    closingDate: '22 Apr 2026',
    status: 'clarification',
    riskLevel: 'high',
    dataSource: 'mock',
  },
  {
    id: '9',
    bidId: 'GEM/2026/B/10239',
    title: 'Smart Classroom Solutions for Government Schools',
    department: 'Ministry of Education',
    ministry: 'Ministry of Education',
    category: 'EdTech',
    estimatedValue: 640,
    bidders: 8,
    closingDate: '21 Apr 2026',
    status: 'active',
    riskLevel: 'low',
    dataSource: 'mock',
  },
  {
    id: '10',
    bidId: 'GEM/2026/B/10240',
    title: 'Fire Fighting Equipment for Industrial Safety Compliance',
    department: 'Ministry of Home Affairs',
    ministry: 'Ministry of Home Affairs',
    category: 'Safety Equipment',
    estimatedValue: 575,
    bidders: 6,
    closingDate: '20 Apr 2026',
    status: 'active',
    riskLevel: 'medium',
    dataSource: 'mock',
  },
];

export const sampleBidder: BidderProfile = {
  companyName: 'Bharat Electronics Limited',
  bidId: 'GEM/2026/B/10231',
  gstin: '29AABCB1234F1ZP',
  pan: 'AABCB1234F',
  udyamNumber: 'UDYAM-KA-03-0012345',
  category: 'IT Hardware',
  state: 'Karnataka',
  incorporationDate: '1954-04-01',
  turnover3yr: [14250, 15800, 17200],
  employeeCount: 10500,
  msmeCategory: 'large',
  complianceScore: 82,
  riskLevel: 'medium',
  aiRecommendation: 'Recommend for Manual Review — Make in India local content declaration (42%) is below the tender threshold of 50%. Income Tax Return for AY 2025-26 shows a discrepancy of ₹12.4L between reported and portal-verified turnover. All other statutory compliances are verified and current.',
  checks: [
    {
      id: 'gst',
      name: 'GST Registration',
      category: 'Statutory',
      status: 'verified',
      source: 'GSTN Portal',
      detail: 'GSTIN 29AABCB1234F1ZP — Active, Regular filing. Last return filed: Mar 2026 (GSTR-3B).',
      verifiedAt: '2026-04-22T10:16:00',
      confidence: 98,
      documentRef: 'GST_Certificate_BEL.pdf',
    },
    {
      id: 'pan',
      name: 'PAN Verification',
      category: 'Statutory',
      status: 'verified',
      source: 'NSDL / Income Tax Portal',
      detail: 'PAN AABCB1234F — Status: Active. Name match: Bharat Electronics Limited ✓.',
      verifiedAt: '2026-04-22T10:17:00',
      confidence: 99,
    },
    {
      id: 'itr',
      name: 'Income Tax Returns',
      category: 'Financial',
      status: 'needs_review',
      source: 'Income Tax Portal',
      detail: 'ITR filed for AY 2025-26. Discrepancy: Reported turnover ₹158 Cr vs Portal-verified ₹145.6 Cr (Δ ₹12.4L). AY 2024-25 and AY 2023-24 returns verified without discrepancy.',
      verifiedAt: '2026-04-22T10:17:30',
      confidence: 62,
    },
    {
      id: 'mii',
      name: 'Make in India Declaration',
      category: 'Policy',
      status: 'non_compliant',
      source: 'Bidder Declaration + DPIIT',
      detail: 'Declared local content: 42%. Tender requirement: Minimum 50%. Shortfall of 8 percentage points. Class-I Local Supplier threshold not met.',
      verifiedAt: '2026-04-22T10:18:45',
      confidence: 88,
    },
    {
      id: 'msme',
      name: 'Udyam / MSME Registration',
      category: 'Statutory',
      status: 'verified',
      source: 'Udyam Portal',
      detail: 'UDYAM-KA-03-0012345 — Registered as Large Enterprise. Valid until: 31 Mar 2027.',
      verifiedAt: '2026-04-22T10:16:30',
      confidence: 96,
      documentRef: 'MSME_Udyam_Cert.pdf',
    },
    {
      id: 'epfo',
      name: 'EPFO Compliance',
      category: 'Labour',
      status: 'verified',
      source: 'EPFO Portal',
      detail: 'Establishment Code: KABLR0012345. Active with 10,500 employees. Last ECR filed: Mar 2026. No defaults.',
      verifiedAt: '2026-04-22T10:18:00',
      confidence: 94,
    },
    {
      id: 'esic',
      name: 'ESIC Compliance',
      category: 'Labour',
      status: 'verified',
      source: 'ESIC Portal',
      detail: 'ESIC Code: 53001234567890123. Contributions current till Mar 2026. No inspection flags.',
      verifiedAt: '2026-04-22T10:18:15',
      confidence: 92,
    },
    {
      id: 'startup',
      name: 'Startup India Recognition',
      category: 'Eligibility',
      status: 'not_applicable',
      source: 'DPIIT Startup Portal',
      detail: 'Company is not registered as a Startup. Incorporated in 1954 (Exceeds 10-year criteria). Exemption from prior turnover not applicable.',
      verifiedAt: '2026-04-22T10:18:20',
      confidence: 99,
    },
    {
      id: 'nsic',
      name: 'NSIC Registration',
      category: 'Eligibility',
      status: 'not_applicable',
      source: 'NSIC Portal',
      detail: 'No active NSIC Registration Certificate found for this PAN/GSTIN. Exemption from EMD not claimed under NSIC.',
      verifiedAt: '2026-04-22T10:18:25',
      confidence: 99,
    },
    {
      id: 'oem',
      name: 'OEM Authorization',
      category: 'Eligibility',
      status: 'verified',
      source: 'Bidder Document',
      detail: 'OEM Authorization Letter from Intel Corporation for i5/i7 processor supply. Valid till 31 Dec 2026.',
      verifiedAt: '2026-04-22T10:19:00',
      confidence: 85,
      documentRef: 'OEM_Auth_Intel.pdf',
    },
    {
      id: 'digilocker',
      name: 'DigiLocker Verification',
      category: 'Security',
      status: 'verified',
      source: 'DigiLocker API',
      detail: 'Bidder consent acquired. Document hashes (GST, PAN, Incorporation Cert) successfully verified against DigiLocker issued documents.',
      verifiedAt: '2026-04-22T10:19:15',
      confidence: 100,
    },
    {
      id: 'blacklist',
      name: 'Blacklisting / Debarment',
      category: 'Eligibility',
      status: 'verified',
      source: 'GeM + CVC + State Portals',
      detail: 'No debarment or blacklisting found across GeM, CVC, or any State Government procurement portals as of 22 Apr 2026.',
      verifiedAt: '2026-04-22T10:19:30',
      confidence: 99,
    },
  ],
};

export const auditEntries: AuditEntry[] = [
  {
    id: 'a1',
    timestamp: '2026-04-22T10:15:00',
    type: 'upload',
    title: 'Document Pack Uploaded',
    detail: 'Bid compliance document pack (6 files, 4.2 MB total) uploaded for Bid GEM/2026/B/10231 — Bharat Electronics Limited.',
    actor: 'Arvind Kumar, Procurement Officer',
    bidId: 'GEM/2026/B/10231',
  },
  {
    id: 'a2',
    timestamp: '2026-04-22T10:16:00',
    type: 'portal_query',
    title: 'Portal Integration — GSTN',
    detail: 'Queried GSTN portal for GSTIN 29AABCB1234F1ZP. Response: Active, Regular filing. Last GSTR-3B filed Mar 2026. Match confirmed with uploaded GST certificate.',
    actor: 'AI Verification Engine',
    bidId: 'GEM/2026/B/10231',
    evidence: 'GSTN API Response Hash: 8f14e45f...',
  },
  {
    id: 'a3',
    timestamp: '2026-04-22T10:16:30',
    type: 'ai_verification',
    title: 'Udyam Registration Verified',
    detail: 'Cross-verified Udyam number UDYAM-KA-03-0012345 against Udyam Portal. Enterprise name, PAN, and date of registration match. Classification: Large Enterprise.',
    actor: 'AI Verification Engine',
    bidId: 'GEM/2026/B/10231',
  },
  {
    id: 'a4',
    timestamp: '2026-04-22T10:17:00',
    type: 'ai_verification',
    title: 'PAN Verified via NSDL',
    detail: 'PAN AABCB1234F verified against NSDL database. Name match confirmed: "Bharat Electronics Limited". PAN status: Active. No mismatches detected.',
    actor: 'AI Verification Engine',
    bidId: 'GEM/2026/B/10231',
  },
  {
    id: 'a5',
    timestamp: '2026-04-22T10:17:30',
    type: 'ai_flag',
    title: 'Income Tax Discrepancy Detected',
    detail: 'ITR for AY 2025-26 shows reported turnover ₹158 Cr, but Income Tax portal reflects ₹145.6 Cr (Difference: ₹12.4 Lakhs). This may be due to revised return filing or portal sync delay. Flagged for officer review.',
    actor: 'AI Verification Engine',
    bidId: 'GEM/2026/B/10231',
    evidence: 'ITR Portal Snapshot captured at 10:17:28 IST',
  },
  {
    id: 'a6',
    timestamp: '2026-04-22T10:18:00',
    type: 'ai_verification',
    title: 'EPFO & ESIC Compliance Verified',
    detail: 'EPFO Establishment Code KABLR0012345 — active, 10,500 employees, ECR filed till Mar 2026. ESIC contributions current. No default or inspection flags.',
    actor: 'AI Verification Engine',
    bidId: 'GEM/2026/B/10231',
  },
  {
    id: 'a7',
    timestamp: '2026-04-22T10:18:45',
    type: 'ai_flag',
    title: 'Make in India — Below Threshold',
    detail: 'Declared local content: 42%. Tender requirement: Minimum 50% for Class-I Local Supplier status. Shortfall: 8 percentage points. Bidder does not qualify as Class-I Local Supplier under DPIIT Order dated 04 Jun 2020 (revised).',
    actor: 'AI Verification Engine',
    bidId: 'GEM/2026/B/10231',
    evidence: 'Bidder Declaration Form Clause 4.2, DPIIT Order No. P-45021/2/2017-PP',
  },
  {
    id: 'a8',
    timestamp: '2026-04-22T10:20:00',
    type: 'officer_decision',
    title: 'Bid Marked for Manual Review',
    detail: 'After reviewing AI-generated compliance report, officer has marked bid for manual review citing: (1) Income tax turnover discrepancy needs verification with CA certificate, and (2) Make in India percentage below threshold — vendor to submit revised local content breakdown.',
    actor: 'Arvind Kumar, Procurement Officer',
    bidId: 'GEM/2026/B/10231',
  },
  {
    id: 'a9',
    timestamp: '2026-04-22T10:45:00',
    type: 'final_verdict',
    title: 'Bid QUALIFIED with Conditions',
    detail: 'Officer has qualified the bid with conditions: (1) Vendor to submit CA-certified turnover statement within 7 working days, (2) Revised Make in India declaration with component-wise breakdown to be submitted before L1 evaluation. If conditions not met within the stipulated period, bid will be treated as non-responsive.',
    actor: 'Arvind Kumar, Procurement Officer',
    bidId: 'GEM/2026/B/10231',
  },
];

export const recentActivity = [
  { action: 'Bid evaluated', detail: 'GEM/2026/B/10231 — Bharat Electronics Ltd', time: '12 min ago', type: 'evaluation' as const },
  { action: 'New tender added', detail: 'GEM/2026/B/10241 — Cloud Services RFP', time: '28 min ago', type: 'tender' as const },
  { action: 'High risk flagged', detail: 'GEM/2026/B/10238 — Data Center Infra', time: '1 hr ago', type: 'flag' as const },
  { action: 'Compliance verified', detail: 'GEM/2026/B/10233 — Medical Equipment', time: '2 hr ago', type: 'verification' as const },
  { action: 'Officer decision', detail: 'GEM/2026/B/10236 — Railway Signals AMC', time: '3 hr ago', type: 'decision' as const },
];

export function formatINR(lakhs: number): string {
  if (lakhs >= 100) {
    const crores = lakhs / 100;
    return `₹ ${crores.toFixed(2)} Cr`;
  }
  return `₹ ${lakhs.toFixed(2)} L`;
}

export function getStatusLabel(status: Tender['status']): string {
  const map: Record<Tender['status'], string> = {
    active: 'Active',
    under_evaluation: 'Under Evaluation',
    clarification: 'Clarification',
    awarded: 'Awarded',
    cancelled: 'Cancelled',
  };
  return map[status];
}

export function getRiskColor(risk: 'low' | 'medium' | 'high'): string {
  const map = { low: '#10b981', medium: '#f59e0b', high: '#ef4444' };
  return map[risk];
}

export const tenderBidders = Array.from({ length: 124 }).map((_, i) => {
  // 70% Low Risk, 20% Medium, 10% High
  const riskLevels: ('low' | 'medium' | 'high')[] = ['low', 'low', 'low', 'low', 'low', 'low', 'low', 'medium', 'medium', 'high'];
  const risk = riskLevels[Math.floor(Math.random() * riskLevels.length)];
  
  const statuses: ('verified' | 'needs_review' | 'non_compliant')[] = 
    risk === 'low' ? ['verified', 'verified', 'verified', 'needs_review'] :
    risk === 'medium' ? ['verified', 'needs_review', 'needs_review'] :
    ['needs_review', 'non_compliant', 'non_compliant'];

  const status = statuses[Math.floor(Math.random() * statuses.length)];
  
  const score = 
    risk === 'low' ? Math.floor(Math.random() * 15) + 85 : 
    risk === 'medium' ? Math.floor(Math.random() * 20) + 65 : 
    Math.floor(Math.random() * 25) + 40;

  const msmeCategories: ('micro' | 'small' | 'medium' | 'large')[] = ['micro', 'small', 'medium', 'large'];
  
  return {
    id: `bidder-${i + 1}`,
    companyName: `Bidder Company ${i + 1} ${['Pvt Ltd', 'Ltd', 'Enterprises', 'Technologies'][Math.floor(Math.random() * 4)]}`,
    bidId: 'GEM/2026/B/10231',
    gstin: `${Math.floor(Math.random() * 30 + 10)}AABC${String.fromCharCode(65 + Math.floor(Math.random() * 26))}1234F1Z${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
    pan: `AABC${String.fromCharCode(65 + Math.floor(Math.random() * 26))}1234F`,
    state: ['Karnataka', 'Maharashtra', 'Delhi', 'Tamil Nadu', 'Gujarat', 'Telangana'][Math.floor(Math.random() * 6)],
    msmeCategory: msmeCategories[Math.floor(Math.random() * msmeCategories.length)],
    complianceScore: score,
    riskLevel: risk,
    status: status,
    documentsAnalyzed: Math.floor(Math.random() * 5) + 10,
    evaluatedAt: `22 Apr 2026, 10:${Math.floor(Math.random() * 45 + 10)} AM`,
  };
});
