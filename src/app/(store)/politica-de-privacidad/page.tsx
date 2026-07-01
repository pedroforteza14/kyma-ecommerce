import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de privacidad',
  description: 'Cómo KYMA recopila, usa y protege tu información personal.',
}

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-8 py-20">
      <p className="text-[9px] tracking-[0.5em] uppercase text-gray-400 mb-3">Legal</p>
      <h1 className="font-display text-4xl font-light mb-12">Política de privacidad</h1>

      <div className="space-y-8 text-[13px] leading-[1.9] text-gray-600">

        <section className="space-y-3">
          <h2 className="text-[10px] tracking-[0.35em] uppercase text-gray-400">1. Datos que recopilamos</h2>
          <p>
            Al realizar una compra o ponerte en contacto con nosotros, podemos recopilar:
            nombre completo, dirección de email, teléfono, dirección de envío y datos del medio de pago
            (procesados exclusivamente por MercadoPago — no almacenamos datos de tarjetas).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-[10px] tracking-[0.35em] uppercase text-gray-400">2. Cómo usamos tu información</h2>
          <p>Utilizamos tus datos únicamente para:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Procesar y entregar tu pedido</li>
            <li>Enviarte confirmación y actualizaciones del pedido por email</li>
            <li>Contactarte ante consultas sobre tu compra</li>
            <li>Mejorar nuestra tienda y comunicaciones (datos agregados y anónimos)</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-[10px] tracking-[0.35em] uppercase text-gray-400">3. Cookies y seguimiento</h2>
          <p>
            Nuestro sitio utiliza herramientas de analítica para entender el comportamiento de los visitantes:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li><strong>Meta Pixel y Conversions API</strong>: para medir la efectividad de nuestros anuncios en Instagram y Facebook. Los datos se envían con email y teléfono encriptados (SHA-256).</li>
            <li><strong>Google Analytics 4</strong>: para análisis de tráfico de forma anónima.</li>
          </ul>
          <p>Podés optar por no ser rastreado usando la configuración de privacidad de tu navegador o las herramientas de opt-out de Meta y Google.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-[10px] tracking-[0.35em] uppercase text-gray-400">4. Compartir datos con terceros</h2>
          <p>
            No vendemos ni cedemos tus datos personales a terceros. Solo los compartimos con los servicios
            necesarios para operar la tienda: MercadoPago (pagos), Resend (emails transaccionales),
            Meta e Google (analítica de marketing, con datos encriptados).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-[10px] tracking-[0.35em] uppercase text-gray-400">5. Almacenamiento y seguridad</h2>
          <p>
            Tus datos se almacenan de forma segura en servidores con encriptación en tránsito (HTTPS/SSL)
            y en reposo. Solo el personal autorizado de KYMA tiene acceso a la información de pedidos.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-[10px] tracking-[0.35em] uppercase text-gray-400">6. Tus derechos</h2>
          <p>
            De acuerdo a la Ley 25.326 de Protección de Datos Personales (Argentina), tenés derecho a
            acceder, rectificar o eliminar tus datos personales. Para ejercer estos derechos escribinos a{' '}
            <a href="mailto:hola@kyma.com.ar" className="text-[#111] underline underline-offset-2">
              hola@kyma.com.ar
            </a>
            .
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-[10px] tracking-[0.35em] uppercase text-gray-400">7. Contacto</h2>
          <p>
            Para cualquier consulta sobre esta política de privacidad podés escribirnos a{' '}
            <a href="mailto:hola@kyma.com.ar" className="text-[#111] underline underline-offset-2">
              hola@kyma.com.ar
            </a>{' '}
            o por{' '}
            <a
              href="https://wa.me/5491132587946"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#111] underline underline-offset-2"
            >
              WhatsApp
            </a>
            .
          </p>
        </section>

        <p className="text-[11px] text-gray-400 border-t border-gray-100 pt-6">
          Última actualización: junio 2026 · KYMA Buenos Aires, Argentina
        </p>
      </div>
    </div>
  )
}
