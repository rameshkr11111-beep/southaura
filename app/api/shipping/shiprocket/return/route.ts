import { z } from "zod";
import { authorize } from "@/lib/api-auth";
import { createShiprocketReturn } from "@/lib/integrations/shiprocket";

const schema = z.object({ returnOrder: z.record(z.unknown()) });

export async function POST(request: Request) {
  const access = await authorize("delivery:manage");
  if (access.error) return access.error;
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  try {
    return Response.json(await createShiprocketReturn(parsed.data.returnOrder));
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Return pickup failed." }, { status: 503 });
  }
}
