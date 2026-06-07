import { providerRequest } from "@/lib/integrations/http";

export async function sendGa4Event(input: {
  clientId: string;
  name: string;
  params?: Record<string, unknown>;
}) {
  const measurementId = process.env.GA_MEASUREMENT_ID;
  const apiSecret = process.env.GA_API_SECRET;
  if (!measurementId || !apiSecret) return null;
  return providerRequest<Record<string, unknown>>({
    provider: "google_analytics",
    operation: "MEASUREMENT_EVENT",
    endpoint: `https://www.google-analytics.com/mp/collect?measurement_id=${encodeURIComponent(measurementId)}&api_secret=${encodeURIComponent(apiSecret)}`,
    method: "POST",
    body: {
      client_id: input.clientId,
      events: [{ name: input.name, params: input.params ?? {} }]
    },
    retry: false
  });
}
