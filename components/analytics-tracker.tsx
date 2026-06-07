"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

function sessionId() {
  const key = "southaura-analytics-session";
  const existing = sessionStorage.getItem(key);
  if (existing) return existing;
  const created = crypto.randomUUID();
  sessionStorage.setItem(key, created);
  return created;
}

export function trackCommerceEvent(
  eventName: "page_view" | "view_item" | "add_to_cart" | "begin_checkout" | "purchase" | "search" | "generate_lead",
  data: Record<string, unknown> = {}
) {
  if (typeof window === "undefined") return;
  const payload = JSON.stringify({
    eventName,
    sessionId: sessionId(),
    page: window.location.pathname,
    ...data
  });
  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/analytics/events", new Blob([payload], { type: "application/json" }));
  } else {
    void fetch("/api/analytics/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true
    });
  }
}

export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    trackCommerceEvent("page_view", {
      metadata: {
        title: document.title,
        query: window.location.search
      }
    });
  }, [pathname]);

  return null;
}
