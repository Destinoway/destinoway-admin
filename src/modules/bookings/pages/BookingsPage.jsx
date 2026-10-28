"use client";

import TableFilters from "@/modules/shared/components/TableFilters";
import { useTheme } from "@/context/ThemeContext";
import { usePermission } from "@/modules/shared/hooks/usePermission";
import {
  ArrowRightOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  EyeOutlined,
  ReloadOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Avatar,
  Button,
  Card,
  Empty,
  Space,
  Table,
  Tabs,
  Tag,
  Typography,
} from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import { useBookings } from "../hooks/useBookings";

const statusOptions = [
  { value: "price_checked", label: "Price checked", color: "blue" },
  { value: "itinerary_created", label: "Itinerary created", color: "gold" },
  { value: "paid", label: "Paid", color: "green" },
  { value: "cancelled", label: "Cancelled", color: "default" },
  { value: "failed", label: "Failed", color: "red" },
];

const statusColors = {
  price_checked: "blue",
  itinerary_created: "gold",
  paid: "green",
  cancelled: "default",
  failed: "red",
  confirmed: "green",
  awaiting_payment: "orange",
  completed: "green",
  created: "blue",
  pending: "orange",
  success: "green",
};

const getBookingRef = (booking) =>
  booking?.bookingRefNo ??
  booking?.bookingRef ??
  booking?.bookingReference ??
  booking?.referenceNo ??
  booking?.reference ??
  booking?._id;

const getBookingRows = (response) => {
  const payload = response?.data?.data ?? response?.data ?? response;
  if (Array.isArray(payload)) return payload;
  return (
    payload?.bookings ??
    payload?.hotelBookings ??
    payload?.results ??
    payload?.items ??
    (Array.isArray(payload?.data) ? payload.data : [])
  );
};

const getPagination = (response) =>
  response?.meta ??
  response?.data?.meta ??
  response?.data?.pagination ??
  response?.pagination ??
  {};

const formatStatus = (value) =>
  value
    ? String(value)
        .replaceAll("_", " ")
        .replaceAll("-", " ")
        .replace(/\b\w/g, (character) => character.toUpperCase())
    : "Not available";

const renderStatus = (value) => {
  if (!value) return <Typography.Text type="secondary">-</Typography.Text>;
  const normalized = String(value).toLowerCase().replaceAll("-", "_");
  return (
    <Tag color={statusColors[normalized] || "purple"} className="!m-0 !rounded-full !px-2.5">
      {formatStatus(value)}
    </Tag>
  );
};

const formatStayDate = (value, withTime = false) => {
  if (!value) return "-";
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  const date = dateOnly
    ? new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]))
    : new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString(
    "en-IN",
    withTime
      ? { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }
      : { day: "2-digit", month: "short", year: "numeric" },
  );
};

const formatAmount = (value, currency = "INR") => {
  if (value === null || value === undefined || value === "") return "-";
  const amount = Number(value);
  if (!Number.isFinite(amount)) return `${currency} ${value}`;
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency || "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency || "INR"} ${amount.toLocaleString("en-IN")}`;
  }
};

const getGuestName = (booking) => {
  const contact = booking?.contactInfo || {};
  const user = booking?.userId && typeof booking.userId === "object" ? booking.userId : {};
  return (
    booking?.guestName ||
    booking?.userName ||
    [contact.title, contact.firstName, contact.lastName].filter(Boolean).join(" ") ||
    user.name ||
    "Guest"
  );
};

const getHotelName = (booking) =>
  booking?.hotel?.name ||
  booking?.hotelName ||
  booking?.hotel?.hotelName ||
  "Hotel name unavailable";

const getHotelLocation = (booking) => {
  const hotel = booking?.hotel || {};
  const destination = hotel.city || hotel.destination || booking?.city || booking?.destination;
  if (typeof destination === "string") return destination;
  return destination?.name || destination?.cityName || hotel.address?.city || "Location unavailable";
};

const getNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return null;
  const nights = Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000);
  return Number.isFinite(nights) && nights >= 0 ? nights : null;
};

const getGuestAndRoomCount = (booking) => {
  const rooms = Array.isArray(booking?.rooms) ? booking.rooms : [];
  const guests = rooms.reduce(
    (count, room) =>
      count +
      (Array.isArray(room.adults) ? room.adults.length : 0) +
      (Array.isArray(room.children) ? room.children.length : 0),
    0,
  );
  const roomCount = rooms.length || booking?.roomCount || booking?.price?.roomGroups?.length || 0;
  const fallbackGuests =
    Number(booking?.stay?.adults || 0) + Number(booking?.stay?.children || 0);
  return { rooms: roomCount, guests: guests || fallbackGuests };
};

export default function BookingsPage() {
  const router = useRouter();
  const { isDark } = useTheme();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [debouncedSearch] = useDebounce(search, 500);
  const { canRead } = usePermission("Bookings");
  const queryParams = useMemo(
    () => ({
      page,
      limit,
      ...(status ? { status } : {}),
      ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
    }),
    [page, limit, status, debouncedSearch],
  );

  const { data, isFetching, isError, error, refetch } = useBookings(queryParams, canRead);
  const bookings = getBookingRows(data);
  const pagination = getPagination(data);

  const openDetails = (booking) => {
    const bookingRef = getBookingRef(booking);
    if (bookingRef) router.push(`/dashboard/bookings/${encodeURIComponent(bookingRef)}`);
  };

  const columns = [
    {
      title: "Booking reference",
      key: "bookingRef",
      width: 180,
      fixed: "left",
      render: (_, record) => {
        const bookingRef = getBookingRef(record);
        return (
          <div className="min-w-[140px]">
            <Link
              href={bookingRef ? `/dashboard/bookings/${encodeURIComponent(bookingRef)}` : "#"}
              className={`inline-flex items-center gap-1 font-mono text-xs font-bold hover:underline ${isDark ? "text-teal-300 hover:text-teal-200" : "text-teal-700 hover:text-teal-900"}`}
              onClick={(event) => {
                if (!bookingRef) event.preventDefault();
              }}
            >
              {bookingRef || "Reference unavailable"}<ArrowRightOutlined className="text-[10px]" />
            </Link>
            <span className="mt-1 block text-[10px] text-slate-400">Created {formatStayDate(record.createdAt)}</span>
          </div>
        );
      },
    },
    {
      title: "Guest",
      key: "guest",
      width: 220,
      render: (_, record) => {
        const name = getGuestName(record);
        const email = record?.contactInfo?.email || record?.userId?.email || record?.email;
        const mobile = record?.contactInfo?.mobile || record?.userId?.mobile || record?.mobile;
        return (
          <Space size={9}>
            <Avatar size={34} className="!bg-indigo-100 !font-semibold !text-indigo-700">
              {name.slice(0, 1).toUpperCase()}
            </Avatar>
            <span className="min-w-0">
              <Typography.Text strong className={`block max-w-[145px] ${isDark ? "!text-slate-100" : "!text-slate-800"}`} ellipsis={{ tooltip: name }}>{name}</Typography.Text>
              <span className="block max-w-[155px] truncate text-[10px] text-slate-400">{email || mobile || "Contact unavailable"}</span>
            </span>
          </Space>
        );
      },
    },
    {
      title: "Hotel & destination",
      key: "hotel",
      width: 230,
      render: (_, record) => (
        <span className="block min-w-[170px]">
          <Typography.Text strong className={`block max-w-[200px] ${isDark ? "!text-slate-100" : "!text-slate-800"}`} ellipsis={{ tooltip: getHotelName(record) }}>
            {getHotelName(record)}
          </Typography.Text>
          <span className="mt-1 block text-[11px] text-slate-500"><EnvironmentOutlined className="mr-1 text-rose-500" />{getHotelLocation(record)}</span>
        </span>
      ),
    },
    {
      title: "Stay dates",
      key: "stay",
      width: 205,
      render: (_, record) => {
        const checkIn = record?.stay?.checkIn || record?.checkIn;
        const checkOut = record?.stay?.checkOut || record?.checkOut;
        const nights = getNights(checkIn, checkOut);
        return (
          <span className="block min-w-[165px]">
            <span className={`flex items-center gap-1 text-xs font-medium ${isDark ? "text-slate-200" : "text-slate-700"}`}><CalendarOutlined className="text-teal-600" />{formatStayDate(checkIn)}</span>
            <span className="mt-1 block pl-[18px] text-[10px] text-slate-400">to {formatStayDate(checkOut)}{nights !== null ? ` · ${nights} night${nights === 1 ? "" : "s"}` : ""}</span>
          </span>
        );
      },
    },
    {
      title: "Rooms & guests",
      key: "roomsGuests",
      width: 130,
      render: (_, record) => {
        const counts = getGuestAndRoomCount(record);
        return (
          <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium ${isDark ? "bg-violet-950 text-violet-200" : "bg-violet-50 text-violet-700"}`}>
            <TeamOutlined />{counts.rooms || "-"} room{counts.rooms === 1 ? "" : "s"} · {counts.guests || "-"} guest{counts.guests === 1 ? "" : "s"}
          </span>
        );
      },
    },
    {
      title: "Total amount",
      key: "amount",
      width: 145,
      align: "right",
      render: (_, record) => (
        <Typography.Text strong className={isDark ? "!text-emerald-300" : "!text-emerald-700"}>
          {formatAmount(record?.price?.total ?? record?.totalAmount ?? record?.amount, record?.price?.currency || record?.currency || "INR")}
        </Typography.Text>
      ),
    },
    {
      title: "Price check",
      key: "priceCheck",
      width: 135,
      render: (_, record) => renderStatus(record?.priceCheckStatus || record?.verifiedPrice?.status),
    },
    {
      title: "Itinerary",
      dataIndex: "itineraryStatus",
      width: 140,
      render: renderStatus,
    },
    {
      title: "Payment",
      key: "payment",
      width: 140,
      render: (_, record) => renderStatus(record?.paymentStatus || record?.paymentOrderStatus),
    },
    {
      title: "Supplier booking",
      key: "bookingStatus",
      width: 155,
      render: (_, record) => renderStatus(record?.supplierBookingStatus || record?.bookingStatus),
    },
    {
      title: "Details",
      key: "details",
      width: 105,
      fixed: "right",
      render: (_, record) => (
        <Button
          size="small"
          type="primary"
          ghost
          icon={<EyeOutlined />}
          className="!rounded-lg"
          onClick={() => openDetails(record)}
        >
          View
        </Button>
      ),
    },
  ];

  const tabs = [
    { key: "all", label: <span className="booking-tab-label">All bookings</span> },
    ...statusOptions.map((option) => ({
      key: option.value,
      label: (
        <span className="booking-tab-label">
          <Tag color={option.color} className="!m-0 !rounded-full !px-2.5">{option.label}</Tag>
        </span>
      ),
    })),
  ];
  const hasActiveFilters = Boolean(status || search.trim());

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className={`m-0 text-2xl font-semibold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>Hotel bookings</h1>
          <p className={`mb-0 mt-1 text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>Review guest details, hotel stays, payment and supplier progress.</p>
        </div>
        {canRead && (
          <Button icon={<ReloadOutlined />} loading={isFetching} onClick={() => refetch()} className="!rounded-xl">
            Refresh
          </Button>
        )}
      </div>

      <Card variant="borderless" className="!overflow-hidden !rounded-2xl !shadow-sm" styles={{ body: { padding: 0 } }}>
        {!canRead ? (
          <div className="p-6"><Empty description="No permission to view bookings" /></div>
        ) : (
          <>
            <div className="booking-tabs-wrap border-b border-slate-100 px-5 pt-2">
              <Tabs
                className="booking-status-tabs"
                activeKey={status || "all"}
                items={tabs}
                onChange={(key) => {
                  setStatus(key === "all" ? undefined : key);
                  setPage(1);
                }}
                size="small"
                tabBarGutter={20}
              />
            </div>

            <div className="px-5 pt-5">
              <TableFilters
                search={search}
                setSearch={(value) => {
                  setSearch(value);
                  setPage(1);
                }}
                searchPlaceholder="Search reference, guest, hotel, email..."
                isLoading={isFetching}
                hasActiveFilters={hasActiveFilters}
                onReset={() => {
                  setSearch("");
                  setStatus(undefined);
                  setPage(1);
                }}
              />
            </div>

            {isError && (
              <Alert
                className="mx-5 mb-4"
                type="error"
                showIcon
                title="Could not load bookings"
                description={error?.response?.data?.message || error?.message || "Please retry."}
                action={<Button size="small" icon={<ReloadOutlined />} onClick={() => refetch()}>Retry</Button>}
              />
            )}

            <Table
              className="booking-table"
              rowKey={(record) => String(getBookingRef(record) || record?._id || "")}
              columns={columns}
              dataSource={bookings}
              loading={isFetching}
              size="middle"
              scroll={{ x: 1800 }}
              pagination={{
                current: page,
                pageSize: limit,
                total: pagination?.totalRecords ?? pagination?.total ?? pagination?.totalItems ?? pagination?.count ?? 0,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "50", "100"],
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} bookings`,
                onChange: (current, pageSize) => {
                  setPage(current);
                  setLimit(pageSize);
                },
              }}
              locale={{
                emptyText: (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={hasActiveFilters ? "No bookings match these filters" : "No bookings found"}
                  />
                ),
              }}
            />
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 px-5 py-3 text-[11px] text-slate-400">
              <span>Showing {bookings.length} booking{bookings.length === 1 ? "" : "s"} on this page</span>
              <span className="inline-flex items-center gap-1"><CalendarOutlined /> Dates and amounts open in booking details</span>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
