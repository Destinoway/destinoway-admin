import {
  BookOutlined,
  CalendarOutlined,
  DashboardOutlined,
  DollarOutlined,
  FileTextOutlined,
  UserAddOutlined,
  UserOutlined,
} from "@ant-design/icons";

import Link from "next/link";

export const menuItems = [
  {
    key: "/dashboard",
    icon: <DashboardOutlined />,
    label: <Link href="/dashboard">Dashboard</Link>,
    module: "dashboard",
  },

  {
    key: "/dashboard/user-query",
    icon: <UserOutlined />,
    label: <Link href="/dashboard/user-query">User Query</Link>,
    module: "userQuery", // ✅ FIX
  },

  {
    key: "/dashboard/bookings",
    icon: <BookOutlined />,
    label: <Link href="/dashboard#">Bookings</Link>,
    module: "Bookings",
  },

  {
    key: "/dashboard/staff",
    icon: <UserAddOutlined />,
    label: "Staff Management",
    children: [
      {
        key: "/dashboard/staff/roles",
        label: <Link href="/dashboard/staff/roles">Roles</Link>,
        module: "roles", // ✅ ADD
      },
      {
        key: "/dashboard/staff/users",
        label: <Link href="/dashboard/staff/users">Staff</Link>,
        module: "users", // ✅ ADD
      },
    ],
  },

  {
    key: "/dashboard/Markups",
    icon: <CalendarOutlined />,
    label: <Link href="/dashboard/Markups">Markup</Link>,
    module: "Markups", // ✅ FIX
  },
  {
    key: "/dashboard/coupon-codes",
    icon: <CalendarOutlined />,
    label: <Link href="/dashboard/coupon-codes">Coupon-Codes</Link>,
    module: "couponCodes", // ✅ FIX
  },
  {
    key: "/dashboard/cms",
    icon: <FileTextOutlined />,
    label: "CMS",
    children: [
      {
        key: "/dashboard/cms/pages",
        label: <Link href="/dashboard/cms/pages">All Pages</Link>,
        module: "cmsPages",
      },

      {
        key: "/dashboard/cms/create",
        label: <Link href="/dashboard/cms/create">Create Pages</Link>,
        module: "cmsPages",
      },
    ],
  },

  {
    key: "/dashboard/customers",
    icon: <UserOutlined />,
    label: <Link href="/dashboard/customers">Customers</Link>,
    module: "customers", // ✅ FIX
  },

  {
    key: "/dashboard/revenue",
    icon: <DollarOutlined />,
    label: <Link href="/dashboard#">Revenue</Link>,
    module: "Revenue", // ✅ FIX
  },
];
