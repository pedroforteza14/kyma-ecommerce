import crypto from 'crypto'

const hash = (value: string) =>
  crypto.createHash('sha256').update(value.toLowerCase().trim()).digest('hex')

export type CapiUserData = {
  email?: string
  phone?: string
  clientIp?: string
  userAgent?: string
}

export type CapiEventPayload = {
  eventName: string
  eventId: string
  eventSourceUrl?: string
  userData?: CapiUserData
  customData?: Record<string, unknown>
}

/**
 * Envía un evento a la Meta Conversions API (server-side).
 * Silencia errores si no hay credenciales configuradas.
 */
export async function sendCapiEvent(opts: CapiEventPayload): Promise<void> {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN

  if (!pixelId || !accessToken) return

  const user_data: Record<string, unknown> = {}
  if (opts.userData?.email)     user_data.em  = [hash(opts.userData.email)]
  if (opts.userData?.phone)     user_data.ph  = [hash(opts.userData.phone.replace(/\D/g, ''))]
  if (opts.userData?.clientIp)  user_data.client_ip_address = opts.userData.clientIp
  if (opts.userData?.userAgent) user_data.client_user_agent = opts.userData.userAgent

  const event: Record<string, unknown> = {
    event_name:    opts.eventName,
    event_time:    Math.floor(Date.now() / 1000),
    event_id:      opts.eventId,
    action_source: 'website',
    user_data,
  }
  if (opts.eventSourceUrl) event.event_source_url = opts.eventSourceUrl
  if (opts.customData)     event.custom_data       = opts.customData

  try {
    await fetch(
      `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`,
      {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ data: [event] }),
      },
    )
  } catch (err) {
    console.warn('[Meta CAPI] Failed to send event:', opts.eventName, err)
  }
}
