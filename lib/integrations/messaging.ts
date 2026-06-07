import { providerRequest } from "@/lib/integrations/http";

export function sendWhatsAppTemplate(input: {
  to: string;
  template: string;
  language?: string;
  components?: unknown[];
}) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneId) throw new Error("WhatsApp Business is not configured.");
  return providerRequest<Record<string, unknown>>({
    provider: "whatsapp",
    operation: "SEND_TEMPLATE",
    endpoint: `https://graph.facebook.com/v21.0/${phoneId}/messages`,
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: {
      messaging_product: "whatsapp",
      to: input.to,
      type: "template",
      template: {
        name: input.template,
        language: { code: input.language ?? "en" },
        components: input.components ?? []
      }
    }
  });
}

export function sendEmail(input: { to: string; subject: string; html: string }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("Transactional email is not configured.");
  return providerRequest<Record<string, unknown>>({
    provider: "email",
    operation: "SEND_EMAIL",
    endpoint: "https://api.resend.com/emails",
    method: "POST",
    headers: { Authorization: `Bearer ${key}` },
    body: {
      from: process.env.EMAIL_FROM ?? "southAura <orders@southaura.in>",
      to: [input.to],
      subject: input.subject,
      html: input.html
    }
  });
}

export function sendSms(input: { to: string; variables: Record<string, string> }) {
  const authkey = process.env.MSG91_AUTH_KEY;
  const templateId = process.env.MSG91_TEMPLATE_ID;
  if (!authkey || !templateId) throw new Error("SMS gateway is not configured.");
  return providerRequest<Record<string, unknown>>({
    provider: "sms",
    operation: "SEND_SMS",
    endpoint: "https://control.msg91.com/api/v5/flow/",
    method: "POST",
    headers: { authkey },
    body: {
      template_id: templateId,
      short_url: "0",
      recipients: [{ mobiles: input.to, ...input.variables }]
    }
  });
}
