import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import '../i18n';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Force a re-render after hydration
    document.documentElement.lang = 'ar';
    document.documentElement.dir = 'rtl';
  }, []);

  return <Component {...pageProps} />;
} 