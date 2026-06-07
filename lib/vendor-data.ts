import {
  BadgeIndianRupee,
  BarChart3,
  Boxes,
  CircleDollarSign,
  ClipboardList,
  CreditCard,
  Gift,
  LayoutDashboard,
  MessageSquareText,
  PackageCheck,
  RotateCcw,
  Settings,
  ShoppingBag,
  Store,
  Tags,
  Truck,
  Users
} from "lucide-react";

export const vendorNavigation = [
  { label: "Overview", href: "/vendor", icon: LayoutDashboard },
  { label: "Shop setup", href: "/vendor/shop", icon: Store },
  { label: "Products", href: "/vendor/products", icon: Boxes, badge: "24" },
  { label: "Inventory", href: "/vendor/inventory", icon: PackageCheck, badge: "3 low" },
  { label: "Orders", href: "/vendor/orders", icon: ShoppingBag, badge: "8" },
  { label: "Shipping", href: "/vendor/shipping", icon: Truck },
  { label: "Returns", href: "/vendor/returns", icon: RotateCcw },
  { label: "Customers", href: "/vendor/customers", icon: Users },
  { label: "Coupons", href: "/vendor/coupons", icon: Tags },
  { label: "Marketing", href: "/vendor/marketing", icon: Gift },
  { label: "Reviews", href: "/vendor/reviews", icon: MessageSquareText },
  { label: "Analytics", href: "/vendor/analytics", icon: BarChart3 },
  { label: "Payouts", href: "/vendor/payouts", icon: CircleDollarSign },
  { label: "Tax & invoices", href: "/vendor/finance", icon: BadgeIndianRupee },
  { label: "Plans & billing", href: "/vendor/billing", icon: CreditCard },
  { label: "Settings", href: "/vendor/settings", icon: Settings }
];

export const vendorModules: Record<string, {
  title: string;
  eyebrow: string;
  description: string;
  action: string;
  stats: [string, string, string][];
}> = {
  shop: { title: "Shop setup", eyebrow: "Brand and storefront", description: "Manage your shop identity, policies, contact details, documents and marketplace visibility.", action: "Edit shop profile", stats: [["Profile completion", "82%", "Add bank verification"], ["Shop status", "Pending review", "2 checks remaining"], ["Public URL", "/shops/ananya-foods", "Reserved"]] },
  products: { title: "Products", eyebrow: "Catalogue", description: "Create products, variants, images, pricing, SEO, attributes and marketplace submissions.", action: "Add product", stats: [["Active", "18", "+3 this month"], ["Draft", "4", "Needs completion"], ["Under review", "2", "Usually 24 hours"]] },
  inventory: { title: "Inventory", eyebrow: "Stock control", description: "Track sellable stock, low-stock thresholds, damaged units and inventory adjustments.", action: "Update stock", stats: [["Units available", "1,284", "Across 24 SKUs"], ["Low stock", "3", "Action recommended"], ["Out of stock", "1", "Listing paused"]] },
  orders: { title: "Orders", eyebrow: "Sales operations", description: "Process new orders, print invoices, pack items and hand shipments to courier partners.", action: "View new orders", stats: [["New orders", "8", "₹18,420 value"], ["To dispatch", "5", "Before 4 PM"], ["Delivered", "126", "This month"]] },
  shipping: { title: "Shipping", eyebrow: "Fulfilment", description: "Configure pickup locations, shipping labels, courier handover, tracking and delivery service levels.", action: "Create shipment", stats: [["Ready to ship", "5", "Labels pending"], ["In transit", "17", "All on schedule"], ["Delivery success", "96.8%", "+1.4% this month"]] },
  returns: { title: "Returns", eyebrow: "Post-purchase", description: "Review return requests, coordinate pickup, inspect received items and track approved refunds.", action: "Review returns", stats: [["Open requests", "2", "Respond today"], ["Return rate", "1.6%", "Below category average"], ["Refund pending", "₹1,198", "Admin approval"]] },
  customers: { title: "Customers", eyebrow: "Buyer relationships", description: "Understand repeat buyers, order history, locations and permitted customer communications.", action: "View segments", stats: [["Customers", "438", "+34 this month"], ["Repeat rate", "28%", "+4.2%"], ["Average order", "₹1,486", "+₹118"]] },
  coupons: { title: "Coupons", eyebrow: "Offers", description: "Create shop-funded percentage, fixed-price, first-order and seasonal discount proposals.", action: "Create coupon", stats: [["Active offers", "3", "2 shop funded"], ["Redemptions", "86", "This month"], ["Offer revenue", "₹74,320", "6.8x return"]] },
  marketing: { title: "Marketing", eyebrow: "Growth", description: "Prepare festival campaigns, sponsored listings, product bundles and marketplace promotion requests.", action: "Create campaign", stats: [["Campaigns", "4", "1 scheduled"], ["Product views", "18.4K", "+22%"], ["Attributed sales", "₹96,800", "This month"]] },
  reviews: { title: "Reviews", eyebrow: "Reputation", description: "Read verified reviews, reply publicly, report policy violations and monitor rating trends.", action: "Reply to reviews", stats: [["Shop rating", "4.8", "216 reviews"], ["Awaiting reply", "7", "Respond this week"], ["Positive", "94%", "+2%"]] },
  analytics: { title: "Analytics", eyebrow: "Business intelligence", description: "Monitor sales, traffic, conversion, product performance, geography and customer retention.", action: "Export report", stats: [["Revenue", "₹3.42L", "+18.6%"], ["Conversion", "4.7%", "+0.8%"], ["Units sold", "284", "+31"]] },
  payouts: { title: "Payouts", eyebrow: "Settlement", description: "Track marketplace fees, shipping charges, deductions, upcoming settlements and bank transfers.", action: "View statement", stats: [["Next payout", "₹42,860", "12 Jun 2026"], ["Processing", "₹18,420", "8 orders"], ["Paid lifetime", "₹12.84L", "42 settlements"]] },
  finance: { title: "Tax & invoices", eyebrow: "Compliance", description: "Manage GST information, download settlement invoices and review tax collected on marketplace orders.", action: "Download GST report", stats: [["Tax collected", "₹18,460", "Current month"], ["Invoices", "126", "All generated"], ["GST status", "Verified", "Last checked 2 Jun"]] },
  billing: { title: "Plans & billing", eyebrow: "Subscription", description: "Review commission, subscription plan, promoted listing charges and billing documents.", action: "Manage plan", stats: [["Current plan", "Growth", "₹1,499/month"], ["Commission", "12%", "Category standard"], ["Next bill", "1 Jul 2026", "Auto-pay active"]] },
  settings: { title: "Settings", eyebrow: "Account controls", description: "Manage team access, notifications, security, integrations, return rules and holiday mode.", action: "Save settings", stats: [["Team members", "3", "2 roles"], ["2-step security", "Enabled", "Recommended"], ["Integrations", "4", "2 connected"]] }
};

export const vendorOrders = [
  ["SA-10842", "Meera Khanna", "₹2,348", "PACKING", "Today, 10:42"],
  ["SA-10837", "Rohan Mehta", "₹1,497", "NEW", "Today, 09:18"],
  ["SA-10811", "Nisha Kapoor", "₹3,195", "READY TO SHIP", "Yesterday"],
  ["SA-10796", "Aarav Shah", "₹899", "SHIPPED", "Yesterday"]
];

export const vendorProducts = [
  ["Kerala Banana Chips Reserve", "AF-SN-101", "₹349", "186", "ACTIVE"],
  ["Pepper Murukku Family Pack", "AF-SN-104", "₹499", "42", "ACTIVE"],
  ["Traditional Jackfruit Chips", "AF-SN-108", "₹429", "8", "LOW STOCK"],
  ["Coconut Jaggery Bites", "AF-SW-112", "₹389", "0", "OUT OF STOCK"]
];
