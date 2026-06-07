import { providerRequest } from "@/lib/integrations/http";

function token() {
  if (!process.env.SHIPROCKET_TOKEN) throw new Error("Shiprocket is not configured.");
  return process.env.SHIPROCKET_TOKEN;
}

const base = "https://apiv2.shiprocket.in/v1/external";

export function createShiprocketShipment(payload: Record<string, unknown>) {
  return providerRequest<Record<string, unknown>>({
    provider: "shiprocket",
    operation: "CREATE_SHIPMENT",
    endpoint: `${base}/orders/create/adhoc`,
    method: "POST",
    headers: { Authorization: `Bearer ${token()}` },
    body: payload
  });
}

export function assignShiprocketAwb(shipmentId: string) {
  return providerRequest<Record<string, unknown>>({
    provider: "shiprocket",
    operation: "ASSIGN_AWB",
    endpoint: `${base}/courier/assign/awb`,
    method: "POST",
    headers: { Authorization: `Bearer ${token()}` },
    body: { shipment_id: shipmentId }
  });
}

export function trackShiprocketAwb(awb: string) {
  return providerRequest<Record<string, unknown>>({
    provider: "shiprocket",
    operation: "TRACK_SHIPMENT",
    endpoint: `${base}/courier/track/awb/${encodeURIComponent(awb)}`,
    headers: { Authorization: `Bearer ${token()}` },
    retry: false
  });
}

export function createShiprocketReturn(payload: Record<string, unknown>) {
  return providerRequest<Record<string, unknown>>({
    provider: "shiprocket",
    operation: "CREATE_RETURN",
    endpoint: `${base}/orders/create/return`,
    method: "POST",
    headers: { Authorization: `Bearer ${token()}` },
    body: payload
  });
}
