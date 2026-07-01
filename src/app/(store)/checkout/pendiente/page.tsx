import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

const fmt = (n: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n)

type Props = {
  searchParams: Promise<{ order?: string; ticket?: string; total?: string }>
}

export default async function PendingPage({ searchParams }: Props) {
  const { order, ticket, total } = await searchParams
  const isCash        = !!ticket
  const isTransfer    = !isCash && !!total
  const transferTotal = total ? Number(total) : null

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-5">
      <div className="max-w-lg w-full text-center space-y-8 py-20">

        {/* Ícono */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full border border-gray-200 flex items-center justify-center">
            {isCash ? (
              /* Ícono billete/efectivo */
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-gray-400">
                <rect x="2" y="6" width="20" height="12" rx="2" />
                <circle cx="12" cy="12" r="3" />
                <path d="M6 12h.01M18 12h.01" />
              </svg>
            ) : (
              /* Ícono reloj */
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-gray-400">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            )}
          </div>
        </div>

        {/* Texto principal */}
        <div className="space-y-3">
          <p className="text-[9px] tracking-[0.5em] uppercase text-gray-400">
            {isCash ? 'Pago en efectivo' : 'Pago en proceso'}
          </p>
          <h1 className="font-display text-4xl font-light leading-tight">
            {isCash ? (
              <>Tu código<br /><em>de pago</em></>
            ) : (
              <>Verificando<br /><em>tu pago</em></>
            )}
          </h1>
          <p className="text-[13px] leading-relaxed text-gray-500 max-w-sm mx-auto">
            {isCash
              ? 'Usá el código de abajo para pagar en cualquier sucursal de Pago Fácil o Rapipago. Tu pedido se confirma automáticamente al acreditar.'
              : 'Tu pago está siendo verificado. Te avisamos por email cuando esté confirmado.'
            }
          </p>
        </div>

        {/* Número de pedido */}
        {order && (
          <p className="text-[10px] tracking-[0.3em] uppercase text-gray-300">
            Pedido #{order.slice(0, 8).toUpperCase()}
          </p>
        )}

        {/* Bloque de efectivo */}
        {isCash && ticket && (
          <div className="space-y-4">
            {/* Botón principal — ir al ticket */}
            <a
              href={ticket}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full h-14 bg-[#111] text-white text-[11px] tracking-[0.4em] uppercase hover:bg-black/80 transition-all duration-300"
            >
              <ExternalLink size={14} strokeWidth={1.5} />
              Ver código de pago
            </a>

            {/* Info adicional */}
            <div className="text-left border border-gray-100 bg-[#fafaf8] p-5 space-y-2.5 text-[12px]">
              <p className="text-[10px] tracking-[0.35em] uppercase text-gray-400 mb-3">Dónde pagar</p>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0" />
                <span className="text-gray-600">Pago Fácil · Rapipago (cualquier sucursal)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0" />
                <span className="text-gray-600">Mostrá el código en pantalla o imprimilo</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0" />
                <span className="text-gray-600">También te enviamos el link por email</span>
              </div>
            </div>
          </div>
        )}

        {/* Bloque de transferencia bancaria (solo si no es efectivo) */}
        {!isCash && (
          <div className="text-left border border-gray-100 bg-[#fafaf8] p-6 space-y-4">
            {isTransfer && transferTotal && (
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="space-y-0.5">
                  <p className="text-[9px] tracking-[0.4em] uppercase text-green-600 font-medium">15% descuento aplicado</p>
                  <p className="text-[12px] text-gray-500 tracking-wide">Total a transferir</p>
                </div>
                <p className="text-2xl font-light text-green-700">{fmt(transferTotal)}</p>
              </div>
            )}
            <div className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400 flex-shrink-0">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
              <p className="text-[10px] tracking-[0.35em] uppercase text-gray-400">
                También podés pagar por transferencia
              </p>
            </div>

            <div className="space-y-2.5 text-[12px]">
              <div className="flex justify-between">
                <span className="text-gray-400 tracking-wide">Banco</span>
                <span className="text-[#111] font-medium">Banco Galicia</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 tracking-wide">CBU</span>
                <span className="text-[#111] font-mono tracking-wider">0070999020000012345678</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 tracking-wide">Alias</span>
                <span className="text-[#111] font-medium tracking-wide">KYMA.MODA.BA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 tracking-wide">Titular</span>
                <span className="text-[#111] font-medium">KYMA Buenos Aires</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 tracking-wide">CUIT</span>
                <span className="text-[#111] font-mono">30-12345678-9</span>
              </div>
            </div>

            <p className="text-[11px] text-gray-400 leading-relaxed pt-1 border-t border-gray-100">
              Envianos el comprobante por{' '}
              <a
                href="https://wa.me/5491132587946"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#111] underline underline-offset-2"
              >
                WhatsApp
              </a>
              {' '}o a{' '}
              <a href="mailto:hola@kyma.com.ar" className="text-[#111] underline underline-offset-2">
                hola@kyma.com.ar
              </a>
            </p>
          </div>
        )}

        {/* CTA */}
        <Link
          href="/"
          className="inline-block border border-[#111] text-[#111] px-12 py-4 text-[11px] tracking-[0.35em] uppercase hover:bg-[#111] hover:text-white transition-all duration-300"
        >
          Ir al inicio
        </Link>

      </div>
    </div>
  )
}
