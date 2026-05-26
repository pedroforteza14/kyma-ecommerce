export const metadata = {
  title: 'Cambios y devoluciones | KYMA',
}

export default function CambiosPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold tracking-wide mb-8">Cambios y devoluciones</h1>

      <div className="space-y-8 text-sm text-gray-700 leading-relaxed">
        <section>
          <h2 className="font-semibold text-base mb-3">¿Cuándo puedo cambiar una prenda?</h2>
          <p>
            Aceptamos cambios dentro de los <strong>10 días corridos</strong> desde la recepción
            del pedido, siempre que la prenda esté en perfectas condiciones: sin uso, sin lavar,
            con etiquetas originales y en su packaging original.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-3">¿Cómo inicio un cambio?</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Escribinos por Instagram <strong>@kymaba</strong> o por WhatsApp.</li>
            <li>Indicá tu número de pedido y el motivo del cambio.</li>
            <li>Te confirmamos la disponibilidad del nuevo talle o producto.</li>
            <li>Coordinamos el envío de devolución y el despacho del cambio.</li>
          </ol>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-3">Costo del cambio</h2>
          <p>
            El costo de envío de devolución está a cargo de la compradora. El nuevo despacho
            tiene el mismo costo que el envío original.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-3">Devolución de dinero</h2>
          <p>
            Realizamos devoluciones en los siguientes casos: producto con defecto de fábrica o
            error en el envío de nuestra parte. En ese caso, el costo de devolución está a
            nuestro cargo y el reintegro se procesa dentro de los <strong>5 días hábiles</strong>.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-3">Prendas sin cambio</h2>
          <p>
            No aceptamos cambios en prendas de la sección <strong>SALE</strong>, ropa interior
            ni accesorios por razones de higiene.
          </p>
        </section>
      </div>
    </div>
  )
}
