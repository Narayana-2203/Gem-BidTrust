import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import CopilotDrawer from "@/components/CopilotDrawer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "GeM BidTrust — AI-Powered Bid Compliance Verification",
  description: "AI-Powered Integrated Bid Compliance Verification Platform for Government e-Marketplace (GeM) Procurement. Automating bidder verification across Udyam, GSTN, PAN, EPFO, ESIC, Make in India and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light" />
        <meta name="darkreader-lock" content="true" />
      </head>
      <body suppressHydrationWarning>
        <div id="google_translate_element" style={{ display: 'none' }}></div>
        <Script id="google-translate-init" strategy="beforeInteractive">
          {`
            function googleTranslateElementInit() {
              new window.google.translate.TranslateElement({
                pageLanguage: 'en', 
                includedLanguages: 'hi,bn,te,mr,ta,gu',
                autoDisplay: false
              }, 'google_translate_element');
            }
          `}
        </Script>
        <Script src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" strategy="beforeInteractive" />

        {/* Indian tri-color accent strip */}
        <div className="tricolor-strip" />

        <div className="app-layout">
          <Sidebar />
          <main className="main-content">
            {children}

            {/* Footer */}
            <footer className="app-footer">
              <div className="footer-left">
                <span>Built for <strong>Atmanirbhar Bharat</strong></span>
                <Link href="/policies">Legal & Compliance Policies</Link>
                <Link href="/policies">Data Privacy & Security</Link>
              </div>
              <div className="footer-right">
                <span className="footer-status-dot" />
                All Systems (Demo)
                <span style={{ margin: '0 8px', color: 'var(--border-medium)' }}>·</span>
                <span>Last Updated: 22 Apr 2026, 14:32 IST</span>
              </div>
            </footer>
          </main>
          <CopilotDrawer />
        </div>
      </body>
    </html>
  );
}
