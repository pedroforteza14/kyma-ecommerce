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
  const shortId = orderId.slice(0, 8).toUpperCase()
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
          <h1 style="${FONT} font-size: 28px; font-weight: 300; color: ${INK}; margin: 0 0 6px; letter-spacing: 0.02em;">
            K Y M A
          </h1>
          <p style="margin:0; font-size: 10px; letter-spacing: 0.35em; text-transform: uppercase; color: #888;">
            Buenos Aires
          </p>
        </td>
      </tr>

      <!-- Body -->
      <tr>
        <td style="padding: 40px 48px;">

          <p style="font-size: 10px; letter-spacing: 0.4em; text-transform: uppercase; color: #888; margin: 0 0 16px;">
            Pago confirmado
          </p>
          <h2 style="${FONT} font-size: 26px; font-weight: 300; color: ${INK}; margin: 0 0 24px; line-height: 1.3;">
            ¡Gracias, ${firstName}!
          </h2>
          <p style="${SANS} font-size: 14px; color: #555; line-height: 1.7; margin: 0 0 32px;">
            Tu pedido fue recibido y confirmado. Nos contactamos pronto para coordinar el envío a tu dirección.
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
              <td style="padding: 16px 0 0; font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase; color: #888; ${SANS}">
                Total
              </td>
              <td style="padding: 16px 0 0; text-align: right; ${FONT} font-size: 22px; font-weight: 300; color: ${INK};">
                ${fmt(total)}
              </td>
            </tr>
          </table>

          <!-- Address -->
          <p style="${SANS} font-size: 12px; color: #888; margin: 24px 0 0;">
            <span style="font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; display: block; margin-bottom: 4px;">Envío a</span>
            ${address}
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
