"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export function CustomerAccountActions() {
  return (
    <button type="button" onClick={() => signOut({ callbackUrl: "/" })} className="button-secondary !px-4 !py-2.5">
      <LogOut className="h-4 w-4" /> Sign out
    </button>
  );
}
