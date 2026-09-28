'use client';

import { Search, Bell, Globe, Check, ShieldAlert, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface TopBarProps {
  breadcrumbs: { label: string; href?: string }[];
}

const INDIAN_LANGUAGES = [
  { code: 'hi', name: 'Hindi', native: 'हिंदी' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
];

export default function TopBar({ breadcrumbs }: TopBarProps) {
  const router = useRouter();
  const [globalSearch, setGlobalSearch] = useState('');
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);
  const [activeLang, setActiveLang] = useState('en');

  const langRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setShowLanguages(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && globalSearch.trim()) {
      router.push(`/tenders?q=${encodeURIComponent(globalSearch.trim())}`);
    }
  };

  const handleLanguageSelect = (lang: typeof INDIAN_LANGUAGES[0] | 'en') => {
    const code = typeof lang === 'string' ? lang : lang.code;
    setActiveLang(code);
    setShowLanguages(false);
    
    // Update local storage for our custom React translations
    localStorage.setItem('bhashini_lang', code);
    window.dispatchEvent(new Event('languageChange'));
    
    if (code === 'en') {
      // To reliably revert Google Translate to English, clear the cookie and reload
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=' + window.location.hostname + '; path=/;';
      window.location.reload();
      return;
    }

    // Trigger Google Translate silently for other languages
    const selectField = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (selectField) {
      selectField.value = code;
      selectField.dispatchEvent(new Event('change'));
    } else {
      document.cookie = `googtrans=/en/${code}; path=/`;
      window.location.reload();
    }
  };

  return (
    <header className="topbar">
      <div className="topbar-breadcrumb">
        <Link href="/">Home</Link>
        {breadcrumbs.map((bc, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="separator">›</span>
            {bc.href ? (
              <Link href={bc.href}>{bc.label}</Link>
            ) : (
              <span className="current">{bc.label}</span>
            )}
          </span>
        ))}
      </div>

      <div className="topbar-right" style={{ position: 'relative' }}>
        <div className="topbar-search">
          <Search size={15} color="var(--text-muted)" />
          <input 
            placeholder="Search by Bid ID, Tender Title..." 
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>

        <div className="demo-badge">
          <span className="demo-badge-dot" />
          Demo Mode
        </div>

        {/* Bhashini Multi-Language Toggle */}
        <div ref={langRef} style={{ position: 'relative' }}>
          <button 
            className="btn-ghost btn-sm" 
            style={{ padding: '6px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}
            onClick={() => setShowLanguages(!showLanguages)}
            title="Translate (Bhashini)"
          >
            <Globe size={14} className="text-blue-600" />
            <span>EN / अ</span>
          </button>
          
          {showLanguages && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-2 animate-in slide-in-from-top-2">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 mb-1">
                Select Language
              </div>
              <button
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center justify-between transition-colors"
                onClick={() => handleLanguageSelect('en')}
              >
                <span className="font-medium text-gray-700">English</span>
                {activeLang === 'en' && <Check size={14} className="text-blue-600" />}
              </button>
              {INDIAN_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center justify-between transition-colors"
                  onClick={() => handleLanguageSelect(lang)}
                >
                  <span className="font-medium text-gray-700">{lang.name} <span className="text-gray-400 ml-1 font-normal">({lang.native})</span></span>
                  {activeLang === lang.code && <Check size={14} className="text-blue-600" />}
                </button>
              ))}
              <div className="px-3 py-2 mt-1 border-t border-gray-100 bg-gray-50 text-[10px] text-gray-400 text-center flex items-center justify-center gap-1">
                Powered by Bhashini AI
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button 
            className="btn-ghost btn-sm relative" 
            style={{ padding: '6px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', background: 'transparent', cursor: 'pointer' }}
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={16} color="var(--text-muted)" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-2 animate-in slide-in-from-top-2">
              <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                <span className="font-bold text-gray-800 text-sm">Notifications</span>
                <span className="text-xs text-blue-600 font-medium cursor-pointer hover:underline">Mark all as read</span>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                <div className="px-4 py-3 border-b border-gray-50 hover:bg-gray-50 flex gap-3 items-start cursor-pointer transition-colors">
                  <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ShieldAlert size={14} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">Cartel Detected</div>
                    <div className="text-xs text-gray-600 mt-0.5">High risk anomaly identified in Tender GEM/2026/B/892 based on IP tracking.</div>
                    <div className="text-[10px] text-gray-400 mt-1">2 mins ago</div>
                  </div>
                </div>
                
                <div className="px-4 py-3 border-b border-gray-50 hover:bg-gray-50 flex gap-3 items-start cursor-pointer transition-colors">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <AlertTriangle size={14} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">Compliance Warning</div>
                    <div className="text-xs text-gray-600 mt-0.5">Bidder-17 submitted an expired GSTIN.</div>
                    <div className="text-[10px] text-gray-400 mt-1">15 mins ago</div>
                  </div>
                </div>

                <div className="px-4 py-3 hover:bg-gray-50 flex gap-3 items-start cursor-pointer transition-colors">
                  <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 size={14} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">Scan Complete</div>
                    <div className="text-xs text-gray-600 mt-0.5">Batch processing for 45 bids finished successfully.</div>
                    <div className="text-[10px] text-gray-400 mt-1">1 hour ago</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="topbar-user">
          <div className="topbar-user-info">
            <div className="topbar-user-name">Arvind Kumar</div>
            <div className="topbar-user-role">Procurement Officer</div>
          </div>
          <div className="topbar-avatar">AK</div>
        </div>
      </div>
    </header>
  );
}
