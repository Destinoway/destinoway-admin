"use client";

import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Empty,
  Flex,
  Popconfirm,
  Switch,
  Table,
  Tag,
  theme,
  Tooltip,
  Typography,
} from "antd";
import { getLevelConfig } from "../data/MarkupsData";
const { Text } = Typography;

export default function MarkupTable({
  levelFilter,
  markups,
  isLoading,
  meta,
  page,
  limit,
  setPage,
  setLimit,
  deleteMarkup,
  updateStatus,
  handleEdit,
  taxes,
  taxMeta,
  taxLoading,
  deleteTax,
  updateTaxStatus,
  canEdit,
  canDelete,
}) {
  const renderTarget = (record) => {
    const formatDate = (date) => {
      if (!date) return null;
      return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      });
    };

    const config = getLevelConfig(record)[record?.level];
    if (!config) return "-";
    const hasDateRange = record?.startDate && record?.endDate;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          minWidth: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
            minWidth: 0,
          }}
        >
          {/* TAG */}

          <Tag
            icon={config?.icon}
            color={config?.color}
            style={{
              margin: 0,
              borderRadius: 999,
              fontWeight: 600,
              paddingInline: 10,
              height: 26,
              display: "flex",
              alignItems: "center",
              fontSize: 11,
              flexShrink: 0,
            }}
          >
            {config?.label}
          </Tag>

          {/* CONTENT */}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              minWidth: 0,
              flex: 1,
            }}
          >
            {/* TITLE */}

            <Text
              strong
              style={{
                fontSize: 14,
                lineHeight: 1.35,
                wordBreak: "break-word",
              }}
            >
              {config?.value}
            </Text>

            {/* SUBTITLE */}

            <Text
              type="secondary"
              style={{
                fontSize: 12,
                lineHeight: 1.4,
              }}
            >
              {config?.subtitle}
            </Text>
          </div>
        </div>

        {/* ================= BOTTOM ================= */}

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          {hasDateRange ? (
            <Tag
              color="gold"
              style={{
                margin: 0,
                borderRadius: 999,
                fontSize: 11,
                paddingInline: 10,
                fontWeight: 500,
              }}
            >
              {formatDate(record?.startDate)} → {formatDate(record?.endDate)}
            </Tag>
          ) : (
            <Tag
              style={{
                margin: 0,
                borderRadius: 999,
                fontSize: 11,
                paddingInline: 10,
                color: "rgba(255,255,255,0.45)",
                borderColor: "rgba(255,255,255,0.08)",
                background: "transparent",
              }}
            >
              No Expiry
            </Tag>
          )}
        </div>
      </div>
    );
  };
  const { token } = theme.useToken();

  // ================= COLUMNS =================

  const taxColumns = [
    // ================= COUNTRY =================

    {
      title: "Country",
      dataIndex: "countryName",
      width: 240,

      render: (_, record) => (
        <Flex align="center" gap={12}>
          <Avatar
            shape="square"
            size={42}
            style={{
              background: token.colorPrimaryBg,
              color: token.colorPrimary,
              fontWeight: 600,
            }}
          >
            🌍
          </Avatar>

          <div>
            <Typography.Text strong>{record.countryName}</Typography.Text>

            <br />

            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              {record.countryCode}
            </Typography.Text>
          </div>
        </Flex>
      ),
    },

    // ================= RULE TYPE =================

    {
      title: "Rule",
      dataIndex: "ruleType",
      width: 140,
      align: "center",

      render: (value) => (
        <Tag
          variant={false}
          color={value === "slab" ? "processing" : "success"}
          style={{
            borderRadius: 999,
            paddingInline: 12,
            fontWeight: 600,
          }}
        >
          {value === "slab" ? "SLAB" : "FLAT"}
        </Tag>
      ),
    },
    {
      title: "Tax Details",
      width: 380,

      render: (_, record) => {
        const value =
          record.taxType === "percentage"
            ? `${record.taxValue}%`
            : `₹${record.taxValue}`;

        // ================= FLAT =================

        if (record.ruleType === "flat") {
          return (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 14px",
                borderRadius: 12,
                background: token.colorFillAlter,
                border: `1px solid ${token.colorBorderSecondary}`,
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  background: token.colorPrimaryBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  color: token.colorPrimary,
                }}
              >
                ₹
              </div>

              <div>
                <Typography.Text strong style={{ fontSize: 16 }}>
                  {value}
                </Typography.Text>

                <br />

                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  Flat {record.taxType}
                </Typography.Text>
              </div>
            </div>
          );
        }

        // ================= SLAB =================

        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              width: "100%",
            }}
          >
            {record.slabs?.map((slab, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 14px",
                  borderRadius: 10,
                  background: token.colorFillAlter,
                  border: `1px solid ${token.colorBorderSecondary}`,
                }}
              >
                <div>
                  <Typography.Text strong>
                    From ₹{slab.minAmount}
                  </Typography.Text>

                  <br />

                  <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                    Booking Amount
                  </Typography.Text>
                </div>

                <Tag
                  color="processing"
                  variant={false}
                  style={{
                    fontWeight: 600,
                    paddingInline: 12,
                    borderRadius: 999,
                  }}
                >
                  {record.taxType === "percentage"
                    ? `${slab.taxValue}%`
                    : `₹${slab.taxValue}`}
                </Tag>
              </div>
            ))}
          </div>
        );
      },
    },
    ...(canEdit || canDelete
      ? [
          {
            title: "Actions",
            width: 180,

            render: (_, record) => (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                {canEdit && (
                  <>
                    <Tooltip title="Edit">
                      <Button
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record, true)}
                      />
                    </Tooltip>

                    <Switch
                      checked={record?.isActive}
                      loading={updateTaxStatus.isPending}
                      onChange={(checked) =>
                        updateTaxStatus.mutate({
                          id: record._id,
                          data: {
                            isActive: checked,
                          },
                        })
                      }
                    />
                  </>
                )}

                {canDelete && (
                  <Popconfirm
                    title="Delete Tax Rule?"
                    description="This action cannot be undone."
                    onConfirm={() => deleteTax.mutate(record._id)}
                  >
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      loading={deleteTax.isPending}
                    />
                  </Popconfirm>
                )}
              </div>
            ),
          },
        ]
      : []),
  ];

  const markupColumns = [
    {
      title: "Target",
      dataIndex: "level",
      width: 260,
      ellipsis: true,
      render: (_, record) => renderTarget(record),
    },
    {
      title: "Markup",
      width: 120,
      align: "center",

      render: (_, record) => (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Text strong>
            {record?.markupType === "percentage"
              ? `${record?.markupValue}%`
              : `₹${record?.markupValue}`}
          </Text>

          <Text
            type="secondary"
            style={{
              fontSize: 12,
              textTransform: "capitalize",
            }}
          >
            {record?.markupType}
          </Text>
        </div>
      ),
    },
    {
      title: "Service Charge",
      width: 140,
      align: "center",

      render: (_, record) => (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Text strong>
            {record?.markupType === "percentage"
              ? `${record?.serviceChargeValue}%`
              : `₹${record?.serviceChargeValue}`}
          </Text>

          <Text
            type="secondary"
            style={{
              fontSize: 12,
              textTransform: "capitalize",
            }}
          >
            {record?.markupType}
          </Text>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      width: 110,
      align: "center",
      render: (val) =>
        val ? (
          <Tag
            color="green"
            style={{
              margin: 0,
            }}
          >
            Active
          </Tag>
        ) : (
          <Tag
            color="red"
            style={{
              margin: 0,
            }}
          >
            Inactive
          </Tag>
        ),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      width: 120,
      responsive: ["md"],
      render: (val) => new Date(val).toLocaleDateString("en-IN"),
    },
    ...(canEdit || canDelete
      ? [
          {
            title: "Actions",
            width: 180,

            render: (_, record) => (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                {canEdit && (
                  <>
                    <Tooltip title="Edit">
                      <Button
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                      />
                    </Tooltip>

                    <Switch
                      checked={record?.isActive}
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
                  </>
                )}

                {canDelete && (
                  <Popconfirm
                    title="Delete markup?"
                    description="This action cannot be undone."
                    onConfirm={() => deleteMarkup.mutate(record._id)}
                  >
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      loading={deleteMarkup.isPending}
                    />
                  </Popconfirm>
                )}
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <Table
      rowKey="_id"
      columns={levelFilter === "serviceTax" ? taxColumns : markupColumns}
      dataSource={levelFilter === "serviceTax" ? taxes : markups}
      loading={levelFilter === "serviceTax" ? taxLoading : isLoading}
      bordered
      size="middle"
      scroll={{
        x: 820,
      }}
      pagination={{
        current: page,
        pageSize: limit,
        total:
          levelFilter === "serviceTax"
            ? taxMeta?.totalRecords || 0
            : meta?.totalRecords || 0,
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "50", "100"],
        onChange: (current, pageSize) => {
          setPage(current);
          setLimit(pageSize);
        },
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
        responsive: true,
      }}
      locale={{
        emptyText: (
          <Empty
            description={
              levelFilter === "serviceTax"
                ? "No tax rules found"
                : "No markups found"
            }
          />
        ),
      }}
    />
  );
}
