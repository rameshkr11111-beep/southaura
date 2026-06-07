import { randomUUID } from "crypto";
import { queueRetry, writeApiLog } from "@/lib/integrations/logging";

export async function providerRequest<T>(input: {
  provider: string;
  operation: string;
  endpoint: string;
  method?: string;
  headers?: HeadersInit;
  body?: unknown;
  timeoutMs?: number;
  retry?: boolean;
}) {
  const requestId = randomUUID();
  const startedAt = Date.now();
  const method = input.method ?? "GET";

  try {
    const response = await fetch(input.endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
        "X-DakshinKart-Request-Id": requestId,
        ...input.headers
      },
      body: input.body === undefined ? undefined : JSON.stringify(input.body),
      signal: AbortSignal.timeout(input.timeoutMs ?? 20000),
      cache: "no-store"
    });
    const text = await response.text();
    let payload: unknown = text;
    try {
      payload = text ? JSON.parse(text) : {};
    } catch {}

    const retryable = response.status === 429 || response.status >= 500;
    await writeApiLog({
      requestId,
      provider: input.provider,
      operation: input.operation,
      method,
      endpoint: input.endpoint,
      status: response.ok ? "SUCCESS" : "FAILED",
      statusCode: response.status,
      durationMs: Date.now() - startedAt,
      requestPayload: input.body,
      responsePayload: payload,
      retryable
    });
    if (!response.ok) {
      const message = `${input.provider} returned HTTP ${response.status}`;
      if (input.retry !== false && retryable) {
        await queueRetry({ provider: input.provider, operation: input.operation, payload: input.body ?? {}, error: message });
      }
      throw new Error(message);
    }
    return payload as T;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Provider request failed";
    await writeApiLog({
      requestId,
      provider: input.provider,
      operation: input.operation,
      method,
      endpoint: input.endpoint,
      status: "FAILED",
      durationMs: Date.now() - startedAt,
      requestPayload: input.body,
      errorMessage: message,
      retryable: true
    });
    if (input.retry !== false) {
      await queueRetry({ provider: input.provider, operation: input.operation, payload: input.body ?? {}, error: message });
    }
    throw error;
  }
}
