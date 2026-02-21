import type { Metadata } from 'next';
import { Inter, Inter_Tight } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/Sidebar';
import { GlobalSearch } from '@/components/GlobalSearch';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const interTight = Inter_Tight({ subsets: ['latin'], variable: '--font-heading' });

export const metadata: Metadata = {
  title: 'VC Intelligence',
  description: 'AI-driven startup sourcing and enrichment interface',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${interTight.variable} font-sans antialiased text-foreground`}>
        <div className="flex h-screen overflow-hidden bg-background">
          <Sidebar />
          <main className="flex-1 max-h-screen overflow-y-auto">
            {children}
          </main>
        </div>
        <GlobalSearch />
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
