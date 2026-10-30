'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-21491X9G3K';

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

export function GoogleAnalytics() {
  const pathname = usePathname();

  // Exclude admin pages from analytics tracking so internal usage is not tracked
  const isAdmin = pathname ? pathname.startsWith('/admin') : false;

  // Track page views on client-side route transitions
  useEffect(() => {
    if (!isAdmin && typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: pathname,
      });
    }
  }, [pathname, isAdmin]);

  if (isAdmin) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  );
}
