"use client";

import { useTheme } from "@/context/ThemeContext";
import {
  ArrowRightOutlined,
  ArrowUpOutlined,
  BuildOutlined,
  CalendarOutlined,
  CarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EnvironmentOutlined,
  ThunderboltOutlined,
  PlusOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Card, Progress, Tag } from "antd";
import Link from "next/link";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const monthlyData = [
  { month: "Jan", bookings: 580, revenue: 18.4 },
  { month: "Feb", bookings: 640, revenue: 21.2 },
  { month: "Mar", bookings: 720, revenue: 24.8 },
  { month: "Apr", bookings: 690, revenue: 23.6 },
  { month: "May", bookings: 810, revenue: 28.5 },
  { month: "Jun", bookings: 870, revenue: 31.4 },
  { month: "Jul", bookings: 940, revenue: 35.8 },
  { month: "Aug", bookings: 890, revenue: 33.2 },
  { month: "Sep", bookings: 1010, revenue: 38.6 },
  { month: "Oct", bookings: 1120, revenue: 42.1 },
  { month: "Nov", bookings: 1190, revenue: 45.4 },
  { month: "Dec", bookings: 1284, revenue: 48.6 },
];

const bookingStatuses = [
  { name: "Confirmed", value: 742, color: "#0f766e" },
  { name: "Pending", value: 186, color: "#f59e0b" },
  { name: "Completed", value: 294, color: "#3b82f6" },
  { name: "Cancelled", value: 62, color: "#ef4444" },
];

const occupancyData = [
  { day: "Mon", occupancy: 68 },
  { day: "Tue", occupancy: 72 },
  { day: "Wed", occupancy: 70 },
  { day: "Thu", occupancy: 78 },
  { day: "Fri", occupancy: 89 },
  { day: "Sat", occupancy: 96 },
  { day: "Sun", occupancy: 84 },
];

const mobilityDemand = [
  { day: "Mon", hotels: 154, cabs: 162, bikes: 240 },
  { day: "Tue", hotels: 168, cabs: 181, bikes: 268 },
  { day: "Wed", hotels: 149, cabs: 176, bikes: 251 },
  { day: "Thu", hotels: 188, cabs: 205, bikes: 310 },
  { day: "Fri", hotels: 216, cabs: 248, bikes: 382 },
  { day: "Sat", hotels: 254, cabs: 296, bikes: 468 },
  { day: "Sun", hotels: 224, cabs: 272, bikes: 421 },
];

const mobilityServices = [
  { name: "Cab rides", detail: "4-wheel trips", rides: 182, revenue: "₹1.24L", completion: 92, icon: CarOutlined, color: "bg-blue-50 text-blue-700" },
  { name: "Bike rides", detail: "2-wheel trips", rides: 244, revenue: "₹38.6K", completion: 96, icon: ThunderboltOutlined, color: "bg-amber-50 text-amber-700" },
];

const mobilityTrips = [
  { ref: "CAB-9812", type: "Cab", route: "Airport → Koramangala", driver: "Vikram S.", status: "In ride", color: "blue" },
  { ref: "BIK-7461", type: "Bike", route: "MG Road → Indiranagar", driver: "Rahul K.", status: "Arriving", color: "orange" },
  { ref: "CAB-9810", type: "Cab", route: "Whitefield → Airport", driver: "Imran A.", status: "Pickup", color: "gold" },
];

const recentBookings = [
  { ref: "DW-82419", guest: "Aarav Sharma", initials: "AS", hotel: "Taj Lake Palace", city: "Udaipur", dates: "28–31 Oct", guests: "2 guests", amount: 42800, status: "Confirmed" },
  { ref: "DW-82418", guest: "Priya Mehta", initials: "PM", hotel: "The Oberoi, Bengaluru", city: "Bengaluru", dates: "29 Oct–02 Nov", guests: "2 guests", amount: 36200, status: "Pending" },
  { ref: "DW-82417", guest: "Rohan Kapoor", initials: "RK", hotel: "Taj Holiday Village", city: "Goa", dates: "28–30 Oct", guests: "3 guests", amount: 28900, status: "Confirmed" },
  { ref: "DW-82416", guest: "Ananya Iyer", initials: "AI", hotel: "ITC Grand Chola", city: "Chennai", dates: "30 Oct–01 Nov", guests: "1 guest", amount: 19400, status: "Completed" },
  { ref: "DW-82415", guest: "Kabir Verma", initials: "KV", hotel: "The Leela Palace", city: "New Delhi", dates: "31 Oct–03 Nov", guests: "2 guests", amount: 51700, status: "Confirmed" },
];

const topHotels = [
  { name: "Taj Lake Palace", city: "Udaipur", bookings: 186, revenue: "₹18.4L", occupancy: 92, initials: "TL" },
  { name: "The Leela Palace", city: "New Delhi", bookings: 164, revenue: "₹16.8L", occupancy: 88, initials: "LP" },
  { name: "Taj Holiday Village", city: "Goa", bookings: 148, revenue: "₹14.2L", occupancy: 84, initials: "TH" },
  { name: "ITC Grand Chola", city: "Chennai", bookings: 132, revenue: "₹12.6L", occupancy: 79, initials: "IT" },
];

const arrivals = [
  { guest: "Aarav Sharma", hotel: "Taj Lake Palace", time: "12:30 PM", type: "Check-in" },
  { guest: "Rohan Kapoor", hotel: "Taj Holiday Village", time: "02:00 PM", type: "Check-in" },
  { guest: "Meera Nair", hotel: "The Leela Palace", time: "11:00 AM", type: "Check-out" },
];

const money = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const statusStyle = {
  Confirmed: "bg-emerald-50 text-emerald-700",
  Pending: "bg-amber-50 text-amber-700",
  Completed: "bg-blue-50 text-blue-700",
  Cancelled: "bg-rose-50 text-rose-700",
};

function MetricCard({ title, value, change, caption, icon: Icon, color, isDark }) {
  return (
    <Card
      variant="borderless"
      className={`h-full !rounded-2xl !shadow-sm ${isDark ? "!bg-[#102027]" : "!bg-white"}`}
      styles={{ body: { padding: 20 } }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={`m-0 text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>{title}</p>
          <div className={`mt-2 text-[28px] font-semibold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>{value}</div>
        </div>
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg ${color}`}>
          <Icon />
        </span>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
          <ArrowUpOutlined /> {change}
        </span>
        <span className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>{caption}</span>
      </div>
    </Card>
  );
}

function SectionHeading({ title, subtitle, action, isDark }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h2 className={`m-0 text-base font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>{title}</h2>
        {subtitle && <p className={`mb-0 mt-1 text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

const DashboardPage = () => {
  const { isDark } = useTheme();
  const textColor = isDark ? "#cbd5e1" : "#64748b";
  const gridColor = isDark ? "#263940" : "#e8eef0";
  const panelClass = `!rounded-2xl !shadow-sm ${isDark ? "!bg-[#102027]" : "!bg-white"}`;
  const today = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-5 pb-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <h1 className={`m-0 text-2xl font-semibold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
              Hotel overview
            </h1>
            <Tag color="cyan" className="!m-0 !rounded-full !px-2.5 !py-0.5 !text-[11px]">
              Demo data
            </Tag>
          </div>
          <p className={`m-0 text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            {today} <span className="mx-1">·</span> Here's what is happening across your properties.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/dashboard/bookings">
            <Button type="primary" icon={<PlusOutlined />} className="!h-10 !rounded-xl !bg-[#0f766e]">
              Manage bookings
            </Button>
          </Link>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard title="Gross booking value" value="₹48.6L" change="18.6%" caption="vs. last month" icon={BuildOutlined} color="bg-teal-50 text-teal-700" isDark={isDark} />
        <MetricCard title="Total reservations" value="1,284" change="12.4%" caption="this month" icon={CalendarOutlined} color="bg-blue-50 text-blue-700" isDark={isDark} />
        <MetricCard title="Average occupancy" value="76.4%" change="6.2%" caption="across 86 hotels" icon={CheckCircleOutlined} color="bg-violet-50 text-violet-700" isDark={isDark} />
        <MetricCard title="Average booking value" value="₹3,785" change="4.8%" caption="per reservation" icon={UserOutlined} color="bg-amber-50 text-amber-700" isDark={isDark} />
        <MetricCard title="Active hotels" value="86" change="5.2%" caption="properties live" icon={EnvironmentOutlined} color="bg-rose-50 text-rose-700" isDark={isDark} />
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <Card variant="borderless" className={`xl:col-span-8 ${panelClass}`} styles={{ body: { padding: 20 } }}>
          <SectionHeading
            title="Revenue & reservations"
            subtitle="Monthly booking performance · Revenue in lakhs"
            isDark={isDark}
            action={<span className={`rounded-lg px-2.5 py-1.5 text-xs ${isDark ? "bg-[#172e35] text-slate-300" : "bg-slate-50 text-slate-600"}`}>Jan – Dec</span>}
          />
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={monthlyData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid stroke={gridColor} vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: textColor, fontSize: 12 }} />
                <YAxis yAxisId="revenue" axisLine={false} tickLine={false} tick={{ fill: textColor, fontSize: 11 }} tickFormatter={(value) => `₹${value}L`} />
                <YAxis yAxisId="bookings" orientation="right" axisLine={false} tickLine={false} tick={{ fill: textColor, fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: `1px solid ${gridColor}`, background: isDark ? "#102027" : "#fff", color: isDark ? "#fff" : "#0f172a" }}
                  formatter={(value, name) => name === "Revenue" ? [`₹${value}L`, name] : [value, name]}
                />
                <Bar yAxisId="revenue" dataKey="revenue" name="Revenue" fill="#99ded0" radius={[5, 5, 0, 0]} maxBarSize={22} />
                <Area yAxisId="bookings" type="monotone" dataKey="bookings" name="Bookings" stroke="#0f766e" strokeWidth={3} fill="#0f766e" fillOpacity={0.08} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-1 flex flex-wrap gap-5 text-xs">
            <span className="inline-flex items-center gap-2 text-slate-500"><i className="h-2.5 w-2.5 rounded-sm bg-[#99ded0]" /> Revenue</span>
            <span className="inline-flex items-center gap-2 text-slate-500"><i className="h-[3px] w-3 rounded bg-[#0f766e]" /> Reservations</span>
          </div>
        </Card>

        <Card variant="borderless" className={`xl:col-span-4 ${panelClass}`} styles={{ body: { padding: 20 } }}>
          <SectionHeading title="Booking status" subtitle="1,284 reservations in total" isDark={isDark} />
          <div className="relative h-[190px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={bookingStatuses} dataKey="value" nameKey="name" innerRadius={58} outerRadius={82} paddingAngle={3} stroke="none">
                  {bookingStatuses.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <strong className={`text-2xl ${isDark ? "text-white" : "text-slate-900"}`}>1,284</strong>
              <span className="text-xs text-slate-500">Bookings</span>
            </div>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-3">
            {bookingStatuses.map((status) => (
              <div key={status.name} className="flex items-center justify-between gap-2 text-xs">
                <span className="flex items-center gap-2 text-slate-500"><i className="h-2 w-2 rounded-full" style={{ background: status.color }} />{status.name}</span>
                <strong className={isDark ? "text-slate-200" : "text-slate-700"}>{status.value}</strong>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <Card variant="borderless" className={`xl:col-span-7 ${panelClass}`} styles={{ body: { padding: 20 } }}>
          <SectionHeading title="Recent reservations" subtitle="Latest guest bookings across your hotels" isDark={isDark} action={<Link href="/dashboard/bookings" className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700">All bookings <ArrowRightOutlined /></Link>} />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead>
                <tr className={`border-b text-[11px] uppercase tracking-wide ${isDark ? "border-[#263940] text-slate-500" : "border-slate-100 text-slate-400"}`}>
                  <th className="pb-3 pr-3 font-medium">Guest / reference</th>
                  <th className="pb-3 pr-3 font-medium">Hotel</th>
                  <th className="pb-3 pr-3 font-medium">Stay</th>
                  <th className="pb-3 pr-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => (
                  <tr key={booking.ref} className={`border-b last:border-0 ${isDark ? "border-[#263940]" : "border-slate-50"}`}>
                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-2.5">
                        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${isDark ? "bg-[#1b3941] text-teal-200" : "bg-teal-50 text-teal-700"}`}>{booking.initials}</span>
                        <span><strong className={`block text-xs font-medium ${isDark ? "text-slate-200" : "text-slate-800"}`}>{booking.guest}</strong><small className="text-[10px] text-slate-400">{booking.ref}</small></span>
                      </div>
                    </td>
                    <td className="py-3 pr-3"><strong className={`block max-w-[150px] truncate text-xs font-medium ${isDark ? "text-slate-200" : "text-slate-700"}`}>{booking.hotel}</strong><small className="text-[10px] text-slate-400">{booking.city}</small></td>
                    <td className="py-3 pr-3"><span className={`block text-xs ${isDark ? "text-slate-300" : "text-slate-600"}`}>{booking.dates}</span><small className="text-[10px] text-slate-400">{booking.guests}</small></td>
                    <td className={`py-3 pr-3 text-xs font-semibold ${isDark ? "text-slate-200" : "text-slate-800"}`}>{money(booking.amount)}</td>
                    <td className="py-3"><span className={`whitespace-nowrap rounded-full px-2 py-1 text-[10px] font-medium ${statusStyle[booking.status]}`}>{booking.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 xl:col-span-5 xl:grid-cols-1">
          <Card variant="borderless" className={panelClass} styles={{ body: { padding: 20 } }}>
            <SectionHeading title="Today's operations" subtitle="Guest movement across properties" isDark={isDark} />
            <div className="mb-4 grid grid-cols-2 gap-3">
              <div className={`rounded-xl p-3 ${isDark ? "bg-[#172e35]" : "bg-teal-50/70"}`}>
                <div className="flex items-center gap-2 text-xs text-slate-500"><CheckCircleOutlined className="text-teal-700" /> Check-ins</div>
                <strong className={`mt-1 block text-xl ${isDark ? "text-white" : "text-slate-900"}`}>18</strong>
                <span className="text-[10px] text-slate-400">6 still expected</span>
              </div>
              <div className={`rounded-xl p-3 ${isDark ? "bg-[#172e35]" : "bg-amber-50/70"}`}>
                <div className="flex items-center gap-2 text-xs text-slate-500"><CloseCircleOutlined className="text-amber-600" /> Check-outs</div>
                <strong className={`mt-1 block text-xl ${isDark ? "text-white" : "text-slate-900"}`}>12</strong>
                <span className="text-[10px] text-slate-400">3 remaining</span>
              </div>
            </div>
            <div className="space-y-3">
              {arrivals.map((item) => (
                <div key={`${item.guest}-${item.type}`} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <strong className={`block truncate text-xs font-medium ${isDark ? "text-slate-200" : "text-slate-700"}`}>{item.guest}</strong>
                    <span className="block truncate text-[10px] text-slate-400">{item.hotel}</span>
                  </div>
                  <span className="shrink-0 text-right"><span className={`block text-[10px] ${item.type === "Check-in" ? "text-teal-700" : "text-amber-600"}`}>{item.type}</span><small className="text-[10px] text-slate-400">{item.time}</small></span>
                </div>
              ))}
            </div>
          </Card>

          <Card variant="borderless" className={panelClass} styles={{ body: { padding: 20 } }}>
            <SectionHeading title="Occupancy this week" subtitle="Average room occupancy by day" isDark={isDark} action={<span className="text-xs font-semibold text-teal-700">76.4% avg.</span>} />
            <div className="h-[145px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={occupancyData} margin={{ top: 8, right: 4, left: -25, bottom: 0 }}>
                  <defs><linearGradient id="occupancyFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0f766e" stopOpacity={0.24} /><stop offset="95%" stopColor="#0f766e" stopOpacity={0.01} /></linearGradient></defs>
                  <CartesianGrid stroke={gridColor} vertical={false} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: textColor, fontSize: 10 }} />
                  <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: textColor, fontSize: 10 }} tickFormatter={(value) => `${value}%`} />
                  <Tooltip formatter={(value) => [`${value}%`, "Occupancy"]} />
                  <Area type="monotone" dataKey="occupancy" stroke="#0f766e" strokeWidth={2.5} fill="url(#occupancyFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <Card variant="borderless" className={`xl:col-span-8 ${panelClass}`} styles={{ body: { padding: 20 } }}>
          <SectionHeading title="Top performing hotels" subtitle="Ranked by monthly booking revenue" isDark={isDark} action={<Link href="/dashboard/bookings" className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700">View bookings <ArrowRightOutlined /></Link>} />
          <div className="space-y-4">
            {topHotels.map((hotel, index) => (
              <div key={hotel.name} className="grid grid-cols-[32px_minmax(150px,1.4fr)_0.7fr_0.7fr_minmax(100px,1fr)] items-center gap-3">
                <span className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold ${index === 0 ? "bg-amber-50 text-amber-700" : isDark ? "bg-[#172e35] text-slate-300" : "bg-slate-100 text-slate-500"}`}>{hotel.initials}</span>
                <span className="min-w-0"><strong className={`block truncate text-xs font-medium ${isDark ? "text-slate-200" : "text-slate-800"}`}>{hotel.name}</strong><small className="text-[10px] text-slate-400"><EnvironmentOutlined className="mr-1" />{hotel.city}</small></span>
                <span><strong className={`block text-xs ${isDark ? "text-slate-200" : "text-slate-700"}`}>{hotel.bookings}</strong><small className="text-[10px] text-slate-400">bookings</small></span>
                <strong className={`text-xs ${isDark ? "text-slate-200" : "text-slate-700"}`}>{hotel.revenue}</strong>
                <span><Progress percent={hotel.occupancy} size="small" showInfo={false} strokeColor="#0f766e" /><small className="text-[10px] text-slate-400">{hotel.occupancy}% occupied</small></span>
              </div>
            ))}
          </div>
        </Card>

        <Card variant="borderless" className={`xl:col-span-4 ${panelClass}`} styles={{ body: { padding: 20 } }}>
          <SectionHeading title="Booking insights" subtitle="A quick view of guest and inventory health" isDark={isDark} />
          <div className="space-y-4">
            <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-xs text-slate-500"><UserOutlined /> Repeat guests</span><strong className={isDark ? "text-slate-200" : "text-slate-800"}>22.8%</strong></div>
            <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-xs text-slate-500"><CalendarOutlined /> Average stay</span><strong className={isDark ? "text-slate-200" : "text-slate-800"}>2.8 nights</strong></div>
            <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-xs text-slate-500"><CloseCircleOutlined /> Cancellation rate</span><strong className="text-rose-600">4.8%</strong></div>
            <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-xs text-slate-500"><BuildOutlined /> Active properties</span><strong className={isDark ? "text-slate-200" : "text-slate-800"}>86 hotels</strong></div>
            <div className={`rounded-xl p-3 text-xs ${isDark ? "bg-[#172e35] text-slate-300" : "bg-teal-50 text-teal-900"}`}>
              <span className="font-semibold">Peak check-in day</span><span className="float-right">Saturday · 96%</span>
            </div>
          </div>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className={`m-0 text-lg font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                Mobility overview
              </h2>
              <Tag color="purple" className="!m-0 !rounded-full !text-[10px]">
                Future module · Demo data
              </Tag>
            </div>
            <p className={`mb-0 mt-1 text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Sample cab and bike operations, ready for the upcoming mobility module.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard title="Rides today" value="426" change="14.2%" caption="cab + bike trips" icon={CarOutlined} color="bg-blue-50 text-blue-700" isDark={isDark} />
          <MetricCard title="Drivers online" value="138" change="8.1%" caption="across 12 cities" icon={UserOutlined} color="bg-violet-50 text-violet-700" isDark={isDark} />
          <MetricCard title="Pickup success" value="94.2%" change="2.6%" caption="accepted within 5 min" icon={CheckCircleOutlined} color="bg-teal-50 text-teal-700" isDark={isDark} />
          <MetricCard title="Average ride rating" value="4.8 / 5" change="0.3%" caption="from 392 ratings" icon={ThunderboltOutlined} color="bg-amber-50 text-amber-700" isDark={isDark} />
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
          <Card variant="borderless" className={`xl:col-span-7 ${panelClass}`} styles={{ body: { padding: 20 } }}>
            <SectionHeading
              title="Demand by service"
              subtitle="Daily hotel reservations, cab rides and bike rides"
              isDark={isDark}
              action={<span className="text-[10px] text-slate-400">Sample weekly volume</span>}
            />
            <div className="h-[265px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mobilityDemand} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                  <CartesianGrid stroke={gridColor} vertical={false} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: textColor, fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: textColor, fontSize: 10 }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: `1px solid ${gridColor}`, background: isDark ? "#102027" : "#fff" }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 11, color: textColor }} />
                  <Bar dataKey="hotels" name="Hotel bookings" fill="#0f766e" radius={[4, 4, 0, 0]} maxBarSize={18} />
                  <Bar dataKey="cabs" name="Cab rides" fill="#60a5fa" radius={[4, 4, 0, 0]} maxBarSize={18} />
                  <Bar dataKey="bikes" name="Bike rides" fill="#fbbf24" radius={[4, 4, 0, 0]} maxBarSize={18} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card variant="borderless" className={`xl:col-span-5 ${panelClass}`} styles={{ body: { padding: 20 } }}>
            <SectionHeading title="Mobility service mix" subtitle="Sample trips and gross value today" isDark={isDark} />
            <div className="space-y-5">
              {mobilityServices.map((service) => {
                const ServiceIcon = service.icon;
                return (
                  <div key={service.name}>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${service.color}`}><ServiceIcon /></span>
                        <span className="min-w-0"><strong className={`block text-xs ${isDark ? "text-slate-200" : "text-slate-800"}`}>{service.name}</strong><small className="text-[10px] text-slate-400">{service.detail}</small></span>
                      </div>
                      <span className="text-right"><strong className={`block text-sm ${isDark ? "text-slate-100" : "text-slate-900"}`}>{service.revenue}</strong><small className="text-[10px] text-slate-400">gross value</small></span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span>{service.rides} rides</span>
                      <span>{service.completion}% completed</span>
                    </div>
                    <Progress percent={service.completion} size="small" showInfo={false} strokeColor={service.name === "Cab rides" ? "#3b82f6" : "#f59e0b"} />
                  </div>
                );
              })}
              <div className={`flex items-center justify-between rounded-xl p-3 ${isDark ? "bg-[#172e35]" : "bg-slate-50"}`}>
                <span className="text-xs text-slate-500">Combined mobility trips</span>
                <strong className={isDark ? "text-slate-200" : "text-slate-800"}>426 today</strong>
              </div>
            </div>
          </Card>
        </div>

        <Card variant="borderless" className={panelClass} styles={{ body: { padding: 20 } }}>
          <SectionHeading title="Active ride sample" subtitle="Example dispatch view for the planned cab and bike module" isDark={isDark} action={<span className="inline-flex items-center gap-1 text-xs text-slate-400"><span className="h-2 w-2 rounded-full bg-amber-400" /> Preview only</span>} />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] border-collapse text-left text-sm">
              <thead>
                <tr className={`border-b text-[11px] uppercase tracking-wide ${isDark ? "border-[#263940] text-slate-500" : "border-slate-100 text-slate-400"}`}>
                  <th className="pb-3 pr-4 font-medium">Trip</th>
                  <th className="pb-3 pr-4 font-medium">Service</th>
                  <th className="pb-3 pr-4 font-medium">Route</th>
                  <th className="pb-3 pr-4 font-medium">Driver</th>
                  <th className="pb-3 font-medium">Live status</th>
                </tr>
              </thead>
              <tbody>
                {mobilityTrips.map((trip) => (
                  <tr key={trip.ref} className={`border-b last:border-0 ${isDark ? "border-[#263940]" : "border-slate-50"}`}>
                    <td className={`py-3 pr-4 text-xs font-semibold ${isDark ? "text-slate-200" : "text-slate-800"}`}>{trip.ref}</td>
                    <td className="py-3 pr-4"><Tag color={trip.type === "Cab" ? "blue" : "gold"} className="!m-0 !rounded-full">{trip.type}</Tag></td>
                    <td className={`py-3 pr-4 text-xs ${isDark ? "text-slate-300" : "text-slate-600"}`}>{trip.route}</td>
                    <td className={`py-3 pr-4 text-xs ${isDark ? "text-slate-300" : "text-slate-600"}`}>{trip.driver}</td>
                    <td className="py-3"><Tag color={trip.color} className="!m-0 !rounded-full">{trip.status}</Tag></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default DashboardPage;
