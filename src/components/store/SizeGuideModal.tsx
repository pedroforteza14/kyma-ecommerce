'use client'

import { X } from 'lucide-react'

type Props = {
  isOpen: boolean
  onClose: () => void
}

const sizes = [
  { talle: 'XS', busto: '80-84', cintura: '62-66', cadera: '88-92' },
  { talle: 'S', busto: '84-88', cintura: '66-70', cadera: '92-96' },
  { talle: 'M', busto: '88-92', cintura: '70-74', cadera: '96-100' },
  { talle: 'L', busto: '92-96', cintura: '74-78', cadera: '100-104' },
  { talle: 'XL', busto: '96-102', cintura: '78-84', cadera: '104-110' },
  { talle: 'XXL', busto: '102-108', cintura: '84-90', cadera: '110-116' },
]

export default function SizeGuideModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-lg rounded-sm shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-lg font-semibold tracking-wide">Guía de talles</h2>
            <button onClick={onClose} className="hover:opacity-60 transition-opacity">
              <X size={22} />
            </button>
          </div>

          {/* Tabla */}
          <div className="p-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  {['Talle', 'Busto (cm)', 'Cintura (cm)', 'Cadera (cm)'].map((h) => (
                    <th key={h} className="text-left py-3 pr-4 text-xs font-semibold text-gray-500 tracking-wide uppercase">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sizes.map((row) => (
                  <tr key={row.talle} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 pr-4 font-semibold">{row.talle}</td>
                    <td className="py-3 pr-4 text-gray-600">{row.busto}</td>
                    <td className="py-3 pr-4 text-gray-600">{row.cintura}</td>
                    <td className="py-3 pr-4 text-gray-600">{row.cadera}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tips */}
          <div className="px-6 pb-6 border-t pt-4 space-y-2 text-xs text-gray-500">
            <p><strong>¿Cómo medirse?</strong></p>
            <p>• <strong>Busto:</strong> Pasá la cinta por la parte más ancha del pecho.</p>
            <p>• <strong>Cintura:</strong> Medí en la parte más angosta del torso.</p>
            <p>• <strong>Cadera:</strong> Pasá la cinta por la parte más ancha de la cadera.</p>
            <p className="mt-3 text-gray-400">Si quedás entre dos talles, te recomendamos elegir el mayor.</p>
          </div>
        </div>
      </div>
    </>
  )
}
