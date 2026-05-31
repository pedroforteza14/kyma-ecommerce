'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Minus } from 'lucide-react'

const FAQS = [
  {
    q: '¿Cuánto tarda el envío?',
    a: 'Los envíos a AMBA llegan en 2–4 días hábiles. Al interior del país entre 5–8 días hábiles. Una vez despachado, te enviamos el número de seguimiento por email.',
  },
  {
    q: '¿Cómo sé mi talle?',
    a: 'Podés consultarnos por Instagram o WhatsApp y te asesoramos según la prenda. También tenemos una guía de talles detallada disponible en la página de cada producto.',
  },
  {
    q: '¿Puedo pagar en cuotas?',
    a: 'Sí, a través de MercadoPago podés pagar con tarjeta de crédito en cuotas. Las opciones disponibles dependen de tu banco y tarjeta.',
  },
  {
    q: '¿Hacen envíos al exterior?',
    a: 'Por ahora solo enviamos dentro de Argentina. Seguinos en Instagram para enterarte cuando lo habilitemos.',
  },
  {
    q: '¿Qué hago si mi pedido llegó con un problema?',
    a: 'Escribinos por WhatsApp o Instagram dentro de las 48 horas de recibido con foto del problema. Lo resolvemos sin vueltas.',
  },
  {
    q: '¿Tienen local físico?',
    a: 'Somos una tienda 100% online. Pero si sos de Buenos Aires, podés coordinar un encuentro para retirar tu pedido y ahorrarte el envío.',
  },
  {
    q: '¿Cómo me entero de los lanzamientos y novedades?',
    a: 'Seguinos en Instagram @kymaba — ahí publicamos primero todos los drops, preventa y promociones exclusivas.',
  },
  {
    q: '¿Puedo cambiar o devolver una prenda?',
    a: 'Sí, aceptamos cambios dentro de los 10 días corridos de recibido el pedido, siempre que la prenda esté en perfectas condiciones con etiquetas. Consultá nuestra política completa de cambios.',
  },
]

function FaqItem({ q, a, isOpen, onToggle }: { q: string; a: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-gray-100">
      <button
        className="w-full flex items-center justify-between py-6 text-left gap-6 group"
        onClick={onToggle}
      >
        <span className="font-display text-lg font-light group-hover:opacity-60 transition-opacity">
          {q}
        </span>
        <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-gray-400">
          {isOpen
            ? <Minus size={14} strokeWidth={1.5} />
            : <Plus size={14} strokeWidth={1.5} />
          }
        </span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-400 ease-in-out ${
          isOpen ? 'max-h-40 pb-6' : 'max-h-0'
        }`}
      >
        <p className="text-[13px] leading-relaxed text-gray-500 pr-8">{a}</p>
      </div>
    </div>
  )
}

export default function FaqPage() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div>
      {/* Header */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="py-4 flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-gray-400">
            <Link href="/" className="hover:text-[#111] transition-colors">Inicio</Link>
            <span>/</span>
            <span className="text-[#111]">Preguntas frecuentes</span>
          </div>

          <div className="pb-10">
            <p className="text-[9px] tracking-[0.5em] uppercase text-gray-400 mb-3">Ayuda</p>
            <h1
              className="font-display font-light leading-none"
              style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)', letterSpacing: '0.05em' }}
            >
              Preguntas<br />
              <em>frecuentes</em>
            </h1>
          </div>
        </div>
      </div>

      {/* Acordeón */}
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-16">
        {FAQS.map((faq, i) => (
          <FaqItem
            key={i}
            q={faq.q}
            a={faq.a}
            isOpen={open === i}
            onToggle={() => setOpen(open === i ? null : i)}
          />
        ))}
      </div>

      {/* CTA */}
      <div className="border-t border-gray-100 bg-[#f7f6f2]">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-16 text-center">
          <p className="text-[9px] tracking-[0.5em] uppercase text-gray-400 mb-4">¿No encontraste tu respuesta?</p>
          <p className="font-display text-2xl font-light mb-6">Escribinos, te respondemos rápido</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="https://instagram.com/kymaba"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border border-[#111] text-[#111] px-10 py-3.5 text-[11px] tracking-[0.3em] uppercase hover:bg-[#111] hover:text-white transition-all duration-300"
            >
              Instagram
            </a>
            <Link
              href="/cambios"
              className="inline-block text-[11px] tracking-[0.3em] uppercase text-gray-400 hover:text-[#111] transition-colors link-underline pb-0.5"
            >
              Política de cambios
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
