'use client'

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID

declare global {
  interface Window {
    fbq: (...args: unknown[]) => void
    _fbq: unknown
  }
}

// ── Genera un event_id único ───────────────────────────────────────────────
const genEventId = (prefix: string) =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`

// ── Relay browser → CAPI ─────────────────────────────────────────────────
async function relayToCapi(payload: {
  eventName: string
  eventId: string
  eventSourceUrl?: string
  email?: string
  phone?: string
  customData?: Record<string, unknown>
}) {
  try {
    await fetch('/api/meta/event', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    })
  } catch {
    // silencioso — el pixel browser sigue funcionando
  }
}

// ── Eventos públicos ──────────────────────────────────────────────────────

export function trackPurchase(opts: { value: number; orderId: string; email?: string; phone?: string }) {
  if (typeof window === 'undefined' || !window.fbq) return
  const eventId = `purchase_${opts.orderId}` // mismo id que CAPI en el server
  window.fbq('track', 'Purchase', {
    value:        opts.value,
    currency:     'ARS',
    content_ids:  [opts.orderId],
    content_type: 'product',
  }, { eventID: eventId })
  // No relaymamos: el server ya lo manda vía CAPI en payment/route.ts
}

export function trackAddToCart(opts: { name: string; price: number; variantId: string; productId: string }) {
  if (typeof window === 'undefined' || !window.fbq) return
  const eventId = genEventId('atc')
  const customData = {
    content_name:  opts.name,
    content_ids:   [opts.variantId],
    content_type:  'product',
    value:         opts.price,
    currency:      'ARS',
  }
  window.fbq('track', 'AddToCart', customData, { eventID: eventId })
  relayToCapi({
    eventName:      'AddToCart',
    eventId,
    eventSourceUrl: window.location.href,
    customData: {
      currency:     'ARS',
      value:        opts.price,
      content_ids:  [opts.variantId],
      content_type: 'product',
    },
  })
}

export function trackViewContent(opts: { name: string; price: number; productId: string }) {
  if (typeof window === 'undefined' || !window.fbq) return
  const eventId = genEventId('vc')
  const customData = {
    content_name: opts.name,
    content_ids:  [opts.productId],
    content_type: 'product',
    value:        opts.price,
    currency:     'ARS',
  }
  window.fbq('track', 'ViewContent', customData, { eventID: eventId })
  relayToCapi({
    eventName:      'ViewContent',
    eventId,
    eventSourceUrl: window.location.href,
    customData: {
      currency:     'ARS',
      value:        opts.price,
      content_ids:  [opts.productId],
      content_type: 'product',
    },
  })
}

export function trackInitiateCheckout(opts: { value: number; numItems: number }) {
  if (typeof window === 'undefined' || !window.fbq) return
  const eventId = genEventId('ic')
  window.fbq('track', 'InitiateCheckout', {
    value:     opts.value,
    currency:  'ARS',
    num_items: opts.numItems,
  }, { eventID: eventId })
  relayToCapi({
    eventName:      'InitiateCheckout',
    eventId,
    eventSourceUrl: window.location.href,
    customData: {
      currency:  'ARS',
      value:     opts.value,
      num_items: opts.numItems,
    },
  })
}

// ── PageView tracker reactivo a cambios de ruta ────────────────────────────
function PageViewTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!window.fbq) return
    const eventId = genEventId('pv')
    window.fbq('track', 'PageView', {}, { eventID: eventId })
    relayToCapi({
      eventName:      'PageView',
      eventId,
      eventSourceUrl: window.location.href,
    })
  }, [pathname, searchParams])

  return null
}

// ── Componente principal ──────────────────────────────────────────────────
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
