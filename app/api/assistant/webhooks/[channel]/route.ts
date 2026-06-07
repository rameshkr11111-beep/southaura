import { NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ channel: string }> }) {
  const { channel } = await params;
  const challenge = request.nextUrl.searchParams.get("hub.challenge");
  const token = request.nextUrl.searchParams.get("hub.verify_token");
  if (challenge && token === process.env.META_WEBHOOK_VERIFY_TOKEN) {
    return new Response(challenge);
  }
  return Response.json({ channel, ready: true });
}

export async function POST(request: Request, { params }: { params: Promise<{ channel: string }> }) {
  const { channel } = await params;
  const payload = await request.json();
  // Provider signature verification and outbound delivery are required before production use.
  return Response.json({ accepted: true, channel, received: Boolean(payload) }, { status: 202 });
}
