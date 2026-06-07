import { providerRequest } from "@/lib/integrations/http";

export function publishFacebookPost(input: { message: string; link?: string }) {
  const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  const pageId = process.env.FACEBOOK_PAGE_ID;
  if (!token || !pageId) throw new Error("Facebook Page is not configured.");
  return providerRequest<Record<string, unknown>>({
    provider: "facebook",
    operation: "PUBLISH_POST",
    endpoint: `https://graph.facebook.com/v21.0/${pageId}/feed`,
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: input
  });
}

export async function publishInstagramPost(input: { caption: string; imageUrl: string }) {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const accountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
  if (!token || !accountId) throw new Error("Instagram Business is not configured.");
  const container = await providerRequest<{ id: string }>({
    provider: "instagram",
    operation: "CREATE_MEDIA_CONTAINER",
    endpoint: `https://graph.facebook.com/v21.0/${accountId}/media`,
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: { image_url: input.imageUrl, caption: input.caption }
  });
  return providerRequest<Record<string, unknown>>({
    provider: "instagram",
    operation: "PUBLISH_MEDIA",
    endpoint: `https://graph.facebook.com/v21.0/${accountId}/media_publish`,
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: { creation_id: container.id }
  });
}
