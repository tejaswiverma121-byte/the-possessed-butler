import type { Metadata, Viewport } from 'next';
import '../index.css';
import { SentinelProvider } from '../context/SentinelContext';
import { SentinelAppShell } from '../components/layout/SentinelAppShell';

export const metadata: Metadata = {
  title: 'The Possessed Butler — AI Security & Prompt Injection Defense',
  description: 'Every Butler Has a Secret. Yours Has an AI. Test your autonomous AI agent against prompt injection, adversarial manipulation, and secret exfiltration in a sovereign Victorian estate.',
  icons: {
    icon: '/halloween/cyber_pumpkin_mascot.jpg',
  },
};

export const viewport: Viewport = {
  themeColor: '#09080B',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800;900&family=Cinzel+Decorative:wght@700;900&family=JetBrains+Mono:wght@400;500;700&family=Outfit:wght@400;600;700;800;900&family=Playfair+Display:ital,wght@0,600;0,700;0,900;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="bg-[#09080B] text-[#E8E0D5] font-sans min-h-screen overflow-x-hidden antialiased selection:bg-[#9E2638] selection:text-[#F3D9A4]">
        <SentinelProvider>
          <SentinelAppShell>
            {children}
          </SentinelAppShell>
        </SentinelProvider>
      </body>
    </html>
  );
}
