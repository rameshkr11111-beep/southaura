"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

const revenue = [
  { day: "May 30", revenue: 520000, orders: 122 },
  { day: "May 31", revenue: 610000, orders: 141 },
  { day: "Jun 1", revenue: 490000, orders: 118 },
  { day: "Jun 2", revenue: 720000, orders: 162 },
  { day: "Jun 3", revenue: 680000, orders: 154 },
  { day: "Jun 4", revenue: 790000, orders: 171 },
  { day: "Jun 5", revenue: 842000, orders: 186 }
];

const channels = [
  { name: "Organic", value: 42, color: "#173c2c" },
  { name: "Direct", value: 24, color: "#d1a95e" },
  { name: "Paid", value: 18, color: "#a84432" },
  { name: "Social", value: 10, color: "#728e78" },
  { name: "Referral", value: 6, color: "#cbd5e1" }
];

const categories = [
  { name: "Coffee", value: 82 },
  { name: "Snacks", value: 68 },
  { name: "Sweets", value: 62 },
  { name: "Sarees", value: 48 },
  { name: "Spices", value: 44 }
];

export function RevenueChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={revenue} margin={{ left: -20, right: 4, top: 10 }}>
        <defs>
          <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#173c2c" stopOpacity={0.22} />
            <stop offset="95%" stopColor="#173c2c" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8ece9" />
        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "#94a3b8" }} />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 9, fill: "#94a3b8" }}
          tickFormatter={(value) => `₹${value / 100000}L`}
        />
        <Tooltip
          contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 11 }}
          formatter={(value) => [`₹${Number(value).toLocaleString("en-IN")}`, "Revenue"]}
        />
        <Area type="monotone" dataKey="revenue" stroke="#173c2c" strokeWidth={2.5} fill="url(#revenueFill)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function TrafficChart() {
  return (
    <div className="grid grid-cols-[150px_1fr] items-center gap-4">
      <ResponsiveContainer width="100%" height={160}>
        <PieChart>
          <Pie data={channels} dataKey="value" innerRadius={48} outerRadius={70} paddingAngle={3}>
            {channels.map((item) => (
              <Cell key={item.name} fill={item.color} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ borderRadius: 10, fontSize: 10 }} />
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-2.5">
        {channels.map((item) => (
          <div key={item.name} className="flex items-center gap-2 text-[10px]">
            <span className="h-2 w-2 rounded-full" style={{ background: item.color }} />
            <span className="flex-1 text-slate-500">{item.name}</span>
            <span className="font-bold text-slate-800">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CategoryChart() {
  return (
    <ResponsiveContainer width="100%" height={190}>
      <BarChart data={categories} layout="vertical" margin={{ left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#edf0ee" />
        <XAxis type="number" hide />
        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={52} tick={{ fontSize: 9, fill: "#64748b" }} />
        <Tooltip contentStyle={{ borderRadius: 10, fontSize: 10 }} />
        <Bar dataKey="value" fill="#d1a95e" radius={[0, 6, 6, 0]} barSize={12} />
      </BarChart>
    </ResponsiveContainer>
  );
}
