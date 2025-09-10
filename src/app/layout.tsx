import type { Metadata } from 'next';
import './globals.css';
import type React from 'react';
import { Analytics } from '@vercel/analytics/next';
import { Suspense } from 'react';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { TRPCProvider } from '@/providers/trpc-provider';
import { inter, roboto } from '@/app/fonts';

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
      <body
        className={`font-sans ${inter.variable} ${roboto.variable} bg-background text-foreground min-h-screen font-sans antialiased`}
      >
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
