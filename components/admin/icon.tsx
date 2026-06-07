"use client";

import * as Icons from "lucide-react";

export function AdminIcon({
  name,
  className = "h-4 w-4"
}: {
  name: string;
  className?: string;
}) {
  const Icon = (Icons as unknown as Record<string, React.ElementType>)[name] ?? Icons.Circle;
  return <Icon className={className} />;
}
