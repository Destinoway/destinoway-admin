"use client";

import {
  ArrowLeftOutlined,
  CalendarOutlined,
  CreditCardOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  ReloadOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Avatar,
  Button,
  Card,
  Col,
  Collapse,
  Descriptions,
  Empty,
  Row,
  Space,
  Spin,
  Statistic,
  Table,
  Tag,
  Typography,
} from "antd";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "next/navigation";
import { useBookingDetails } from "../hooks/useBookings";

const statusColors = {
  completed: "green",
  created: "blue",
  paid: "green",
  confirmed: "green",
  pending: "orange",
  awaiting_payment: "orange",
  failed: "red",
  cancelled: "default",
  not_requested: "default",
  success: "green",
};

const formatStatus = (value) =>
  value
    ? String(value)
        .replaceAll("_", " ")
        .replaceAll("-", " ")
        .replace(/\b\w/g, (character) => character.toUpperCase())
    : "Not available";

const StatusTag = ({ value }) =>
  value ? (
    <Tag color={statusColors[value] || "default"}>{formatStatus(value)}</Tag>
  ) : (
    <Typography.Text type="secondary">Not available</Typography.Text>
  );

const formatDate = (value, dateOnly = false) => {
  if (!value) return "—";
  const dateOnlyMatch = dateOnly && /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  const date = dateOnlyMatch
    ? new Date(
        Number(dateOnlyMatch[1]),
        Number(dateOnlyMatch[2]) - 1,
        Number(dateOnlyMatch[3]),
      )
    : new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString(
    "en-IN",
    dateOnly
      ? { day: "2-digit", month: "short", year: "numeric" }
      : { dateStyle: "medium", timeStyle: "short" },
  );
};

const formatAmount = (amount, currency = "INR") => {
  if (amount === null || amount === undefined || amount === "") return "—";
  const numericAmount = Number(amount);
  if (!Number.isFinite(numericAmount)) return `${currency} ${amount}`;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericAmount);
};

const displayValue = (value) => {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
};

const descriptions = (entries, columns = 2) => (
  <Descriptions
    size="small"
    column={{ xs: 1, sm: 1, md: columns }}
    className="booking-detail-descriptions"
    items={entries.map(([key, label, children]) => ({
      key,
      label,
      children: children ?? "—",
    }))}
  />
);

const formatGuestName = (guest) =>
  [guest?.title, guest?.firstName, guest?.middleName, guest?.lastName]
    .filter(Boolean)
    .join(" ") || "Guest";

const jsonPanel = (value) => (
  <pre className="m-0 max-h-[420px] overflow-auto whitespace-pre-wrap break-words rounded-md bg-slate-950 p-4 text-xs text-slate-100">
    {JSON.stringify(value, null, 2)}
  </pre>
);

const SectionHeading = ({ icon: Icon, children, tone = "blue" }) => {
  const toneStyles = {
    blue: "bg-blue-100 text-blue-700",
    cyan: "bg-cyan-100 text-cyan-700",
    violet: "bg-violet-100 text-violet-700",
    green: "bg-emerald-100 text-emerald-700",
    amber: "bg-amber-100 text-amber-700",
  };

  return (
    <Space size={10}>
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-lg text-base ${toneStyles[tone]}`}
      >
        <Icon />
      </span>
      <span className="font-semibold">{children}</span>
    </Space>
  );
};

export default function BookingDetailsPage({ bookingRef }) {
  const router = useRouter();
  const { isDark } = useTheme();
  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useBookingDetails(bookingRef);

  const booking = response?.data?.data ?? response?.data ?? response?.booking;

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spin size="large" description="Loading booking details..." />
      </div>
    );
  }

  if (isError) {
    return (
      <Space orientation="vertical" size="middle" className="w-full">
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>
          Back to bookings
        </Button>
        <Alert
          type="error"
          showIcon
          title="Could not load booking details"
          description={
            error?.response?.data?.message || error?.message || "Please retry."
          }
          action={
            <Button
              icon={<ReloadOutlined />}
              loading={isFetching}
              onClick={() => refetch()}
            >
              Retry
            </Button>
          }
        />
      </Space>
    );
  }

  if (!booking || typeof booking !== "object") {
    return (
      <Space orientation="vertical" size="middle" className="w-full">
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>
          Back to bookings
        </Button>
        <Empty description="Booking details were not found" />
      </Space>
    );
  }

  const user = booking.userId || {};
  const contact = booking.contactInfo || {};
  const hotel = booking.hotel || {};
  const stay = booking.stay || {};
  const price = booking.price || {};
  const offer = booking.offer || {};
  const rooms = Array.isArray(booking.rooms) ? booking.rooms : [];
  const priceRoomGroups = Array.isArray(price.roomGroups)
    ? price.roomGroups
    : [];
  const verifiedGroups = Array.isArray(booking.verifiedPrice?.roomGroup)
    ? booking.verifiedPrice.roomGroup
    : [];
  const roomRows = rooms.map((room, index) => {
    const guests = [
      ...(Array.isArray(room.adults) ? room.adults : []),
      ...(Array.isArray(room.children) ? room.children : []),
    ];
    const roomGroup = verifiedGroups[index];
    const occupancy = roomGroup?.occupancies?.[0];
    return {
      key: room.occupancyId ?? index,
      room:
        roomGroup?.room?.name ||
        roomGroup?.room?.standardRoomName ||
        `Room ${index + 1}`,
      guests,
      guestsLabel: `${guests.length} guest${guests.length === 1 ? "" : "s"}`,
      count: roomGroup?.roomCount ?? priceRoomGroups[index]?.roomCount ?? 1,
      adults: occupancy?.numOfAdults ?? room.adults?.length ?? 0,
      childCount: occupancy?.numOfChildren ?? room.children?.length ?? 0,
      refundability: roomGroup?.refundability,
      boardBasis: roomGroup?.boardBasis?.description,
      amenities: roomGroup?.room?.facilities || [],
    };
  });
  const guests = roomRows.flatMap((room, roomIndex) =>
    room.guests.map((guest, guestIndex) => ({
      key: `${roomIndex}-${guestIndex}`,
      room: `Room ${roomIndex + 1}`,
      name: formatGuestName(guest),
      type: guest.age ? `Child · ${guest.age} yrs` : "Adult",
      email: guest.email,
      phone: guest.mobileNo,
      pan: guest.pan,
    })),
  );
  const roomColumns = [
    { title: "Room", dataIndex: "room" },
    { title: "Rooms", dataIndex: "count" },
    {
      title: "Occupancy",
      render: (_, room) =>
        `${room.adults} adult${room.adults === 1 ? "" : "s"}${
          room.childCount
            ? `, ${room.childCount} child${room.childCount === 1 ? "" : "ren"}`
            : ""
        }`,
    },
    {
      title: "Board basis",
      dataIndex: "boardBasis",
      render: displayValue,
    },
    {
      title: "Refundability",
      dataIndex: "refundability",
      render: (value) => value || "—",
    },
    {
      title: "Room facilities",
      dataIndex: "amenities",
      render: (items) =>
        items?.length
          ? items
              .slice(0, 3)
              .map((item) => item.name)
              .filter(Boolean)
              .join(", ")
          : "—",
    },
  ];
  const guestColumns = [
    { title: "Guest", dataIndex: "name" },
    { title: "Room", dataIndex: "room" },
    { title: "Type", dataIndex: "type" },
    { title: "Email", dataIndex: "email", render: displayValue },
    { title: "Mobile", dataIndex: "phone", render: displayValue },
    { title: "PAN", dataIndex: "pan", render: displayValue },
  ];
  const priceColumns = [
    { title: "Room", dataIndex: "room" },
    { title: "Rooms", dataIndex: "roomCount" },
    { title: "Provider", dataIndex: "providerName", render: displayValue },
    {
      title: "Base rate",
      dataIndex: "baseRate",
      render: (value) => formatAmount(value, price.currency),
    },
    {
      title: "Supplier total",
      dataIndex: "totalRate",
      render: (value) => formatAmount(value, price.currency),
    },
    {
      title: "Customer total",
      render: (_, record) =>
        formatAmount(
          record.customerPrice?.totalPrice ??
            record.customerPrice?.totalPriceBeforeCoupon,
          record.customerPrice?.currency || price.currency,
        ),
    },
    {
      title: "Markup",
      render: (_, record) =>
        formatAmount(
          record.customerPrice?.markupAmount,
          record.customerPrice?.currency || price.currency,
        ),
    },
  ];
  const priceBreakdownRows =
    priceRoomGroups.length > 0
      ? priceRoomGroups.map((group, index) => {
          const verifiedGroup = verifiedGroups.find(
            (item) => item.id === group.roomGroupId,
          );
          return {
            ...group,
            key: group.roomGroupId || group.id || `room-${index}`,
            room:
              verifiedGroup?.room?.name ||
              verifiedGroup?.room?.standardRoomName ||
              `Room ${index + 1}`,
            customerPrice: group.customerPrice,
          };
        })
      : verifiedGroups.map((group, index) => ({
          key: group.id || `room-${index}`,
          room:
            group.room?.name ||
            group.room?.standardRoomName ||
            `Room ${index + 1}`,
          roomCount: group.roomCount,
          baseRate: group.baseRate,
          totalRate: group.totalRate,
          providerName: group.providerName,
          customerPrice: group.customerPrice,
        }));
  const cancellationPolicies = verifiedGroups.flatMap((group, groupIndex) =>
    Array.isArray(group.cancellationPolicies)
      ? group.cancellationPolicies.map((policy, policyIndex) => ({
          ...policy,
          key: `${group.id || groupIndex}-cancellation-${policyIndex}`,
        }))
      : [],
  );
  const hotelPolicies = verifiedGroups.flatMap((group, groupIndex) =>
    Array.isArray(group.policies)
      ? group.policies.map((policy, policyIndex) => ({
          ...policy,
          key: `${group.id || groupIndex}-hotel-policy-${policyIndex}`,
        }))
      : [],
  );
  const dailyRates = verifiedGroups.flatMap((group) =>
    Array.isArray(group.dailyRates)
      ? group.dailyRates.map((rate, rateIndex) => ({
          ...rate,
          key: `${group.id || group.providerName || "rate"}-${rate.date || rateIndex}`,
          providerName: group.providerName,
          roomName: group.room?.name || group.room?.standardRoomName || "Room",
        }))
      : [],
  );
  const roomIncludes = Array.from(
    new Set(verifiedGroups.flatMap((group) => group.includes || [])),
  );

  const failureItems = [
    ["Itinerary", booking.itineraryError],
    ["Supplier booking", booking.supplierBookingError],
    ["Cancellation", booking.cancellationError],
  ].filter(([, value]) => value);
  const currentStatus =
    booking.supplierBookingStatus || booking.itineraryStatus || "pending";
  const paymentStatus = booking.paymentStatus || booking.paymentOrderStatus;
  const hotelAddress =
    typeof hotel.address === "string"
      ? hotel.address
      : [
          hotel.address?.line1,
          hotel.address?.line2,
          hotel.address?.city,
          hotel.address?.state,
          hotel.address?.country,
        ]
          .filter(Boolean)
          .join(", ");
  const roomCount =
    roomRows.reduce((total, room) => total + Number(room.count || 0), 0) ||
    priceRoomGroups.reduce((total, room) => total + Number(room.roomCount || 1), 0) ||
    verifiedGroups.reduce((total, room) => total + Number(room.roomCount || 1), 0);
  const guestCount =
    guests.length ||
    Number(stay.adults || 0) + Number(stay.children || 0) ||
    verifiedGroups.reduce((total, group) => {
      const occupancy = group.occupancies?.[0] || {};
      return total + Number(occupancy.numOfAdults || 0) + Number(occupancy.numOfChildren || 0);
    }, 0);
  const stayNights =
    stay.checkIn && stay.checkOut
      ? Math.max(
          0,
          Math.round(
            (new Date(stay.checkOut).getTime() -
              new Date(stay.checkIn).getTime()) /
              86400000,
          ),
        )
      : 0;

  return (
    <div className="booking-detail-page mx-auto w-full max-w-[1440px] space-y-5 pb-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => router.push("/dashboard/bookings")}
          className="!rounded-lg"
        >
          Back to bookings
        </Button>
        <Space wrap>
          <Typography.Text type="secondary">Booking ID:</Typography.Text>
          <Typography.Text copyable className="!font-mono !text-xs">
            {booking.bookingRefNo || "—"}
          </Typography.Text>
        </Space>
      </div>

      <Card
        className={`overflow-hidden !rounded-2xl !border-0 shadow-md ${
          isDark
            ? "!bg-gradient-to-br !from-[#132c3d] !via-[#163344] !to-[#123b43]"
            : "!bg-gradient-to-br !from-[#edf6ff] !via-[#f4f7ff] !to-[#e8fbf8]"
        }`}
        styles={{ body: { padding: 28 } }}
      >
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="min-w-[260px] flex-1">
            <Space align="start" size={16}>
              <Avatar
                shape="square"
                size={58}
                icon={<HomeOutlined />}
                className="!rounded-2xl !bg-[#1677ff] !text-2xl"
              />
              <div>
                <Typography.Title level={2} className="!mb-1">
                  {hotel.name || "Hotel booking"}
                </Typography.Title>
                <Space wrap size={[8, 8]}>
                  <Tag color="cyan" className="!m-0 !font-mono">
                    {booking.bookingRefNo || bookingRef}
                  </Tag>
                  {hotel.starRating && (
                    <Tag color="gold" className="!m-0">
                      {hotel.starRating} star hotel
                    </Tag>
                  )}
                </Space>
              </div>
            </Space>
            {hotelAddress && (
              <Typography.Paragraph
                type="secondary"
                className="!mb-0 !mt-4 max-w-3xl"
              >
                <EnvironmentOutlined className="mr-2 text-[#1677ff]" />
                {hotelAddress}
              </Typography.Paragraph>
            )}
          </div>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <Typography.Text type="secondary">
              CURRENT BOOKING STATUS
            </Typography.Text>
            <Tag
              color={statusColors[currentStatus] || "processing"}
              className="!m-0 !rounded-full !px-4 !py-1 !text-sm !font-semibold"
            >
              {formatStatus(currentStatus)}
            </Tag>
            <Typography.Text type="secondary" className="block px-1 text-xs">
              Created {formatDate(booking.createdAt)}
            </Typography.Text>
          </div>
        </div>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} xl={6}>
          <Card className="booking-detail-summary-card !h-full !rounded-2xl !border-0 shadow-sm">
            <Statistic
              title="Total payable"
              value={formatAmount(price.total, price.currency)}
              prefix={<DollarOutlined className="mr-1 text-emerald-600" />}
              styles={{ content: { color: isDark ? "#6ee7b7" : "#047857", fontSize: 21, fontWeight: 700 } }}
            />
            <Typography.Text type="secondary" className="!text-xs">{price.currency || "INR"} · taxes and discounts included</Typography.Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Card className="booking-detail-summary-card !h-full !rounded-2xl !border-0 shadow-sm">
            <Typography.Text type="secondary">Stay dates</Typography.Text>
            <div className="mt-2 flex items-center gap-2">
              <CalendarOutlined className="text-blue-600" />
              <span className={`text-sm font-semibold ${isDark ? "text-slate-100" : "text-slate-800"}`}>
                {formatDate(stay.checkIn, true)} <span className="text-slate-400">→</span> {formatDate(stay.checkOut, true)}
              </span>
            </div>
            <Typography.Text type="secondary" className="!text-xs">{stayNights} night{stayNights === 1 ? "" : "s"}</Typography.Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Card className="booking-detail-summary-card !h-full !rounded-2xl !border-0 shadow-sm">
            <Typography.Text type="secondary">Rooms & guests</Typography.Text>
            <div className="mt-2 flex items-center gap-2">
              <TeamOutlined className="text-violet-600" />
              <span className={`text-xl font-bold ${isDark ? "text-slate-100" : "text-slate-800"}`}>{roomCount} rooms</span>
            </div>
            <Typography.Text type="secondary" className="!text-xs">{guestCount} guest{guestCount === 1 ? "" : "s"} listed</Typography.Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Card className="booking-detail-summary-card !h-full !rounded-2xl !border-0 shadow-sm">
            <Typography.Text type="secondary">Payment status</Typography.Text>
            <div className="mt-2"><StatusTag value={paymentStatus} /></div>
            <Typography.Text type="secondary" className="!text-xs">Gateway: {booking.paymentGateway || "Not available"}</Typography.Text>
          </Card>
        </Col>
      </Row>

      <Card
        className="!rounded-xl !border-0 shadow-sm"
        title={
          <SectionHeading icon={InfoCircleOutlined}>
            Booking progress
          </SectionHeading>
        }
        extra={
          <Space wrap>
            <Tag color="blue">
              {stayNights} night{stayNights === 1 ? "" : "s"}
            </Tag>
            <Tag color="purple">
              {roomCount} room{roomCount === 1 ? "" : "s"}
            </Tag>
            <Tag color="cyan">
              {guestCount} guest{guestCount === 1 ? "" : "s"}
            </Tag>
          </Space>
        }
      >
        <Row gutter={[16, 16]}>
          {[
            [
              "Price check",
              booking.priceCheckStatus || booking.verifiedPrice?.status,
            ],
            ["Itinerary", booking.itineraryStatus],
            ["Payment", booking.paymentStatus],
            ["Supplier booking", booking.supplierBookingStatus],
            ["Cancellation", booking.cancellationStatus],
          ].map(([label, value]) => (
            <Col xs={24} sm={12} lg={8} key={label}>
              <div
                className={`flex items-center justify-between rounded-xl border px-4 py-3 ${
                  isDark
                    ? "border-white/10 bg-white/[0.03]"
                    : "border-slate-100 bg-slate-50"
                }`}
              >
                <Typography.Text>{label}</Typography.Text>
                <StatusTag value={value} />
              </div>
            </Col>
          ))}
        </Row>
      </Card>

      <Card
        className="!rounded-xl !border-0 shadow-sm"
        title={
          <SectionHeading icon={HomeOutlined} tone="cyan">
            Hotel & stay
          </SectionHeading>
        }
      >
        {descriptions([
          ["hotel", "Hotel", hotel.name],
          ["hotelId", "Hotel ID", hotel.hotelId || booking.hotelId],
          [
            "rating",
            "Star rating",
            hotel.starRating ? `${hotel.starRating} / 5` : "—",
          ],
          ["supplier", "Supplier", booking.supplier],
          ["checkIn", "Check-in", formatDate(stay.checkIn, true)],
          ["checkOut", "Check-out", formatDate(stay.checkOut, true)],
          ["address", "Hotel address", hotelAddress, 2],
          [
            "request",
            "Special service request",
            booking.specialServiceRequest,
            2,
          ],
        ])}
        <div className="mt-4">
          <Typography.Title level={5}>Rooms</Typography.Title>
          <Table
            className="booking-detail-table"
            size="small"
            rowKey="key"
            pagination={false}
            columns={roomColumns}
            dataSource={roomRows}
            scroll={{ x: 1000 }}
            locale={{ emptyText: "Room details not available" }}
          />
        </div>
        {roomIncludes.length > 0 && (
          <div className="mt-5">
            <Typography.Title level={5}>
              Included with this stay
            </Typography.Title>
            <Space wrap>
              {roomIncludes.map((item) => (
                <Tag
                  key={item}
                  color="cyan"
                  className="!rounded-full !px-3 !py-1"
                >
                  {item}
                </Tag>
              ))}
            </Space>
          </div>
        )}
      </Card>

      <Card
        className="!rounded-xl !border-0 shadow-sm"
        title={
          <SectionHeading icon={TeamOutlined} tone="violet">
            Guest & contact information
          </SectionHeading>
        }
      >
        <Typography.Title level={5}>
          <UserOutlined className="mr-2 text-violet-600" />
          Booking contact
        </Typography.Title>
        {descriptions([
          [
            "contactName",
            "Contact name",
            [contact.title, contact.firstName, contact.lastName]
              .filter(Boolean)
              .join(" ") || user.name,
          ],
          ["email", "Email", contact.email || user.email],
          ["mobile", "Mobile", contact.mobile || user.mobile],
          ["city", "City", contact.city],
          ["state", "State", contact.state],
          ["pin", "PIN code", contact.pin],
          ["address", "Address", contact.address, 2],
          ["accountUser", "Account user", user.name],
          ["accountEmail", "Account email", user.email],
        ])}
        <div className="mt-4">
          <Typography.Title level={5}>Guests / room occupants</Typography.Title>
          <Table
            className="booking-detail-table"
            size="small"
            rowKey="key"
            pagination={false}
            columns={guestColumns}
            dataSource={guests}
            scroll={{ x: 800 }}
            locale={{ emptyText: "Guest details not available" }}
          />
        </div>
      </Card>

      <Card
        className="!rounded-xl !border-0 shadow-sm"
        title={
          <SectionHeading icon={CreditCardOutlined} tone="green">
            Price & payment
          </SectionHeading>
        }
      >
        <Row gutter={[16, 16]} className="mb-4">
          <Col xs={24} sm={12} lg={6}>
            <Statistic
              title="Total payable"
              value={formatAmount(price.total, price.currency)}
              styles={{
                content: { fontSize: 20, fontWeight: 600 },
              }}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Statistic
              title="Base price"
              value={formatAmount(price.basePrice, price.currency)}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Statistic
              title="Service tax"
              value={formatAmount(price.serviceTax, price.currency)}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Statistic
              title="Coupon discount"
              value={formatAmount(
                offer.couponDiscount ?? price.couponDiscount,
                price.currency,
              )}
            />
          </Col>
        </Row>
        {descriptions([
          ["currency", "Currency", price.currency],
          [
            "supplierBasePrice",
            "Supplier base price",
            formatAmount(price.supplierNetAmount, price.currency),
          ],
          [
            "supplierTotal",
            "Supplier total",
            formatAmount(price.supplierTotal, price.currency),
          ],
          [
            "beforeCoupon",
            "Total before coupon",
            formatAmount(
              price.totalBeforeCoupon ?? price.totalPriceBeforeCoupon,
              price.currency,
            ),
          ],
          ["coupon", "Coupon code", offer.couponCode],
          ["couponTitle", "Coupon title", offer.couponTitle],
          [
            "couponPercent",
            "Coupon discount %",
            price.couponDiscountPercent != null
              ? `${price.couponDiscountPercent}%`
              : "—",
          ],
          [
            "couponBase",
            "Coupon eligible amount",
            formatAmount(price.couponBaseAmount, price.currency),
          ],
          [
            "additionalTax",
            "Additional tax",
            formatAmount(
              priceRoomGroups[0]?.customerPrice?.additionalTaxAmount,
              price.currency,
            ),
          ],
          [
            "markupAmount",
            "Markup amount",
            formatAmount(
              priceRoomGroups[0]?.customerPrice?.markupAmount,
              price.currency,
            ),
          ],
          [
            "markupType",
            "Markup",
            priceRoomGroups[0]?.customerPrice?.markupValue != null
              ? `${priceRoomGroups[0].customerPrice.markupValue}${priceRoomGroups[0].customerPrice.markupType === "percentage" ? "%" : ` ${price.currency || "INR"}`}`
              : "—",
          ],
          ["paymentGateway", "Payment gateway", booking.paymentGateway],
          [
            "paymentOrder",
            "Payment order status",
            <StatusTag
              key="payment-order-status"
              value={booking.paymentOrderStatus}
            />,
          ],
          [
            "paymentTransaction",
            "Payment transaction ID",
            booking.paymentTransactionId,
          ],
          ["transaction", "Supplier transaction ID", booking.transactionId],
          [
            "itineraryTransaction",
            "Itinerary transaction ID",
            booking.itineraryResponse?.TransactionID,
          ],
        ])}
        <div className="mt-4">
          <Typography.Title level={5}>Room price breakdown</Typography.Title>
          <Table
            className="booking-detail-table"
            size="small"
            rowKey="key"
            pagination={false}
            columns={priceColumns}
            dataSource={priceBreakdownRows}
            scroll={{ x: 700 }}
            locale={{ emptyText: "Price breakdown not available" }}
          />
        </div>
        {dailyRates.length > 0 && (
          <div className="mt-5">
            <Typography.Title level={5}>
              Nightly rate breakdown
            </Typography.Title>
            <Table
              className="booking-detail-table"
              size="small"
              rowKey="key"
              pagination={false}
              columns={[
                {
                  title: "Stay date",
                  dataIndex: "date",
                  render: (value) => formatDate(value, true),
                },
                { title: "Room", dataIndex: "roomName" },
                { title: "Provider", dataIndex: "providerName" },
                {
                  title: "Rate",
                  dataIndex: "amount",
                  render: (value) => formatAmount(value, price.currency),
                },
                {
                  title: "Tax included",
                  dataIndex: "taxIncluded",
                  render: displayValue,
                },
                {
                  title: "Discount",
                  dataIndex: "discount",
                  render: (value) => formatAmount(value, price.currency),
                },
              ]}
              dataSource={dailyRates}
              scroll={{ x: 800 }}
            />
          </div>
        )}
      </Card>

      <Card
        className="!rounded-xl !border-0 shadow-sm"
        title={
          <SectionHeading icon={SafetyCertificateOutlined} tone="amber">
            Cancellation & supplier information
          </SectionHeading>
        }
      >
        {descriptions([
          [
            "cancellationStatus",
            "Cancellation status",
            <StatusTag
              key="cancellation-status"
              value={booking.cancellationStatus}
            />,
          ],
          ["cancellationId", "Cancellation ID", booking.cancellationId],
          [
            "cancellationRequested",
            "Cancellation request sent",
            displayValue(booking.cancellationRequestSent),
          ],
          ["cancelledAt", "Cancelled at", formatDate(booking.cancelledAt)],
          [
            "cancellationRemarks",
            "Cancellation remarks",
            booking.cancellationRemarks,
            2,
          ],
          ["recommendationId", "Recommendation ID", booking.recommendationId],
          ["searchId", "Search ID", booking.searchId],
        ])}
        {cancellationPolicies.length > 0 && (
          <div className="mt-4">
            <Typography.Title level={5}>Cancellation policies</Typography.Title>
            <Table
              className="booking-detail-table"
              size="small"
              rowKey="key"
              pagination={false}
              columns={[
                { title: "Policy", dataIndex: "type", width: 220 },
                { title: "Details", dataIndex: "text" },
              ]}
              dataSource={cancellationPolicies}
              scroll={{ x: 600 }}
            />
          </div>
        )}
        {hotelPolicies.length > 0 && (
          <div className="mt-4">
            <Typography.Title level={5}>
              Hotel & check-in policies
            </Typography.Title>
            <Table
              className="booking-detail-table"
              size="small"
              rowKey="key"
              pagination={false}
              columns={[
                { title: "Policy", dataIndex: "type", width: 240 },
                { title: "Details", dataIndex: "text" },
              ]}
              dataSource={hotelPolicies}
              scroll={{ x: 700 }}
            />
          </div>
        )}
      </Card>

      {failureItems.length > 0 && (
        <Alert
          type="error"
          showIcon
          title="Booking process errors"
          description={
            <ul className="m-0 list-disc pl-5">
              {failureItems.map(([label, value]) => (
                <li key={label}>
                  <strong>{label}:</strong> {String(value)}
                </li>
              ))}
            </ul>
          }
        />
      )}

      <Collapse
        className="booking-technical-collapse"
        items={[
          {
            key: "technical",
            label: (
              <Space>
                <SafetyCertificateOutlined />
                Supplier / technical response details
              </Space>
            ),
            children: (
              <Space orientation="vertical" size="middle" className="w-full">
                {booking.itineraryResponse && (
                  <div>
                    <Typography.Title level={5}>
                      Itinerary response
                    </Typography.Title>
                    {jsonPanel(booking.itineraryResponse)}
                  </div>
                )}
                {booking.supplierBookingResponse && (
                  <div>
                    <Typography.Title level={5}>
                      Supplier booking response
                    </Typography.Title>
                    {jsonPanel(booking.supplierBookingResponse)}
                  </div>
                )}
                {booking.verifiedPrice && (
                  <div>
                    <Typography.Title level={5}>
                      Verified price & policies
                    </Typography.Title>
                    {jsonPanel(booking.verifiedPrice)}
                  </div>
                )}
                {booking.supplierRooms && (
                  <div>
                    <Typography.Title level={5}>
                      Supplier room payload
                    </Typography.Title>
                    {jsonPanel(booking.supplierRooms)}
                  </div>
                )}
                <div>
                  <Typography.Title level={5}>
                    Complete booking record
                  </Typography.Title>
                  {jsonPanel(booking)}
                </div>
              </Space>
            ),
          },
        ]}
      />

      <Typography.Text type="secondary">
        Created {formatDate(booking.createdAt)} · Last updated{" "}
        {formatDate(booking.updatedAt)}
      </Typography.Text>
    </div>
  );
}
