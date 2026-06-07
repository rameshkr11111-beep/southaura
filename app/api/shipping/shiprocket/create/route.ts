import { z } from "zod";
import { authorize } from "@/lib/api-auth";
import { assignShiprocketAwb, createShiprocketShipment } from "@/lib/integrations/shiprocket";

const schema = z.object({
  order: z.record(z.unknown()),
  assignAwb: z.boolean().default(true)
});

export async function POST(request: Request) {
  const access = await authorize("delivery:manage");
  if (access.error) return access.error;
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  try {
    const shipment = await createShiprocketShipment(parsed.data.order);
    const shipmentId = String(shipment.shipment_id ?? shipment.shipmentId ?? "");
    const awb = parsed.data.assignAwb && shipmentId
      ? await assignShiprocketAwb(shipmentId)
      : null;
    return Response.json({ shipment, awb });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Shipment creation failed." }, { status: 503 });
  }
}
