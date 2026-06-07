import { notFound } from "next/navigation";
import { moduleConfigs } from "@/lib/admin-data";
import { ModulePage } from "@/components/admin/module-page";

export default async function AdminModulePage({
  params
}: {
  params: Promise<{ module: string }>;
}) {
  const { module } = await params;
  const config = moduleConfigs[module];
  if (!config) notFound();
  return <ModulePage config={config} />;
}
