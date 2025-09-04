import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

export const metadata: Metadata = {
  title: 'careerLotus AI - Career Counselling Chat',
  description: 'AI-powered career counseling and guidance platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
