import type { Metadata } from 'next';
import { Geist, Geist_Mono, Baloo_Bhaijaan_2 } from 'next/font/google';
import { Amiri } from 'next/font/google';
import './globals.css';
import ClientLayout from './layout/ClientLayout';
import { themeBootstrapScript } from '@/packages/common/utils/theme.utils';

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

// 'i18nextLng' = LANGUAGE_STORAGE_KEY in src/i18n.ts (not imported: that module is client-side).
const languageBootstrapScript = `try{var l=localStorage.getItem('i18nextLng');if(l&&l.indexOf('en')===0){document.documentElement.lang='en';document.documentElement.dir='ltr';}}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // The server always renders Arabic/RTL; the inline script switches lang/dir before first paint when the
    // visitor chose English (i18next caches the choice in localStorage), so there is no RTL→LTR flash.
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: languageBootstrapScript }} />
        {/* Light/dark: sets the `dark` class on <html> before paint (no flash) and follows OS changes on "system". */}
        <script dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} />
        <meta
          name="keywords"
          content="بلدية عيدمون شيخلار, عيدمون شيخلار, بلدية عيدمون, شيخلار, خدمات بلدية عيدمون, بلدية شيخلار الرسمية, خدمات المواطنين في عيدمون, بلدية عيدمون شيخلار الرسمية, خدمات بلدية عيدمون شيخلار, municipality services, Aydamoun Cheikh Lahr,  Aydamoun municipality, Cheikh Lahr municipality"
        />
        <meta name="google-site-verification" content="jbv3hYwCYoalgc0zsI2HwrSuGi3H9g_cbpvjHQDawVE" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${amiri.variable} ${balooBhaijaan2.variable} antialiased`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
