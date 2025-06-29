import type { Metadata } from 'next';
import { Geist, Geist_Mono, Baloo_Bhaijaan_2 } from 'next/font/google';
import { Amiri } from 'next/font/google';
import './globals.css';
import ClientLayout from './layout/ClientLayout';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const amiri = Amiri({
  variable: '--font-amiri',
  subsets: ['arabic', 'latin'],
  weight: ['400', '700'],
});

const balooBhaijaan2 = Baloo_Bhaijaan_2({
  variable: '--font-baloo-bhaijaan-2',
  subsets: ['latin'],
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: 'بلدية عيدمون شيخلار',
  description: 'موقع بلدية عيدمون شيخلار الرسمي - خدمات بلدية شاملة للمواطنين',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${geistSans.variable} ${geistMono.variable} ${amiri.variable} ${balooBhaijaan2.variable} antialiased`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
