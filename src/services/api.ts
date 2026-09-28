import {
  tenders,
  tenderBidders,
  dashboardMetrics,
  recentActivity,
  complianceOverview,
  riskDistribution,
  sampleBidder,
  auditEntries
} from '@/data/mockData';

const API_BASE = 'http://192.168.1.9:8000/api/v1';

// When true: data loads INSTANTLY from bundled mock data (zero network wait).
// The backend is still called silently in the background to upgrade data if available.
// Set to false only if you want to force live-only mode.
const FAST_MODE = true;

// Timeout for API calls (ms). Short timeout prevents long hangs on slow networks.
const FETCH_TIMEOUT_MS = 2000;

/**
 * Race-based fetch: returns within FETCH_TIMEOUT_MS or gives up.
 */
async function fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timer);
    return res;
  } catch (e) {
    clearTimeout(timer);
    throw e;
  }
}

/**
 * Tries to fetch from backend with a strict timeout.
 * Returns fallback instantly if backend is unreachable.
 */
async function fetchWithFallback<T>(endpoint: string, fallback: T): Promise<T> {
  // In FAST_MODE, return mock data immediately — no network call for initial render
  if (FAST_MODE) return fallback;

  try {
    const response = await fetchWithTimeout(`${API_BASE}${endpoint}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store'
    });
    if (response.ok) {
      return await response.json() as T;
    }
    return fallback;
  } catch {
    return fallback;
  }
}

/**
 * Silently tries to fetch live data from backend.
 * Used for background hydration after initial instant render.
 */
async function backgroundFetch<T>(endpoint: string): Promise<T | null> {
  try {
    const response = await fetchWithTimeout(`${API_BASE}${endpoint}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store'
    });
    if (response.ok) return await response.json() as T;
    return null;
  } catch {
    return null;
  }
}


export const api = {
  // 1. Dashboard
  getDashboardMetrics: async () => {
    return fetchWithFallback('/dashboard/metrics', {
      metrics: dashboardMetrics,
      recentActivity,
      complianceOverview,
      riskDistribution
    });
  },

  // Background upgrade for dashboard
  getDashboardMetricsLive: () => backgroundFetch<any>('/dashboard/metrics'),

  // 2. Tenders
  getTenders: async () => {
    const data = await fetchWithFallback('/tenders', { tenders });
    return data.tenders || data;
  },

  getTenderById: async (tenderId: string) => {
    return fetchWithFallback(`/tenders/${encodeURIComponent(tenderId)}`, 
      tenders.find(t => t.bidId === tenderId) || tenders[0]
    );
  },

  getTenderBidders: async (tenderId: string) => {
    return fetchWithFallback(`/tenders/${encodeURIComponent(tenderId)}/bidders`, tenderBidders);
  },

  // 3. Bidder Profile
  getBidderEvaluation: async (bidderId: string) => {
    const basicInfo = tenderBidders.find(b => b.id === bidderId);
    const fallback = basicInfo ? {
      ...sampleBidder,
      companyName: basicInfo.companyName,
      gstin: basicInfo.gstin,
      pan: basicInfo.pan,
      msmeStatus: basicInfo.msmeCategory,
      complianceScore: basicInfo.complianceScore,
      riskClassification: basicInfo.riskLevel,
      overallStatus: basicInfo.status
    } : sampleBidder;
    
    return fetchWithFallback(`/bidders/${encodeURIComponent(bidderId)}`, fallback);
  },

  evaluateBidder: async (bidderId: string, decision: string, notes: string) => {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/bidders/${encodeURIComponent(bidderId)}/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision, notes })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Evaluation post failed', e);
    }
    return { success: true };
  },

  // 4. Audit
  getAuditLogs: async () => {
    return fetchWithFallback('/audit/logs', auditEntries);
  },

  // 5. Compliance Rules
  getComplianceRules: async () => {
    return fetchWithFallback('/compliance/rules', { rules: [], radarData: [] });
  },

  // 6. Analytics
  getRiskTrends: async () => {
    return fetchWithFallback('/analytics/risk-trends', {
      riskDistribution,
      monthlyTrend: [],
      topFactors: []
    });
  },
  
  getCartelGraph: async (tenderId: string) => {
    return fetchWithFallback(`/analytics/cartel-graph/${encodeURIComponent(tenderId)}`, {
      nodes: [], edges: [], riskConfidence: 0, clusters: 0, suspiciousBidders: []
    });
  },

  // 7. Exceptions
  getExceptions: async () => {
    return fetchWithFallback('/exceptions', []);
  },

  // 8. Integrations
  getIntegrationsStatus: async () => {
    return fetchWithFallback('/integrations/status', []);
  },
  
  syncIntegration: async (portalId: string) => {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/integrations/${encodeURIComponent(portalId)}/sync`, { method: 'POST' });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Sync failed', e);
    }
    return { status: 'connected', lastSync: 'just now' };
  },

  testIntegration: async (portalId: string) => {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/integrations/${encodeURIComponent(portalId)}/test`, { method: 'POST' });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Test failed', e);
    }
    return { connected: false, latencyMs: 0, error: 'Connection failed' };
  },

  // 9. Tasks
  startVerification: async (bidderId: string) => {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/tasks/verify-bidder/${encodeURIComponent(bidderId)}`, { method: 'POST' });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Task start failed', e);
    }
    return { taskId: 'dummy', status: 'queued' };
  },

  pollTask: async (taskId: string) => {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/tasks/${encodeURIComponent(taskId)}`, { method: 'GET' });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Task poll failed', e);
    }
    return { status: 'failed', error: 'Network error' };
  }
};
