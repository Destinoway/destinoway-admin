"use client";

import { useTheme } from "@/context/ThemeContext";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Card, Col, Row, Select, Table } from "antd";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const DashboardPage = () => {
  const { isDark } = useTheme();

  const axisColor = "#9ca3af";

  // ================= DATA =================

  const growthData = [
    { name: "Jan", users: 1200 },
    { name: "Feb", users: 1800 },
    { name: "Mar", users: 1500 },
    { name: "Apr", users: 2200 },
    { name: "May", users: 2600 },
  ];

  const bookingData = [
    { name: "Mon", bookings: 120 },
    { name: "Tue", bookings: 200 },
    { name: "Wed", bookings: 150 },
    { name: "Thu", bookings: 280 },
    { name: "Fri", bookings: 230 },
  ];

  const miniData = [{ v: 10 }, { v: 20 }, { v: 15 }, { v: 30 }, { v: 25 }];

  const tableData = [
    {
      key: 1,
      hotel: "Hotel Royal",
      bookings: 120,
      revenue: "₹12,000",
    },
    {
      key: 2,
      hotel: "City Inn",
      bookings: 90,
      revenue: "₹9,500",
    },
    {
      key: 3,
      hotel: "Luxury Stay",
      bookings: 60,
      revenue: "₹15,000",
    },
  ];

  const columns = [
    {
      title: "Hotel",
      dataIndex: "hotel",
    },
    {
      title: "Bookings",
      dataIndex: "bookings",
    },
    {
      title: "Revenue",
      dataIndex: "revenue",
    },
  ];

  // ================= STAT CARDS =================

  const stats = [
    {
      title: "Revenue",
      value: "₹2,45,000",
      today: "₹12,400 today",
      change: "+12%",
      positive: true,
    },
    {
      title: "Bookings",
      value: "1,240",
      today: "86 today",
      change: "+8%",
      positive: true,
    },
    {
      title: "Users",
      value: "3,560",
      today: "45 new",
      change: "-3%",
      positive: false,
    },
    {
      title: "Conversion",
      value: "4.8%",
      today: "0.3% today",
      change: "+1.2%",
      positive: true,
    },
  ];

  return (
    <div className="w-full">
      {/* ================= HEADER ================= */}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2
          className={`
            m-0
            text-xl
            font-semibold
            ${isDark ? "text-white" : "text-[#1f2937]"}
          `}
        >
          Dashboard
        </h2>

        <Select
          defaultValue="month"
          className="w-[140px]"
          options={[
            {
              value: "week",
              label: "This Week",
            },
            {
              value: "month",
              label: "This Month",
            },
            {
              value: "year",
              label: "This Year",
            },
          ]}
        />
      </div>

      {/* ================= STAT CARDS ================= */}

      <Row gutter={[16, 16]} className="mt-4">
        {stats.map((item, index) => (
          <Col xs={24} sm={12} md={12} lg={6} key={index}>
            <Card
              variant="borderless"
              className={`
                !overflow-hidden
                !rounded-[5px]
                ${
                  isDark
                    ? "!bg-[#102027] shadow-[0_8px_30px_rgba(0,0,0,0.25)]"
                    : "!bg-white shadow-[0_8px_30px_rgba(15,106,117,0.05)]"
                }
              `}
            >
              {/* Card Top */}
              <div className="flex items-center justify-between">
                <p
                  className={`
                    m-0
                    text-[13px]
                    ${isDark ? "text-gray-400" : "text-gray-500"}
                  `}
                >
                  {item.title}
                </p>

                <span
                  className={`
                    flex
                    items-center
                    gap-1
                    text-xs
                    font-medium
                    ${item.positive ? "text-green-600" : "text-red-600"}
                  `}
                >
                  {item.positive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}

                  {item.change}
                </span>
              </div>

              {/* Main Value */}
              <h2
                className={`
                  my-1.5
                  text-2xl
                  font-semibold
                  ${isDark ? "text-white" : "text-[#1f2937]"}
                `}
              >
                {item.value}
              </h2>

              {/* Today */}
              <p className="m-0 text-xs text-gray-400">{item.today}</p>

              {/* Mini Chart */}
              <div className="mt-2 h-10 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={miniData}>
                    <Area
                      type="monotone"
                      dataKey="v"
                      stroke={item.positive ? "#16a34a" : "#dc2626"}
                      fill={
                        item.positive
                          ? "rgba(22,163,74,0.1)"
                          : "rgba(220,38,38,0.1)"
                      }
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* ================= CHARTS ================= */}

      <Row gutter={[16, 16]} className="mt-5">
        {/* USER GROWTH */}

        <Col xs={24} lg={16}>
          <Card
            title="User Growth"
            variant="borderless"
            className={`
              !rounded-[5px]
              ${
                isDark
                  ? "!bg-[#102027] shadow-[0_8px_30px_rgba(0,0,0,0.25)]"
                  : "!bg-white shadow-[0_8px_30px_rgba(15,106,117,0.05)]"
              }
            `}
          >
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={growthData}>
                  <XAxis stroke={axisColor} dataKey="name" />

                  <YAxis stroke={axisColor} />

                  <Tooltip />

                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="#0F6A75"
                    fill="#72C0F0"
                    fillOpacity={0.18}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* BOOKINGS */}

        <Col xs={24} lg={8}>
          <Card
            title="Bookings"
            variant="borderless"
            className={`
              !rounded-[5px]
              ${
                isDark
                  ? "!bg-[#102027] shadow-[0_8px_30px_rgba(0,0,0,0.25)]"
                  : "!bg-white shadow-[0_8px_30px_rgba(15,106,117,0.05)]"
              }
            `}
          >
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bookingData}>
                  <XAxis stroke={axisColor} dataKey="name" />

                  <YAxis stroke={axisColor} />

                  <Tooltip />

                  <Bar
                    dataKey="bookings"
                    fill="#0F6A75"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      {/* ================= TABLE ================= */}

      <Row className="mt-5">
        <Col span={24}>
          <Card
            title="Top Hotels"
            variant="borderless"
            className={`
              !rounded-[5px]
              ${
                isDark
                  ? "!bg-[#102027] shadow-[0_8px_30px_rgba(0,0,0,0.25)]"
                  : "!bg-white shadow-[0_8px_30px_rgba(15,106,117,0.05)]"
              }
            `}
          >
            <div className="w-full overflow-x-auto">
              <Table
                columns={columns}
                dataSource={tableData}
                pagination={false}
                scroll={{ x: "max-content" }}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
