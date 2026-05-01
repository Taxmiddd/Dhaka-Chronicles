import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendEmail = async ({
  to,
  subject,
  html,
  text,
}: {
  to: string | string[]
  subject: string
  html: string
  text?: string
}) => {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[DEV] Resend API key not configured. Mocking email send.')
    console.warn(`To: ${to}\nSubject: ${subject}\nHTML: ${html}`)
    return { success: true, mocked: true }
  }

  try {
    const data = await resend.emails.send({
      from: process.env.EMAIL_FROM ?? 'Dhaka Chronicles <noreply@dhakachronicles.com>',
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>?/gm, ''), // Basic HTML stripping if no text provided
    })

    return { success: true, data }
  } catch (error) {
    console.error('Failed to send email via Resend:', error)
    return { success: false, error }
  }
}
