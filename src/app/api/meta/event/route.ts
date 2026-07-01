import { NextRequest, NextResponse } from 'next/server'
import { sendCapiEvent } from '@/lib/meta/capi'

/**
 * Relay: el browser manda el evento con su event_id,
 * el server lo reenvía a CAPI con IP + UA reales del request.
 * Meta deduplica el par Pixel ↔ CAPI usando ese event_id.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      eventName: string
      eventId: string
      eventSourceUrl?: string
      email?: string
      phone?: string
      customData?: Record<string, unknown>
    }

    if (!body.eventName || !body.eventId) {
      return NextResponse.json({ error: 'eventName y eventId son requeridos' }, { status: 400 })
    }

    const clientIp =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      req.headers.get('x-real-ip') ??
      undefined

    const userAgent = req.headers.get('user-agent') ?? undefined

    await sendCapiEvent({
      eventName:      body.eventName,
      eventId:        body.eventId,
      eventSourceUrl: body.eventSourceUrl,
      userData: {
        email:     body.email,
        phone:     body.phone,
        clientIp,
        userAgent,
      },
      customData: body.customData,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[Meta relay] error:', err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
