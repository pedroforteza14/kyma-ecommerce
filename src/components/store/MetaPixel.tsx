'use client'

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID

// fbq helper con tipos
declare global {
  interface Window {
    fbq: (...args: unknown[]) => void
    _fbq: unknown
  }
}

export function trackPurchase(opts: { value: number; orderId: string }) {
  if (typeof window === 'undefined' || !window.fbq) return
  window.fbq('track', 'Purchase', {
    value: opts.value,
    currency: 'ARS',
    content_ids: [opts.orderId],
    content_type: 'product',
  })
}

export function trackAddToCart(opts: { name: string; price: number; variantId: string }) {
  if (typeof window === 'undefined' || !window.fbq) return
  window.fbq('track', 'AddToCart', {
    content_name: opts.name,
    content_ids: [opts.variantId],
    content_type: 'product',
    value: opts.price,
    currency: 'ARS',
  })
}

export function trackViewContent(opts: { name: string; price: number; productId: string }) {
  if (typeof window === 'undefined' || !window.fbq) return
  window.fbq('track', 'ViewContent', {
    content_name: opts.name,
    content_ids: [opts.productId],
    content_type: 'product',
    value: opts.price,
    currency: 'ARS',
  })
}

// PageView tracker reactivo a cambios de ruta
function PageViewTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!window.fbq) return
    window.fbq('track', 'PageView')
  }, [pathname, searchParams])

  return null
}

// Componente principal — no renderiza nada si no hay PIXEL_ID
export default function MetaPixel() {
  if (!PIXEL_ID) return null

  return (
    <>
      <Script
        id="meta-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${PIXEL_ID}');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
    </>
  )
}
