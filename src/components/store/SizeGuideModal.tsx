'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

type Props = { isOpen: boolean; onClose: () => void }

const TOPS = [
  { talle: 'Único', busto: '84–96', cintura: '66–78', cadera: '92–104', equiv: 'S a L' },
]

const BOTTOMS = [
  { talle: '36', cintura: '66–70', cadera: '92–96',   largo: '95' },
  { talle: '38', cintura: '70–74', cadera: '96–100',  largo: '96' },
  { talle: '40', cintura: '74–78', cadera: '100–104', largo: '97' },
  { talle: '42', cintura: '78–82', cadera: '104–108', largo: '98' },
]

const SHORTS = [
  { talle: 'S/M', cintura: '66–74', cadera: '92–100' },
  { talle: 'L/XL', cintura: '74–82', cadera: '100–108' },
]

type Tab = 'tops' | 'bottoms' | 'shorts'

export default function SizeGuideModal({ isOpen, onClose }: Props) {
  const [tab, setTab] = useState<Tab>('tops')

  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const tabs: { key: Tab; label: string }[] = [
    { key: 'tops', label: 'Remeras & Tops' },
    { key: 'bottoms', label: 'Denim & Shorts' },
    { key: 'shorts', label: 'Short Encaje' },
  ]

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-50 animate-fade-in"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-5 pointer-events-none">
        <div className="bg-white w-full max-w-lg pointer-events-auto shadow-2xl max-h-[90vh] overflow-y-auto">

          <div className="flex items-center justify-between px-7 py-6 border-b border-gray-100">
            <div>
              <p className="text-[9px] tracking-[0.45em] uppercase text-gray-400 mb-1">Medidas</p>
              <h2 className="font-display text-2xl font-light">Guía de talles</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors"
              aria-label="Cerrar"
            >
              <X size={18} strokeWidth={1.5} />
            </button>
          </div>

          <div className="flex gap-1 px-7 pt-5 pb-2">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase transition-colors rounded-md ${
                  tab === t.key
                    ? 'bg-[#111] text-white'
                    : 'text-gray-400 hover:text-[#111] hover:bg-gray-50'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="px-7 py-5 overflow-x-auto">
            {tab === 'tops' && (
              <>
                <p className="text-[11px] text-gray-500 mb-4 leading-relaxed">
                  Nuestras remeras, musculosas, poleras y tops son <strong>talle único</strong> — super elastizadas,
                  abarcan de un talle S a un L cómodamente.
                </p>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      {['Talle', 'Busto (cm)', 'Cintura (cm)', 'Cadera (cm)', 'Equivale'].map((h) => (
                        <th key={h} className="text-left pb-3 pr-4 text-[9px] tracking-[0.3em] uppercase text-gray-400 font-normal">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {TOPS.map((row) => (
                      <tr key={row.talle} className="border-b border-gray-50">
                        <td className="py-3 pr-4 text-[12px] tracking-[0.15em] uppercase font-medium">{row.talle}</td>
                        <td className="py-3 pr-4 text-[12px] text-gray-500">{row.busto}</td>
                        <td className="py-3 pr-4 text-[12px] text-gray-500">{row.cintura}</td>
                        <td className="py-3 pr-4 text-[12px] text-gray-500">{row.cadera}</td>
                        <td className="py-3 pr-4 text-[12px] text-gray-400 italic">{row.equiv}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {tab === 'bottoms' && (
              <>
                <p className="text-[11px] text-gray-500 mb-4 leading-relaxed">
                  Para shorts y denim, elegí tu talle habitual. Si buscás un calce más suelto (como en las fotos),
                  pedí <strong>un talle más</strong> del que usás normalmente.
                </p>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      {['Talle', 'Cintura (cm)', 'Cadera (cm)', 'Largo (cm)'].map((h) => (
                        <th key={h} className="text-left pb-3 pr-4 text-[9px] tracking-[0.3em] uppercase text-gray-400 font-normal">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {BOTTOMS.map((row, i) => (
                      <tr key={row.talle} className={`border-b border-gray-50 ${i % 2 === 0 ? '' : 'bg-[#fafafa]'}`}>
                        <td className="py-3 pr-4 text-[12px] tracking-[0.15em] uppercase font-medium">{row.talle}</td>
                        <td className="py-3 pr-4 text-[12px] text-gray-500">{row.cintura}</td>
                        <td className="py-3 pr-4 text-[12px] text-gray-500">{row.cadera}</td>
                        <td className="py-3 pr-4 text-[12px] text-gray-500">{row.largo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {tab === 'shorts' && (
              <>
                <p className="text-[11px] text-gray-500 mb-4 leading-relaxed">
                  Los shorts de encaje vienen en <strong>dos rangos de talle</strong>: S/M y L/XL.
                </p>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      {['Talle', 'Cintura (cm)', 'Cadera (cm)'].map((h) => (
                        <th key={h} className="text-left pb-3 pr-4 text-[9px] tracking-[0.3em] uppercase text-gray-400 font-normal">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {SHORTS.map((row, i) => (
                      <tr key={row.talle} className={`border-b border-gray-50 ${i % 2 === 0 ? '' : 'bg-[#fafafa]'}`}>
                        <td className="py-3 pr-4 text-[12px] tracking-[0.15em] uppercase font-medium">{row.talle}</td>
                        <td className="py-3 pr-4 text-[12px] text-gray-500">{row.cintura}</td>
                        <td className="py-3 pr-4 text-[12px] text-gray-500">{row.cadera}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>

          <div className="px-7 pb-7 border-t border-gray-100 pt-5 space-y-2">
            <p className="text-[9px] tracking-[0.3em] uppercase text-gray-400 mb-3">Cómo medirse</p>
            {[
              ['Cintura', 'Medí en la parte más angosta del torso.'],
              ['Cadera', 'Pasá la cinta por la parte más ancha de la cadera.'],
              ['Busto', 'Pasá la cinta por la parte más ancha del pecho.'],
            ].map(([label, tip]) => (
              <p key={label} className="text-[11px] text-gray-500 leading-relaxed">
                <span className="text-[#111] font-medium">{label}:</span> {tip}
              </p>
            ))}
            <p className="text-[10px] text-gray-400 pt-2 tracking-wide">
              ¿Dudas con tu talle? Escribinos por WhatsApp y te ayudamos.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
