'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Search,
  FileText,
  ClipboardCheck,
  Shield,
  ScrollText,
  Upload,
  CloudDownload,
  Settings,
  BarChart3,
  AlertTriangle,
  Database,
  Users,
} from 'lucide-react';

const navSections = [
  {
    label: 'Overview',
    items: [
      { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Procurement',
    items: [
      { href: '/tenders', label: 'Tender Explorer', icon: Search },
      { href: '/decisions', label: 'Reviewed Bids', icon: Users },
      { href: '/import', label: 'Import Tender Data', icon: CloudDownload },
    ],
  },
  {
    label: 'Compliance',
    items: [
      { href: '/compliance', label: 'Compliance Engine', icon: ClipboardCheck },
      { href: '/verifications', label: 'Verifications', icon: Shield },
      { href: '/risk', label: 'Risk & Analytics', icon: BarChart3 },
      { href: '/exceptions', label: 'Exceptions', icon: AlertTriangle },
    ],
  },
  {
    label: 'System',
    items: [
      { href: '/audit', label: 'Audit Trail', icon: ScrollText },
      { href: '/integrations', label: 'Data & Integrations', icon: Database },
      { href: '/settings', label: 'Settings', icon: Settings },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">
          <Shield size={22} color="#0a1628" strokeWidth={2.5} />
        </div>
        <div className="sidebar-brand-text">
          <h1>GeM BidTrust</h1>
          <span>AI Compliance Platform</span>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '8px 0' }}>
        {navSections.map((section) => (
          <div className="sidebar-section" key={section.label}>
            <div className="sidebar-section-label">{section.label}</div>
            <ul className="sidebar-nav">
              {section.items.map((item) => {
                const isActive =
                  item.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`sidebar-item ${isActive ? 'active' : ''}`}
                    >
                      <item.icon size={18} className="sidebar-item-icon" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-footer-badge">
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#f59e0b' }} />
          Prototype Mode
        </div>
        <div className="sidebar-footer-version">
          GeM BidTrust v1.0.0 · SIH 2026
        </div>
      </div>
    </aside>
  );
}
