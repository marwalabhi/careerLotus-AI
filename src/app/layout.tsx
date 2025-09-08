import type { Metadata } from 'next';
import { Inter, Roboto } from 'next/font/google';
import './globals.css';
import type React from 'react';
import { Analytics } from '@vercel/analytics/next';
import { Suspense } from 'react';
import './globals.css';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { TRPCProvider } from '@/providers/trpc-provider';
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const roboto = Roboto({ subsets: ['latin'], variable: '--font-roboto' });

export const metadata: Metadata = {
  title: 'CareerLotus AI - Career Counselling Chat',
  description: 'AI-powered career counseling and guidance platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${inter.variable} ${roboto.variable} antialiased`}>
        <TRPCProvider>
          <Suspense fallback={null}>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </Suspense>
        </TRPCProvider>

        <Analytics />
      </body>
    </html>
  );
}
