'use client'

import { useEffect } from 'react'
import { trackPurchase } from './MetaPixel'

type Props = {
  orderId: string
  total?: number
}

/**
 * Dispara el evento Purchase de Meta Pixel cuando se monta la página de éxito.
 * Es un Client Component mínimo — solo lógica, sin UI.
 */
export default function PurchaseTracker({ orderId, total = 0 }: Props) {
  useEffect(() => {
    trackPurchase({ value: total, orderId })
  }, [orderId, total])

  return null
}
