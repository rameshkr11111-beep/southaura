import type { Role } from "@prisma/client";

export type Permission =
  | "dashboard:view"
  | "catalog:manage"
  | "orders:manage"
  | "customers:manage"
  | "marketing:manage"
  | "content:manage"
  | "delivery:manage"
  | "finance:manage"
  | "settings:manage"
  | "users:manage"
  | "security:manage"
  | "agent:use"
  | "agent:approve"
  | "agent:configure";

const allPermissions: Permission[] = [
  "dashboard:view",
  "catalog:manage",
  "orders:manage",
  "customers:manage",
  "marketing:manage",
  "content:manage",
  "delivery:manage",
  "finance:manage",
  "settings:manage",
  "users:manage",
  "security:manage",
  "agent:use",
  "agent:approve",
  "agent:configure"
];

export const rolePermissions: Record<Role, Permission[]> = {
  CUSTOMER: [],
  VENDOR: [],
  SUPER_ADMIN: allPermissions,
  ADMIN: allPermissions.filter((permission) => permission !== "security:manage"),
  MANAGER: [
    "dashboard:view",
    "catalog:manage",
    "orders:manage",
    "customers:manage",
    "delivery:manage",
    "finance:manage",
    "agent:use"
  ],
  MARKETING_EXECUTIVE: [
    "dashboard:view",
    "customers:manage",
    "marketing:manage",
    "content:manage",
    "agent:use"
  ],
  DELIVERY_MANAGER: ["dashboard:view", "orders:manage", "delivery:manage", "agent:use"],
  CUSTOMER_SUPPORT: ["dashboard:view", "orders:manage", "customers:manage", "agent:use"],
  CONTENT_WRITER: ["dashboard:view", "content:manage", "agent:use"]
};

export function can(role: Role, permission: Permission) {
  return rolePermissions[role]?.includes(permission) ?? false;
}

export const roleLabels: Record<Role, string> = {
  CUSTOMER: "Customer",
  VENDOR: "Vendor",
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  MANAGER: "Manager",
  MARKETING_EXECUTIVE: "Marketing Executive",
  DELIVERY_MANAGER: "Delivery Manager",
  CUSTOMER_SUPPORT: "Customer Support",
  CONTENT_WRITER: "Content Writer"
};
