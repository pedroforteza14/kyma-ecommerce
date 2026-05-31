import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Cambios y devoluciones | KYMA',
  description: 'Política de cambios y devoluciones de KYMA. Cambios dentro de los 10 días de recibido el pedido.',
}

const SECTIONS = [
  {
    num: '01',
    title: '¿Cuándo puedo cambiar una prenda?',
    body: 'Aceptamos cambios dentro de los 10 días corridos desde la recepción del pedido, siempre que la prenda esté en perfectas condiciones: sin uso, sin lavar, con etiquetas originales y en su packaging original.',
  },
  {
    num: '02',
    title: '¿Cómo inicio un cambio?',
    steps: [
      'Escribinos por Instagram @kymaba o por WhatsApp.',
      'Indicá tu número de pedido y el motivo del cambio.',
      'Te confirmamos la disponibilidad del nuevo talle o producto.',
      'Coordinamos el envío de devolución y el despacho del cambio.',
    ],
  },
  {
    num: '03',
    title: 'Costo del cambio',
    body: 'El costo de envío de devolución está a cargo de la compradora. El nuevo despacho tiene el mismo costo que el envío original.',
  },
  {
    num: '04',
    title: 'Devolución de dinero',
    body: 'Realizamos devoluciones en los siguientes casos: producto con defecto de fábrica o error en el envío de nuestra parte. En ese caso, el costo de devolución está a nuestro cargo y el reintegro se procesa dentro de los 5 días hábiles.',
  },
  {
    num: '05',
    title: 'Prendas sin cambio',
    body: 'No aceptamos cambios en prendas de la sección SALE, ropa interior ni accesorios por razones de higiene.',
  },
]

export default function CambiosPage() {
  return (
    <div>
      {/* Header */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          {/* Breadcrumb */}
          <div className="py-4 flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-gray-400">
            <Link href="/" className="hover:text-[#111] transition-colors">Inicio</Link>
            <span>/</span>
            <span className="text-[#111]">Cambios y devoluciones</span>
          </div>

          {/* Título */}
          <div className="pb-10">
            <p className="text-[9px] tracking-[0.5em] uppercase text-gray-400 mb-3">Políticas</p>
            <h1
              className="font-display font-light leading-none"
              style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)', letterSpacing: '0.05em' }}
            >
              Cambios &<br />devoluciones
            </h1>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-20 space-y-0">
        {SECTIONS.map((s, i) => (
          <div
            key={s.num}
            className={`flex gap-8 sm:gap-14 py-10 ${i < SECTIONS.length - 1 ? 'border-b border-gray-100' : ''}`}
            data-reveal
            data-delay={i * 60}
          >
            {/* Número */}
            <span className="font-display text-4xl font-light text-gray-200 flex-shrink-0 leading-none mt-1">
              {s.num}
            </span>

            {/* Texto */}
            <div className="space-y-4">
              <h2 className="font-display text-xl font-light">{s.title}</h2>
              {s.body && (
                <p className="text-[13px] leading-relaxed text-gray-500">{s.body}</p>
              )}
              {s.steps && (
                <ol className="space-y-2">
                  {s.steps.map((step, j) => (
                    <li key={j} className="flex gap-3 text-[13px] text-gray-500 leading-relaxed">
                      <span className="text-[10px] tracking-[0.2em] text-gray-300 flex-shrink-0 mt-1">{j + 1}.</span>
                      {step}
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="border-t border-gray-100 bg-[#f7f6f2]">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-16 text-center" data-reveal>
          <p className="text-[9px] tracking-[0.5em] uppercase text-gray-400 mb-4">¿Dudas?</p>
          <p className="font-display text-2xl font-light mb-6">
            Escribinos y te respondemos a la brevedad
          </p>
          <a
            href="https://instagram.com/kymaba"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border border-[#111] text-[#111] px-10 py-3.5 text-[11px] tracking-[0.3em] uppercase hover:bg-[#111] hover:text-white transition-all duration-300"
          >
            @kymaba en Instagram
          </a>
        </div>
      </div>
    </div>
  )
}
