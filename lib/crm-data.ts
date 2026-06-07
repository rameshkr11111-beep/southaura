export const crmCustomers = [
  {
    id: "meera-khanna",
    name: "Meera Khanna",
    email: "meera@example.com",
    phone: "+91 98111 22334",
    location: "Gurugram, Haryana",
    segment: "VIP",
    tags: ["Coffee Lover", "Repeat Buyer"],
    orders: 18,
    spent: "₹42,680",
    ltv: "₹58,400",
    lastOrder: "Today, 10:42 AM",
    status: "Active",
    initials: "MK"
  },
  {
    id: "arjun-malhotra",
    name: "Arjun Malhotra",
    email: "arjun@example.ca",
    phone: "+1 647 555 0182",
    location: "Toronto, Canada",
    segment: "International",
    tags: ["High AOV", "Gift Buyer"],
    orders: 9,
    spent: "₹38,220",
    ltv: "₹51,600",
    lastOrder: "Today, 10:30 AM",
    status: "Active",
    initials: "AM"
  },
  {
    id: "naina-kapoor",
    name: "Naina Kapoor",
    email: "naina@northstar.in",
    phone: "+91 98990 44771",
    location: "New Delhi",
    segment: "Corporate",
    tags: ["VIP", "Bulk Orders"],
    orders: 12,
    spent: "₹1,28,400",
    ltv: "₹2,10,000",
    lastOrder: "Today, 10:14 AM",
    status: "VIP",
    initials: "NK"
  },
  {
    id: "dev-menon",
    name: "Dev Menon",
    email: "dev@example.com",
    phone: "+91 98450 88762",
    location: "Bengaluru, Karnataka",
    segment: "Repeat",
    tags: ["Ayurveda", "Organic"],
    orders: 7,
    spent: "₹18,640",
    ltv: "₹24,800",
    lastOrder: "Yesterday",
    status: "Active",
    initials: "DM"
  },
  {
    id: "rhea-singh",
    name: "Rhea Singh",
    email: "rhea@example.com",
    phone: "+91 99710 22654",
    location: "Noida, Uttar Pradesh",
    segment: "At risk",
    tags: ["Win Back", "Snacks"],
    orders: 3,
    spent: "₹4,120",
    ltv: "₹7,600",
    lastOrder: "94 days ago",
    status: "At risk",
    initials: "RS"
  }
];

export const crmTasks = [
  { customer: "Meera Khanna", title: "Confirm replacement delivery", due: "Today, 2:00 PM", owner: "Asha", priority: "High" },
  { customer: "Naina Kapoor", title: "Share corporate gifting proposal", due: "Today, 4:30 PM", owner: "Rahul", priority: "High" },
  { customer: "Rhea Singh", title: "Win-back call after 90 days", due: "Overdue by 2 days", owner: "Asha", priority: "Medium" },
  { customer: "Arjun Malhotra", title: "Check international delivery feedback", due: "Tomorrow", owner: "Mina", priority: "Low" }
];

export const crmConversations = [
  { customer: "Meera Khanna", channel: "WhatsApp", preview: "Thank you, please send the replacement to the same address.", time: "4 min", unread: 2 },
  { customer: "Arjun Malhotra", channel: "Email", preview: "Can you confirm customs duties for the next order?", time: "18 min", unread: 1 },
  { customer: "Naina Kapoor", channel: "WhatsApp", preview: "We need 60 gift boxes delivered to three offices.", time: "42 min", unread: 3 },
  { customer: "Dev Menon", channel: "Support", preview: "The oil arrived safely. Can I subscribe monthly?", time: "1 hr", unread: 0 }
];

export const abandonedCarts = [
  { customer: "Priya Sharma", contact: "+91 98200 11234", items: "Filter Coffee, Banana Chips", value: "₹1,248", age: "38 min", probability: "High" },
  { customer: "Rohan Gupta", contact: "rohan@example.com", items: "Kanchipuram Silk Stole", value: "₹3,490", age: "1 hr", probability: "High" },
  { customer: "Sara Thomas", contact: "+971 50 555 0192", items: "Ayurveda Ritual Set", value: "₹2,180", age: "3 hrs", probability: "Medium" },
  { customer: "Guest checkout", contact: "vikas@example.com", items: "Mysore Pak × 2", value: "₹1,398", age: "5 hrs", probability: "Medium" }
];
