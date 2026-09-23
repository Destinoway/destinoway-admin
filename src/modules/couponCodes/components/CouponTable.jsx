"use client";

import { CopyOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Empty,
  message,
  Popconfirm,
  Switch,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";

const { Text } = Typography;

export default function CouponTable({
  coupons,
  meta,
  page,
  limit,
  setPage,
  setLimit,
  isLoading,
  updateStatus,
  deleteCoupon,
  handleEdit,
  canEdit,
  canDelete,
}) {
  console.log("COUPONS =>", coupons);
  // ================= COLUMNS =================
  const handleCopy = async (code) => {
    await navigator.clipboard.writeText(code);

    message.success("Coupon copied");
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getCouponStatus = (startDate, endDate) => {
    if (!startDate || !endDate) {
      return {
        label: "-",
        color: "default",
      };
    }

    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (today < start) {
      return {
        label: "Upcoming",
        color: "gold",
      };
    }

    if (today > end) {
      return {
        label: "Expired",
        color: "red",
      };
    }

    return {
      label: "Running",
      color: "green",
    };
  };

  const columns = [
    {
      title: "Coupon",
      width: 300,

      render: (_, record) => (
        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
          }}
        >
          <Avatar
            shape="square"
            size={56}
            src={record?.image || undefined}
            style={{
              flexShrink: 0,
              borderRadius: 8,
            }}
          />

          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 4,
              }}
            >
              <Tag color="blue">{record.code}</Tag>

              <Tooltip title="Copy Coupon">
                <Button
                  type="text"
                  size="small"
                  icon={<CopyOutlined />}
                  onClick={() => handleCopy(record.code)}
                />
              </Tooltip>
            </div>

            <Text type="secondary" ellipsis={{ tooltip: record.title }}>
              {record.title}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Validity",
      width: 240,

      render: (_, record) => {
        const startDate = record?.validity?.startDate;
        const endDate = record?.validity?.endDate;

        const status = getCouponStatus(startDate, endDate);

        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <Text strong>
              {formatDate(startDate)} - {formatDate(endDate)}
            </Text>

            <div
              style={{
                display: "flex",
                gap: 6,
                flexWrap: "wrap",
              }}
            >
              <Tag color={status.color}>{status.label}</Tag>

              <Tag color={record.isAutoApply ? "blue" : "default"}>
                {record.isAutoApply ? "Auto Apply" : "Manual"}
              </Tag>
            </div>
          </div>
        );
      },
    },

    {
      title: "Discount",
      width: 120,
      align: "center",

      render: (_, record) => {
        const isPercent =
          record.discountType === "percent" ||
          record.discountType === "percentage";

        return (
          <Text strong style={{ fontSize: 15 }}>
            {isPercent
              ? `${record.discountValue}%`
              : `₹${record.discountValue}`}
          </Text>
        );
      },
    },
    {
      title: "Min Amount",
      width: 120,
      align: "center",

      render: (_, record) => (
        <Text strong>₹{Number(record.minAmount).toLocaleString("en-IN")}</Text>
      ),
    },
    {
      title: "Status",
      width: 120,
      align: "center",

      render: (_, record) => (
        <Tooltip
          title={!canEdit ? "You don't have permission to update status" : ""}
        >
          <Switch
            checked={record.isActive}
            disabled={!canEdit}
            loading={updateStatus.isPending}
            onChange={(checked) =>
              updateStatus.mutate({
                id: record._id,
                data: {
                  isActive: checked,
                },
              })
            }
          />
        </Tooltip>
      ),
    },
    // ================= CREATED =================

    {
      title: "Created",
      dataIndex: "createdAt",
      width: 130,
      responsive: ["md"],

      render: (date) => new Date(date).toLocaleDateString("en-IN"),
    },

    // ================= ACTION =================

    ...(canEdit || canDelete
      ? [
          {
            title: "Actions",
            width: 140,

            render: (_, record) => (
              <div
                style={{
                  display: "flex",
                  gap: 8,
                }}
              >
                {canEdit && (
                  <Tooltip title="Edit">
                    <Button
                      icon={<EditOutlined />}
                      onClick={() => handleEdit(record)}
                    />
                  </Tooltip>
                )}

                {canDelete && (
                  <Popconfirm
                    title="Delete Coupon?"
                    description="This action cannot be undone."
                    onConfirm={() => deleteCoupon.mutate(record._id)}
                  >
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      loading={
                        deleteCoupon.isPending &&
                        deleteCoupon.variables === record._id
                      }
                    />
                  </Popconfirm>
                )}
              </div>
            ),
          },
        ]
      : []),
  ];

  console.log("Coupons:", coupons);
  console.log("Is Array:", Array.isArray(coupons));

  return (
    <Table
      rowKey="_id"
      bordered
      size="middle"
      columns={columns}
      dataSource={coupons}
      loading={isLoading}
      scroll={{
        x: 1100,
      }}
      pagination={{
        current: page,
        pageSize: limit,
        total: meta?.totalRecords || 0,

        showSizeChanger: true,

        pageSizeOptions: ["10", "20", "50", "100"],

        onChange: (current, pageSize) => {
          setPage(current);
          setLimit(pageSize);
        },

        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
      }}
      locale={{
        emptyText: <Empty description="No coupons found" />,
      }}
    />
  );
}
