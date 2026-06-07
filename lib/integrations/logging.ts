import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const secretKeys = /secret|token|password|authorization|api[_-]?key|signature/i;

export function redact(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(redact);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([key, item]) => [
      key,
      secretKeys.test(key) ? "[REDACTED]" : redact(item)
    ])
  );
}

export async function writeApiLog(input: {
  requestId: string;
  provider: string;
  operation: string;
  method: string;
  endpoint: string;
  status: string;
  statusCode?: number;
  durationMs?: number;
  requestPayload?: unknown;
  responsePayload?: unknown;
  errorMessage?: string;
  retryable?: boolean;
  attempt?: number;
}) {
  try {
    await prisma.apiCallLog.create({
      data: {
        ...input,
        requestPayload: redact(input.requestPayload) as Prisma.InputJsonValue | undefined,
        responsePayload: redact(input.responsePayload) as Prisma.InputJsonValue | undefined
      }
    });
  } catch {
    // Logging becomes durable once PostgreSQL is available.
  }
}

export async function queueRetry(input: {
  provider: string;
  operation: string;
  payload: unknown;
  error: string;
}) {
  try {
    await prisma.integrationRetry.create({
      data: {
        provider: input.provider,
        operation: input.operation,
        payload: redact(input.payload) as Prisma.InputJsonValue,
        lastError: input.error,
        nextRunAt: new Date(Date.now() + 5 * 60 * 1000)
      }
    });
  } catch {
    // Retry persistence becomes active once PostgreSQL is available.
  }
}
