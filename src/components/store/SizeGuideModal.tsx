'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'

type Props = { isOpen: boolean; onClose: () => void }

const SIZES = [
  { talle: 'XS',  busto: '80–84',   cintura: '62–66',  cadera: '88–92'  },
  { talle: 'S',   busto: '84–88',   cintura: '66–70',  cadera: '92–96'  },
  { talle: 'M',   busto: '88–92',   cintura: '70–74',  cadera: '96–100' },
  { talle: 'L',   busto: '92–96',   cintura: '74–78',  cadera: '100–104'},
  { talle: 'XL',  busto: '96–102',  cintura: '78–84',  cadera: '104–110'},
  { talle: 'XXL', busto: '102–108', cintura: '84–90',  cadera: '110–116'},
]

export default function SizeGuideModal({ isOpen, onClose }: Props) {
  // Cerrar con Escape
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-5 pointer-events-none">
        <div className="bg-white w-full max-w-lg pointer-events-auto shadow-2xl">

          {/* Header */}
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

          {/* Tabla */}
          <div className="px-7 py-6 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Talle', 'Busto (cm)', 'Cintura (cm)', 'Cadera (cm)'].map((h) => (
                    <th
                      key={h}
                      className="text-left pb-3 pr-4 text-[9px] tracking-[0.3em] uppercase text-gray-400 font-normal"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SIZES.map((row, i) => (
                  <tr
                    key={row.talle}
                    className={`border-b border-gray-50 ${i % 2 === 0 ? '' : 'bg-[#fafafa]'}`}
                  >
                    <td className="py-3 pr-4 text-[12px] tracking-[0.15em] uppercase font-medium">
                      {row.talle}
                    </td>
                    <td className="py-3 pr-4 text-[12px] text-gray-500">{row.busto}</td>
                    <td className="py-3 pr-4 text-[12px] text-gray-500">{row.cintura}</td>
                    <td className="py-3 pr-4 text-[12px] text-gray-500">{row.cadera}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tips */}
          <div className="px-7 pb-7 border-t border-gray-100 pt-5 space-y-2">
            <p className="text-[9px] tracking-[0.3em] uppercase text-gray-400 mb-3">Cómo medirse</p>
            {[
              ['Busto', 'Pasá la cinta por la parte más ancha del pecho.'],
              ['Cintura', 'Medí en la parte más angosta del torso.'],
              ['Cadera', 'Pasá la cinta por la parte más ancha de la cadera.'],
            ].map(([label, tip]) => (
              <p key={label} className="text-[11px] text-gray-500 leading-relaxed">
                <span className="text-[#111] font-medium">{label}:</span> {tip}
              </p>
            ))}
            <p className="text-[10px] text-gray-400 pt-2 tracking-wide">
              Si quedás entre dos talles, te recomendamos el mayor.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
