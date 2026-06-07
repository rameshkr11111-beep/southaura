import type { Permission } from "@/lib/rbac";
import { auth } from "@/auth";
import { can } from "@/lib/rbac";

export async function authorize(permission: Permission) {
  const session = await auth();
  if (!session?.user) {
    return {
      error: Response.json({ error: "Unauthorized" }, { status: 401 })
    };
  }
  if (!can(session.user.role, permission)) {
    return {
      error: Response.json(
        { error: "You do not have permission to perform this action." },
        { status: 403 }
      )
    };
  }
  return { session };
}
