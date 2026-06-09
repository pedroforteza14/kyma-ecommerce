'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader2 } from 'lucide-react'

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    MercadoPago: any
  }
}

type Props = {
  preferenceId: string
  amount: number
  orderId: string
  payer: {
    firstName: string
    lastName: string
    email: string
  }
  total: number
  onSuccess: (orderId: string, total: number) => void
  onPending: (orderId: string) => void
  onError: (msg: string) => void
}

export default function PaymentBrick({
  preferenceId,
  amount,
  orderId,
  payer,
  total,
  onSuccess,
  onPending,
  onError,
}: Props) {
  const brickRef = useRef<any>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let mounted = true

    const initBrick = async () => {
      const publicKey = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY
      if (!publicKey) return

      try {
        const mp = new window.MercadoPago(publicKey, { locale: 'es-AR' })
        const bricksBuilder = mp.bricks()

        if (brickRef.current) {
          await brickRef.current.unmount()
        }

        brickRef.current = await bricksBuilder.create(
          'payment',
          'payment-brick-container',
          {
            initialization: {
              amount,
              preferenceId,
              payer: {
                firstName: payer.firstName,
                lastName: payer.lastName,
                email: payer.email,
              },
            },
            customization: {
              paymentMethods: {
                creditCard: 'all',
                debitCard: 'all',
                ticket: 'all',
                bankTransfer: 'all',
                mercadoPago: 'all',
              },
            },
            callbacks: {
              onReady: () => {
                if (mounted) setReady(true)
              },
              onSubmit: async ({ formData }: { formData: any }) => {
                try {
                  const res = await fetch('/api/payment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ orderId, formData }),
                  })
                  const data = await res.json()

                  if (!res.ok) {
                    onError(data.error || 'Hubo un error procesando el pago.')
                    return
                  }

                  if (data.status === 'approved') {
                    onSuccess(orderId, total)
                  } else if (data.status === 'in_process' || data.status === 'pending') {
                    onPending(orderId)
                  } else {
                    onError('El pago fue rechazado. Verificá los datos de tu tarjeta e intentá de nuevo.')
                  }
                } catch {
                  onError('Hubo un error de conexión. Intentá de nuevo.')
                }
              },
              onError: (err: any) => {
                console.error('MP Brick error:', err)
              },
            },
          },
        )
      } catch (err) {
        console.error('Error initializing brick:', err)
        if (mounted) onError('No se pudo cargar el formulario de pago. Recargá la página.')
      }
    }

    const loadAndInit = () => {
      if (window.MercadoPago) {
        initBrick()
      } else {
        const existing = document.querySelector('script[src*="sdk.mercadopago.com"]')
        if (existing) {
          existing.addEventListener('load', initBrick)
        } else {
          const script = document.createElement('script')
          script.src = 'https://sdk.mercadopago.com/js/v2'
          script.async = true
          script.onload = initBrick
          document.head.appendChild(script)
        }
      }
    }

    loadAndInit()

    return () => {
      mounted = false
      brickRef.current?.unmount?.()
    }
  }, [preferenceId, amount, orderId]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="relative min-h-[300px]">
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 size={20} className="animate-spin text-gray-400" />
        </div>
      )}
      <div id="payment-brick-container" className={ready ? '' : 'opacity-0'} />
    </div>
  )
}
