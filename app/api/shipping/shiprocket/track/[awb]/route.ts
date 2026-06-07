import { trackShiprocketAwb } from "@/lib/integrations/shiprocket";

export async function GET(_: Request, { params }: { params: Promise<{ awb: string }> }) {
  const { awb } = await params;
  try {
    return Response.json(await trackShiprocketAwb(awb));
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Tracking failed." }, { status: 503 });
  }
}
