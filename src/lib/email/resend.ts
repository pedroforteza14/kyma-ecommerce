import { Resend } from 'resend'

// Initialize with a placeholder if not configured — actual sends are gated
// by checking resendConfigured before calling resend.emails.send()
export const resend = new Resend(process.env.RESEND_API_KEY ?? 'placeholder')
