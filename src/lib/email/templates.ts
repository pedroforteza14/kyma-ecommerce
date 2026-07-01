import { CartItem } from '@/types'

const fmt = (n: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(n)

// ── Helpers de estilo ─────────────────────────────────────────────────────────
const FONT = `font-family: 'Georgia', 'Times New Roman', serif;`
const SANS = `font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;`
const BG   = '#f9f8f5'
const INK  = '#111111'

function itemsHtml(items: CartItem[]) {
  return items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #e8e6e0; ${SANS}">
          <span style="font-size: 13px; color: ${INK};">${item.name}</span>
          <span style="font-size: 11px; color: #888; margin-left: 8px;">Talle ${item.size}${item.quantity > 1 ? ` · x${item.quantity}` : ''}</span>
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #e8e6e0; text-align: right; ${SANS}">
          <span style="font-size: 13px; color: ${INK};">${fmt(item.price * item.quantity)}</span>
        </td>
      </tr>`,
    )
    .join('')
}

// ── Email de confirmación al comprador ────────────────────────────────────────
export function orderConfirmationHtml(opts: {
  customerName: string
  orderId: string
  items: CartItem[]
  total: number
  address: string
}) {
  const { customerName, orderId, items, total, address } = opts
  const shortId   = orderId.slice(0, 8).toUpperCase()
  const firstName = customerName.split(' ')[0]
  const isRetiro  = address === 'Retiro en persona'

  const deliveryBlock = isRetiro
    ? `<tr>
        <td style="padding: 6px 0; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #888; ${SANS}; width: 140px;">Entrega</td>
        <td style="padding: 6px 0; font-size: 13px; color: ${INK}; ${SANS}">Retiro en persona · Buenos Aires</td>
       </tr>
       <tr>
        <td style="padding: 6px 0; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #888; ${SANS}">Coordinación</td>
        <td style="padding: 6px 0; font-size: 13px; color: ${INK}; ${SANS}">Te contactamos por WhatsApp para acordar lugar y horario.</td>
       </tr>`
    : `<tr>
        <td style="padding: 6px 0; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #888; ${SANS}; width: 140px;">Envío</td>
        <td style="padding: 6px 0; font-size: 13px; color: ${INK}; ${SANS}">Domicilio · Gratis</td>
       </tr>
       <tr>
        <td style="padding: 6px 0; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #888; ${SANS}">Dirección</td>
        <td style="padding: 6px 0; font-size: 13px; color: ${INK}; ${SANS}">${address}</td>
       </tr>`

  const steps = isRetiro
    ? [
        'Revisamos tu pedido y te confirmamos disponibilidad.',
        'Te contactamos por WhatsApp para coordinar el retiro.',
        'Retirás en el punto acordado en Buenos Aires.',
      ]
    : [
        'Revisamos tu pedido y preparamos los productos.',
        'Te enviamos el número de seguimiento por email.',
        'Recibís tu pedido en la dirección indicada.',
      ]

  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${BG};${SANS}">
<table width="100%" cellpadding="0" cellspacing="0">
  <tr><td align="center" style="padding: 40px 20px;">
    <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border:1px solid #e8e6e0;max-width:560px;width:100%;">

      <!-- Header -->
      <tr>
        <td style="padding: 40px 48px 32px; border-bottom: 1px solid #e8e6e0;">
          <h1 style="${FONT} font-size: 28px; font-weight: 300; color: ${INK}; margin: 0 0 6px; letter-spacing: 0.02em;">K Y M A</h1>
          <p style="margin:0; font-size: 10px; letter-spacing: 0.35em; text-transform: uppercase; color: #888;">Buenos Aires</p>
        </td>
      </tr>

      <!-- Body -->
      <tr>
        <td style="padding: 40px 48px 0;">

          <p style="font-size: 10px; letter-spacing: 0.4em; text-transform: uppercase; color: #888; margin: 0 0 16px;">Pago confirmado</p>
          <h2 style="${FONT} font-size: 26px; font-weight: 300; color: ${INK}; margin: 0 0 16px; line-height: 1.3;">
            ¡Gracias, ${firstName}!
          </h2>
          <p style="${SANS} font-size: 14px; color: #555; line-height: 1.7; margin: 0 0 32px;">
            Tu pedido fue recibido y confirmado. A continuación encontrás todo el detalle.
          </p>

          <!-- Número de pedido -->
          <div style="background: ${BG}; padding: 16px 24px; margin-bottom: 32px; border-left: 2px solid ${INK};">
            <p style="margin: 0; font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; color: #888;">Número de pedido</p>
            <p style="margin: 6px 0 0; font-size: 18px; color: ${INK}; ${FONT} font-weight: 300;">#${shortId}</p>
          </div>

          <!-- Productos -->
          <p style="font-size: 10px; letter-spacing: 0.35em; text-transform: uppercase; color: #888; margin: 0 0 12px;">Productos</p>
          <table width="100%" cellpadding="0" cellspacing="0">
            ${itemsHtml(items)}
          </table>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 4px; border-top: 1px solid #e8e6e0;">
            <tr>
              <td style="padding: 14px 0 0; font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase; color: #888; ${SANS}">Total</td>
              <td style="padding: 14px 0 0; text-align: right; ${FONT} font-size: 22px; font-weight: 300; color: ${INK};">${fmt(total)}</td>
            </tr>
          </table>

        </td>
      </tr>

      <!-- Entrega -->
      <tr>
        <td style="padding: 32px 48px 0;">
          <p style="font-size: 10px; letter-spacing: 0.35em; text-transform: uppercase; color: #888; margin: 0 0 12px;">Entrega</p>
          <div style="background: ${BG}; padding: 16px 24px; border: 1px solid #e8e6e0;">
            <table width="100%" cellpadding="0" cellspacing="0">
              ${deliveryBlock}
            </table>
          </div>
        </td>
      </tr>

      <!-- Próximos pasos -->
      <tr>
        <td style="padding: 32px 48px 0;">
          <p style="font-size: 10px; letter-spacing: 0.35em; text-transform: uppercase; color: #888; margin: 0 0 16px;">Próximos pasos</p>
          <table width="100%" cellpadding="0" cellspacing="0">
            ${steps.map((step, i) => `
            <tr>
              <td style="padding: 8px 0; vertical-align: top; width: 28px;">
                <div style="width: 20px; height: 20px; border-radius: 50%; background: ${INK}; text-align: center; line-height: 20px;">
                  <span style="font-size: 10px; color: #fff; ${SANS}">${i + 1}</span>
                </div>
              </td>
              <td style="padding: 8px 0; font-size: 13px; color: #555; line-height: 1.6; ${SANS}">${step}</td>
            </tr>`).join('')}
          </table>
        </td>
      </tr>

      <!-- Contacto directo -->
      <tr>
        <td style="padding: 32px 48px 0;">
          <p style="font-size: 10px; letter-spacing: 0.35em; text-transform: uppercase; color: #888; margin: 0 0 16px;">¿Tenés alguna consulta?</p>
          <table cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding-right: 12px;">
                <a href="https://wa.me/5491132587946" target="_blank"
                   style="display: inline-block; background: #25D366; color: #fff; text-decoration: none; padding: 12px 24px; font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; ${SANS}">
                  WhatsApp
                </a>
              </td>
              <td>
                <a href="mailto:hola@kyma.com.ar"
                   style="display: inline-block; border: 1px solid #e8e6e0; color: ${INK}; text-decoration: none; padding: 12px 24px; font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; ${SANS}">
                  hola@kyma.com.ar
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Footer con redes -->
      <tr>
        <td style="padding: 32px 48px; margin-top: 32px; border-top: 1px solid #e8e6e0; margin-top: 32px;">
          <!-- separador -->
        </td>
      </tr>
      <tr>
        <td style="padding: 0 48px 40px; border-top: 1px solid #e8e6e0; text-align: center;">
          <p style="${SANS} font-size: 11px; color: #bbb; margin: 24px 0 12px;">Seguinos en redes</p>
          <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
            <tr>
              <td style="padding: 0 8px;">
                <a href="https://instagram.com/kymaba" target="_blank"
                   style="font-size: 11px; color: ${INK}; text-decoration: none; letter-spacing: 0.2em; ${SANS}">
                  Instagram
                </a>
              </td>
              <td style="padding: 0 8px; color: #ddd;">·</td>
              <td style="padding: 0 8px;">
                <a href="https://tiktok.com/@kymaba" target="_blank"
                   style="font-size: 11px; color: ${INK}; text-decoration: none; letter-spacing: 0.2em; ${SANS}">
                  TikTok
                </a>
              </td>
            </tr>
          </table>
          <p style="${SANS} font-size: 10px; color: #ddd; margin: 20px 0 0;">
            KYMA · Buenos Aires · kyma.com.ar
          </p>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>`
}

// ── Notificación interna (admin) ──────────────────────────────────────────────
export function adminOrderNotificationHtml(opts: {
  orderId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  address: string
  items: CartItem[]
  total: number
}) {
  const { orderId, customerName, customerEmail, customerPhone, address, items, total } = opts
  const shortId = orderId.slice(0, 8).toUpperCase()
  const now = new Date().toLocaleString('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:${BG};${SANS}">
<table width="100%" cellpadding="0" cellspacing="0">
  <tr><td align="center" style="padding: 40px 20px;">
    <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border:1px solid #e8e6e0;max-width:560px;width:100%;">

      <tr>
        <td style="padding: 32px 40px; background: ${INK};">
          <h1 style="${FONT} font-size: 20px; font-weight: 300; color: #fff; margin: 0 0 4px;">
            Nuevo pedido — KYMA
          </h1>
          <p style="margin: 0; font-size: 11px; color: #888; letter-spacing: 0.2em;">
            ${now} · #${shortId}
          </p>
        </td>
      </tr>

      <tr>
        <td style="padding: 32px 40px;">

          <!-- Cliente -->
          <h3 style="${SANS} font-size: 10px; letter-spacing: 0.35em; text-transform: uppercase; color: #888; margin: 0 0 12px;">Cliente</h3>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 28px;">
            <tr>
              <td style="font-size: 13px; color: ${INK}; padding: 4px 0; width: 100px; ${SANS} color: #888;">Nombre</td>
              <td style="font-size: 13px; color: ${INK}; padding: 4px 0; ${SANS}">${customerName}</td>
            </tr>
            <tr>
              <td style="font-size: 13px; color: ${INK}; padding: 4px 0; ${SANS} color: #888;">Email</td>
              <td style="font-size: 13px; padding: 4px 0; ${SANS}">
                <a href="mailto:${customerEmail}" style="color: ${INK};">${customerEmail}</a>
              </td>
            </tr>
            <tr>
              <td style="font-size: 13px; color: ${INK}; padding: 4px 0; ${SANS} color: #888;">Teléfono</td>
              <td style="font-size: 13px; padding: 4px 0; ${SANS}">
                <a href="https://wa.me/${customerPhone.replace(/\D/g,'')}" style="color: ${INK};">${customerPhone}</a>
              </td>
            </tr>
            <tr>
              <td style="font-size: 13px; color: ${INK}; padding: 4px 0; ${SANS} color: #888;">Dirección</td>
              <td style="font-size: 13px; color: ${INK}; padding: 4px 0; ${SANS}">${address}</td>
            </tr>
          </table>

          <!-- Items -->
          <h3 style="${SANS} font-size: 10px; letter-spacing: 0.35em; text-transform: uppercase; color: #888; margin: 0 0 12px;">Productos</h3>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
            ${itemsHtml(items)}
          </table>

          <!-- Total -->
          <table width="100%" cellpadding="0" cellspacing="0" style="border-top: 2px solid ${INK}; margin-top: 8px;">
            <tr>
              <td style="padding: 14px 0 0; font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase; color: #888; ${SANS}">Total</td>
              <td style="padding: 14px 0 0; text-align: right; ${FONT} font-size: 24px; font-weight: 300; color: ${INK};">${fmt(total)}</td>
            </tr>
          </table>

        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>`
}

// ── Email de instrucciones de transferencia bancaria ─────────────────────────
export function bankTransferHtml(opts: {
  customerName: string
  orderId: string
  items: CartItem[]
  total: number
}) {
  const { customerName, orderId, items, total } = opts
  const shortId   = orderId.slice(0, 8).toUpperCase()
  const firstName = customerName.split(' ')[0]

  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${BG};${SANS}">
<table width="100%" cellpadding="0" cellspacing="0">
  <tr><td align="center" style="padding: 40px 20px;">
    <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border:1px solid #e8e6e0;max-width:560px;width:100%;">

      <!-- Header -->
      <tr>
        <td style="padding: 40px 48px 32px; border-bottom: 1px solid #e8e6e0;">
          <h1 style="${FONT} font-size: 28px; font-weight: 300; color: ${INK}; margin: 0 0 6px; letter-spacing: 0.02em;">K Y M A</h1>
          <p style="margin:0; font-size: 10px; letter-spacing: 0.35em; text-transform: uppercase; color: #888;">Buenos Aires</p>
        </td>
      </tr>

      <!-- Body -->
      <tr>
        <td style="padding: 40px 48px 0;">
          <p style="font-size: 10px; letter-spacing: 0.4em; text-transform: uppercase; color: #888; margin: 0 0 16px;">Datos de transferencia</p>
          <h2 style="${FONT} font-size: 26px; font-weight: 300; color: ${INK}; margin: 0 0 16px; line-height: 1.3;">
            ¡Ya casi, ${firstName}!
          </h2>
          <p style="${SANS} font-size: 14px; color: #555; line-height: 1.7; margin: 0 0 32px;">
            Tu pedido está reservado. Para confirmarlo realizá la transferencia con los datos de abajo y envianos el comprobante por WhatsApp.
          </p>

          <!-- Datos bancarios -->
          <div style="background: ${BG}; border: 1px solid #e8e6e0; padding: 24px; margin-bottom: 32px;">
            <p style="font-size: 10px; letter-spacing: 0.35em; text-transform: uppercase; color: #888; margin: 0 0 16px;">Datos bancarios</p>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding: 7px 0; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #999; ${SANS}; width: 110px;">Banco</td>
                <td style="padding: 7px 0; font-size: 13px; color: ${INK}; font-weight: 500; ${SANS}">Banco Galicia</td>
              </tr>
              <tr>
                <td style="padding: 7px 0; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #999; ${SANS};">Titular</td>
                <td style="padding: 7px 0; font-size: 13px; color: ${INK}; font-weight: 500; ${SANS}">KYMA Buenos Aires</td>
              </tr>
              <tr>
                <td style="padding: 7px 0; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #999; ${SANS};">CBU</td>
                <td style="padding: 7px 0; font-size: 14px; color: ${INK}; font-weight: 700; font-family: monospace; letter-spacing: 0.05em;">0070999020000012345678</td>
              </tr>
              <tr>
                <td style="padding: 7px 0; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #999; ${SANS};">Alias</td>
                <td style="padding: 7px 0; font-size: 14px; color: ${INK}; font-weight: 700; ${SANS}">KYMA.MODA.BA</td>
              </tr>
              <tr>
                <td style="padding: 7px 0; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #999; ${SANS};">CUIT</td>
                <td style="padding: 7px 0; font-size: 13px; color: ${INK}; font-family: monospace;">30-12345678-9</td>
              </tr>
              <tr>
                <td style="padding: 12px 0 0; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #999; ${SANS}; border-top: 1px solid #e8e6e0;">Monto</td>
                <td style="padding: 12px 0 0; border-top: 1px solid #e8e6e0; ${FONT} font-size: 22px; font-weight: 300; color: ${INK};">${fmt(total)}</td>
              </tr>
            </table>
          </div>

          <!-- Número de pedido -->
          <div style="background: ${BG}; padding: 14px 24px; margin-bottom: 32px; border-left: 2px solid ${INK};">
            <p style="margin: 0; font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; color: #888;">Pedido a confirmar</p>
            <p style="margin: 6px 0 0; font-size: 16px; color: ${INK}; ${FONT} font-weight: 300;">#${shortId}</p>
          </div>

          <!-- Items -->
          <p style="font-size: 10px; letter-spacing: 0.35em; text-transform: uppercase; color: #888; margin: 0 0 12px;">Productos reservados</p>
          <table width="100%" cellpadding="0" cellspacing="0">
            ${itemsHtml(items)}
          </table>

          <!-- Enviar comprobante -->
          <div style="margin-top: 32px; padding: 20px 24px; border: 1px solid #e8e6e0;">
            <p style="${SANS} font-size: 12px; color: #555; margin: 0 0 12px; line-height: 1.6;">
              Una vez realizada la transferencia envianos el comprobante para confirmar tu pedido:
            </p>
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding-right: 10px;">
                  <a href="https://wa.me/5491132587946?text=${encodeURIComponent(`Hola! Te mando el comprobante de transferencia del pedido #${shortId}`)}"
                     target="_blank"
                     style="display: inline-block; background: #25D366; color: #fff; text-decoration: none; padding: 11px 22px; font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; ${SANS}">
                    WhatsApp
                  </a>
                </td>
                <td>
                  <a href="mailto:hola@kyma.com.ar?subject=Comprobante pedido %23${shortId}"
                     style="display: inline-block; border: 1px solid #e8e6e0; color: ${INK}; text-decoration: none; padding: 11px 22px; font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; ${SANS}">
                    Email
                  </a>
                </td>
              </tr>
            </table>
          </div>

        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="padding: 32px 48px; text-align: center; border-top: 1px solid #e8e6e0; margin-top: 32px;">
          <p style="${SANS} font-size: 11px; color: #bbb; margin: 0 0 8px;">Seguinos en redes</p>
          <p style="${SANS} font-size: 11px; margin: 0;">
            <a href="https://instagram.com/kymaba" style="color: ${INK}; text-decoration: none; letter-spacing: 0.2em;">Instagram</a>
            <span style="color: #ddd; margin: 0 8px;">·</span>
            <a href="https://tiktok.com/@kymaba" style="color: ${INK}; text-decoration: none; letter-spacing: 0.2em;">TikTok</a>
          </p>
          <p style="${SANS} font-size: 10px; color: #ddd; margin: 12px 0 0;">KYMA · Buenos Aires · kyma.com.ar</p>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>`
}

// ── Email de pago en efectivo (pending) ──────────────────────────────────────
export function cashPaymentHtml(opts: {
  customerName: string
  orderId: string
  items: CartItem[]
  total: number
  ticketUrl: string
}) {
  const { customerName, orderId, items, total, ticketUrl } = opts
  const shortId  = orderId.slice(0, 8).toUpperCase()
  const firstName = customerName.split(' ')[0]

  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${BG};${SANS}">
<table width="100%" cellpadding="0" cellspacing="0">
  <tr><td align="center" style="padding: 40px 20px;">
    <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border:1px solid #e8e6e0;max-width:560px;width:100%;">

      <!-- Header -->
      <tr>
        <td style="padding: 40px 48px 32px; border-bottom: 1px solid #e8e6e0;">
          <h1 style="${FONT} font-size: 28px; font-weight: 300; color: ${INK}; margin: 0 0 6px; letter-spacing: 0.02em;">K Y M A</h1>
          <p style="margin:0; font-size: 10px; letter-spacing: 0.35em; text-transform: uppercase; color: #888;">Buenos Aires</p>
        </td>
      </tr>

      <!-- Body -->
      <tr>
        <td style="padding: 40px 48px;">
          <p style="font-size: 10px; letter-spacing: 0.4em; text-transform: uppercase; color: #888; margin: 0 0 16px;">Tu código de pago</p>
          <h2 style="${FONT} font-size: 26px; font-weight: 300; color: ${INK}; margin: 0 0 24px; line-height: 1.3;">
            ¡Ya casi, ${firstName}!
          </h2>
          <p style="${SANS} font-size: 14px; color: #555; line-height: 1.7; margin: 0 0 32px;">
            Tu pedido está reservado. Para confirmarlo, hacé el pago en efectivo en cualquier sucursal de <strong>Pago Fácil</strong> o <strong>Rapipago</strong> con el código que encontrás abajo.
          </p>

          <!-- Ticket button -->
          <table cellpadding="0" cellspacing="0" style="margin-bottom: 32px;">
            <tr>
              <td style="background: ${INK};">
                <a href="${ticketUrl}" target="_blank"
                   style="display: inline-block; padding: 16px 40px; color: #fff; text-decoration: none; font-size: 11px; letter-spacing: 0.4em; text-transform: uppercase; ${SANS}">
                  Ver mi código de pago →
                </a>
              </td>
            </tr>
          </table>

          <p style="${SANS} font-size: 12px; color: #888; margin: 0 0 32px; line-height: 1.6;">
            También podés copiar este link en tu navegador:<br/>
            <a href="${ticketUrl}" style="color: ${INK}; word-break: break-all; font-size: 11px;">${ticketUrl}</a>
          </p>

          <!-- Order number -->
          <div style="background: ${BG}; padding: 16px 24px; margin-bottom: 32px; border-left: 2px solid ${INK};">
            <p style="margin: 0; font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; color: #888;">Número de pedido</p>
            <p style="margin: 6px 0 0; font-size: 16px; color: ${INK}; ${FONT} font-weight: 300;">#${shortId}</p>
          </div>

          <!-- Items -->
          <table width="100%" cellpadding="0" cellspacing="0">
            ${itemsHtml(items)}
          </table>

          <!-- Total -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 16px; border-top: 1px solid #e8e6e0;">
            <tr>
              <td style="padding: 16px 0 0; font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase; color: #888; ${SANS}">Total a pagar</td>
              <td style="padding: 16px 0 0; text-align: right; ${FONT} font-size: 22px; font-weight: 300; color: ${INK};">${fmt(total)}</td>
            </tr>
          </table>

          <p style="${SANS} font-size: 12px; color: #aaa; margin: 28px 0 0; line-height: 1.6;">
            Una vez que realices el pago, tu pedido se confirmará automáticamente y te avisamos por email.
          </p>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="padding: 24px 48px; border-top: 1px solid #e8e6e0; text-align: center;">
          <p style="${SANS} font-size: 11px; color: #bbb; margin: 0;">
            ¿Dudas? Escribinos a
            <a href="https://instagram.com/kymaba" style="color: ${INK}; text-decoration: none;">@kymaba</a>
          </p>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>`
}

// ── Email de envío al comprador ───────────────────────────────────────────────
const CARRIER_URLS: Record<string, (n: string) => string> = {
  Andreani:           (n) => `https://www.andreani.com/#!/informacionEnvio/${n}`,
  OCA:                (n) => `https://www.oca.com.ar/seguimiento/${n}`,
  'Correo Argentino': (n) => `https://www.correoargentino.com.ar/formularios/oidn?idEnvio=${n}`,
  'Mercado Envíos':   (_) => 'https://www.mercadolibre.com.ar/',
}

export function shippingNotificationHtml(opts: {
  customerName: string
  orderId: string
  carrier: string
  trackingNumber: string
}) {
  const { customerName, orderId, carrier, trackingNumber } = opts
  const shortId = orderId.slice(0, 8).toUpperCase()
  const firstName = customerName.split(' ')[0]
  const trackingUrl = CARRIER_URLS[carrier]?.(trackingNumber)

  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${BG};${SANS}">
<table width="100%" cellpadding="0" cellspacing="0">
  <tr><td align="center" style="padding: 40px 20px;">
    <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border:1px solid #e8e6e0;max-width:560px;width:100%;">
      <tr>
        <td style="padding: 40px 48px 32px; border-bottom: 1px solid #e8e6e0;">
          <h1 style="${FONT} font-size: 28px; font-weight: 300; color: ${INK}; margin: 0 0 6px;">K Y M A</h1>
          <p style="margin:0; font-size: 10px; letter-spacing: 0.35em; text-transform: uppercase; color: #888;">Buenos Aires</p>
        </td>
      </tr>
      <tr>
        <td style="padding: 40px 48px;">
          <p style="font-size: 10px; letter-spacing: 0.4em; text-transform: uppercase; color: #888; margin: 0 0 16px;">Tu pedido está en camino</p>
          <h2 style="${FONT} font-size: 26px; font-weight: 300; color: ${INK}; margin: 0 0 24px; line-height: 1.3;">
            ¡En camino,<br /><em>${firstName}!</em>
          </h2>
          <p style="${SANS} font-size: 14px; color: #555; line-height: 1.7; margin: 0 0 32px;">
            Tu pedido acaba de ser despachado. Podés seguir el estado de tu envío con los datos de abajo.
          </p>
          <div style="background: ${BG}; padding: 20px 24px; margin-bottom: 32px; border-left: 2px solid ${INK};">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding: 6px 0; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #888; ${SANS}; width: 130px;">Pedido</td>
                <td style="padding: 6px 0; font-size: 13px; color: ${INK}; ${SANS}">#${shortId}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #888; ${SANS};">Transportista</td>
                <td style="padding: 6px 0; font-size: 13px; color: ${INK}; ${SANS}">${carrier}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #888; ${SANS};">N° de seguimiento</td>
                <td style="padding: 6px 0; font-size: 14px; color: ${INK}; font-weight: 600; ${SANS}">${trackingNumber}</td>
              </tr>
            </table>
          </div>
          ${trackingUrl ? `<table cellpadding="0" cellspacing="0" style="margin-bottom: 32px;"><tr><td style="background: ${INK};"><a href="${trackingUrl}" style="display: inline-block; padding: 14px 32px; color: #fff; text-decoration: none; font-size: 11px; letter-spacing: 0.35em; text-transform: uppercase; ${SANS}">Rastrear mi envío →</a></td></tr></table>` : ''}
        </td>
      </tr>
      <tr>
        <td style="padding: 24px 48px; border-top: 1px solid #e8e6e0; text-align: center;">
          <p style="${SANS} font-size: 11px; color: #bbb; margin: 0;">¿Dudas? Escribinos a <a href="https://instagram.com/kymaba" style="color: ${INK}; text-decoration: none;">@kymaba</a></p>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body>
</html>`
}

// ── Email de carrito abandonado ──────────────────────────────────────────────
export function abandonedCartHtml(opts: {
  customerName: string | null
  items: CartItem[]
  subtotal: number
  checkoutUrl: string
}) {
  const firstName = opts.customerName?.split(' ')[0] ?? ''
  const greeting  = firstName ? `¡Hola ${firstName}!` : '¡Hola!'

  return `<!DOCTYPE html>
<html>
<body style="margin: 0; padding: 0; background-color: ${BG};">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${BG}; padding: 40px 0;">
  <tr><td align="center">
    <table width="560" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 1px solid #e8e6e0;">

      <tr>
        <td style="padding: 48px 48px 12px; text-align: center;">
          <h1 style="${FONT} font-size: 32px; font-weight: 300; letter-spacing: 0.3em; color: ${INK}; margin: 0;">KYMA</h1>
        </td>
      </tr>

      <tr>
        <td style="padding: 24px 48px 8px;">
          <p style="${SANS} font-size: 15px; color: ${INK}; margin: 0;">${greeting}</p>
        </td>
      </tr>

      <tr>
        <td style="padding: 8px 48px 24px;">
          <p style="${SANS} font-size: 13px; color: #555; line-height: 1.7; margin: 0;">
            Notamos que dejaste algunos productos en tu carrito. Los guardamos para vos por si querés completar tu compra.
          </p>
        </td>
      </tr>

      <tr>
        <td style="padding: 0 48px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            ${itemsHtml(opts.items)}
            <tr>
              <td style="padding: 16px 0 0; ${SANS}">
                <span style="font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #888;">Subtotal</span>
              </td>
              <td style="padding: 16px 0 0; text-align: right; ${SANS}">
                <span style="font-size: 16px; font-weight: 600; color: ${INK};">${fmt(opts.subtotal)}</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <tr>
        <td style="padding: 32px 48px; text-align: center;">
          <a href="${opts.checkoutUrl}" style="display: inline-block; background-color: ${INK}; color: #ffffff; ${SANS} font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; text-decoration: none; padding: 16px 48px;">
            Completar mi compra
          </a>
        </td>
      </tr>

      <tr>
        <td style="padding: 0 48px 32px;">
          <p style="${SANS} font-size: 12px; color: #888; text-align: center; line-height: 1.6; margin: 0;">
            Envío gratis · Cuotas sin interés · Cambios sin cargo
          </p>
        </td>
      </tr>

      <tr>
        <td style="padding: 24px 48px; border-top: 1px solid #e8e6e0; text-align: center;">
          <p style="${SANS} font-size: 11px; color: #bbb; margin: 0;">¿Necesitás ayuda? Escribinos por <a href="https://wa.me/5491132587946" style="color: ${INK}; text-decoration: none;">WhatsApp</a> o a <a href="https://instagram.com/kymaba" style="color: ${INK}; text-decoration: none;">@kymaba</a></p>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body>
</html>`
}
