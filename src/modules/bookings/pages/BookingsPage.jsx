"use client";

import TableFilters from "@/modules/shared/components/TableFilters";
import { usePermission } from "@/modules/shared/hooks/usePermission";
import { ReloadOutlined } from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  Empty,
  Table,
  Tag,
  Typography,
} from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import { useBookings } from "../hooks/useBookings";

const statusOptions = [
  { value: "price_checked", label: "Price Checked" },
  { value: "itinerary_created", label: "Itinerary Created" },
  { value: "paid", label: "Paid" },
  { value: "cancelled", label: "Cancelled" },
  { value: "failed", label: "Failed" },
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

const getPagination = (response) => {
  return (
    response?.meta ??
    response?.data?.meta ??
    response?.data?.pagination ??
    response?.pagination ??
    {}
  );
};

const formatStatus = (value) =>
  value
    ? value
        .replaceAll("_", " ")
        .replaceAll("-", " ")
        .replace(/\b\w/g, (character) => character.toUpperCase())
    : "-";

const renderStatus = (value) => (
  <Tag color={statusColors[value] || "default"}>{formatStatus(value)}</Tag>
);

const formatStayDate = (value) => {
  if (!value) return "-";

  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  const date = dateOnly
    ? new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]))
    : new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function BookingsPage() {
  const router = useRouter();
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

  const { data, isLoading, isFetching, isError, error, refetch } = useBookings(
    queryParams,
    canRead,
  );
  const bookings = getBookingRows(data);
  const pagination = getPagination(data);

  const openDetails = (booking) => {
    const bookingRef = getBookingRef(booking);
    if (!bookingRef) return;
    router.push(`/dashboard/bookings/${encodeURIComponent(bookingRef)}`);
  };

  const columns = [
    {
      title: "Booking Ref",
      key: "bookingRef",
      width: 210,
      fixed: "left",
      render: (_, record) => {
        const bookingRef = getBookingRef(record);
        return bookingRef ? (
          <Link
            href={`/dashboard/bookings/${encodeURIComponent(bookingRef)}`}
            className="font-semibold text-sky-500 hover:text-sky-600 hover:underline"
          >
            {bookingRef}
          </Link>
        ) : (
          <Typography.Text type="secondary">-</Typography.Text>
        );
      },
    },
    {
      title: "Hotel",
      dataIndex: "hotelName",
      width: 240,
      render: (value) => (
        <Typography.Text strong className="!text-cyan-800">
          {value || "-"}
        </Typography.Text>
      ),
    },
    {
      title: "Customer",
      dataIndex: "userName",
      width: 220,
      render: (value) => (
        <Typography.Text strong className="!text-indigo-700">
          {value || "-"}
        </Typography.Text>
      ),
    },
    {
      title: "Check-in",
      dataIndex: "checkIn",
      width: 140,
      render: (value) => (
        <Typography.Text strong>{formatStayDate(value)}</Typography.Text>
      ),
    },
    {
      title: "Check-out",
      dataIndex: "checkOut",
      width: 140,
      render: (value) => (
        <Typography.Text strong>{formatStayDate(value)}</Typography.Text>
      ),
    },
    {
      title: "Price Check",
      dataIndex: "priceCheckStatus",
      width: 140,
      render: renderStatus,
    },
    {
      title: "Itinerary",
      dataIndex: "itineraryStatus",
      width: 140,
      render: renderStatus,
    },
    {
      title: "Payment",
      dataIndex: "paymentStatus",
      width: 130,
      render: renderStatus,
    },
    {
      title: "Booking Status",
      dataIndex: "bookingStatus",
      width: 170,
      render: renderStatus,
    },
  ];

  const hasActiveFilters = Boolean(status || search.trim());

  return (
    <>
      <Card title="Hotel Bookings">
        {!canRead ? (
          <Empty description="No permission to view bookings" />
        ) : (
          <>
            <TableFilters
              search={search}
              setSearch={(value) => {
                setSearch(value);
                setPage(1);
              }}
              searchPlaceholder="Search booking ref, hotel, or customer"
              status={status}
              setStatus={(value) => {
                setStatus(value);
                setPage(1);
              }}
              statusOptions={statusOptions}
              isLoading={isFetching}
              hasActiveFilters={hasActiveFilters}
              onReset={() => {
                setSearch("");
                setStatus(undefined);
                setPage(1);
              }}
            />

            {isError && (
              <Alert
                className="mb-4"
                type="error"
                showIcon
                title="Could not load bookings"
                description={
                  error?.response?.data?.message ||
                  error?.message ||
                  "Please retry."
                }
                action={
                  <Button
                    size="small"
                    icon={<ReloadOutlined />}
                    onClick={() => refetch()}
                  >
                    Retry
                  </Button>
                }
              />
            )}

            <Table
              rowKey={(record) =>
                String(getBookingRef(record) || record?._id || "")
              }
              columns={columns}
              dataSource={bookings}
              loading={isFetching}
              bordered
              size="middle"
              scroll={{ x: 1500 }}
              pagination={{
                current: page,
                pageSize: limit,
                total:
                  pagination?.totalRecords ??
                  pagination?.total ??
                  pagination?.totalItems ??
                  pagination?.count ??
                  0,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "50", "100"],
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total}`,
                onChange: (current, pageSize) => {
                  setPage(current);
                  setLimit(pageSize);
                },
              }}
              locale={{
                emptyText: (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="No bookings found"
                  />
                ),
              }}
            />
          </>
        )}
      </Card>

    </>
  );
}
