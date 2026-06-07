import { notFound } from "next/navigation";
import { VendorModulePage } from "@/components/vendor/vendor-module-page";
import { vendorModules } from "@/lib/vendor-data";

export default async function VendorModuleRoute({ params }: { params: Promise<{ module: string }> }) {
  const { module } = await params;
  if (!vendorModules[module]) notFound();
  return <VendorModulePage module={module} />;
}
