export const metadata = {
  title: 'Preguntas frecuentes | KYMA',
}

const faqs = [
  {
    q: '¿Cuánto tarda el envío?',
    a: 'Los envíos a AMBA llegan en 2-4 días hábiles. Al interior del país entre 5-8 días hábiles. Una vez despachado, te enviamos el número de seguimiento por email.',
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
]

export default function FaqPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold tracking-wide mb-8">Preguntas frecuentes</h1>

      <div className="space-y-6">
        {faqs.map((faq, i) => (
          <div key={i} className="border-b pb-6">
            <h2 className="font-semibold text-base mb-2">{faq.q}</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 bg-gray-50 rounded-lg p-6 text-sm text-gray-600">
        <p className="font-semibold mb-1">¿No encontraste lo que buscabas?</p>
        <p>Escribinos por Instagram <strong>@kymaba</strong> o por WhatsApp y te respondemos a la brevedad.</p>
      </div>
    </div>
  )
}
