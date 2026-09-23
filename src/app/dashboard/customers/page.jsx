"use client";

import TableFilters from "@/modules/shared/components/TableFilters";
import { usePermission } from "@/modules/shared/hooks/usePermission";
import { useCustomers } from "@/modules/staff/hooks/useCustomer";
import {
  GoogleOutlined,
  MailOutlined,
  MobileOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Card,
  Empty,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [status, setStatus] = useState();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  const { canRead, isAdmin } = usePermission("customers");
  const canFetch = canRead || isAdmin;

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const { data, isLoading } = useCustomers(
    {
      search: debouncedSearch,
      page,
      limit,
      isActive: status,
      sortBy,
      order,
    },
    canFetch,
  );

  const customers = data?.data || [];

  const hasActiveFilters = status !== undefined || search?.trim();

  const columns = [
    {
      title: "avtar",
      width: 70,
      render: (_, r) => <Avatar src={r.avatar}>{r.name?.charAt(0)}</Avatar>,
    },

    {
      title: "Customer",
      render: (_, r) => (
        <Space orientation="vertical" size={0}>
          <span>{r.name || "-"}</span>
          <Typography.Text type="secondary">{r.email}</Typography.Text>
        </Space>
      ),
      sorter: true,
    },

    {
      title: "Mobile",
      dataIndex: "mobile",
      render: (val) => val || "-",
    },

    {
      title: "City",
      dataIndex: "city",
      render: (val) => val || "-",
    },

    {
      title: "Provider",
      render: (_, r) => {
        const icons = {
          google: {
            icon: <GoogleOutlined />,
            color: "#DB4437",
            title: "Google",
          },
          email: {
            icon: <MailOutlined />,
            color: "#2563EB",
            title: "Email",
          },
          otp: {
            icon: <MobileOutlined />,
            color: "#059669",
            title: "OTP",
          },
        };

        return (
          <Space size={12}>
            {r.providers?.map((p) => {
              const item = icons[p];
              if (!item) return null;

              return (
                <Tooltip key={p} title={item.title}>
                  <span
                    style={{
                      color: item.color,
                      fontSize: 18,
                      cursor: "pointer",
                    }}
                  >
                    {item.icon}
                  </span>
                </Tooltip>
              );
            })}
          </Space>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "isActive",
      render: (val) =>
        val ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>,
    },

    {
      title: "Created",
      dataIndex: "createdAt",
      render: (val) => new Date(val).toLocaleDateString("en-IN"),
    },
  ];

  return (
    <Card title="Customers Management">
      {canFetch ? (
        <div style={{ width: "100%", overflowX: "auto" }}>
          <TableFilters
            search={search}
            setSearch={setSearch}
            status={status}
            setStatus={setStatus}
            hasActiveFilters={hasActiveFilters}
            isLoading={isLoading}
            onReset={() => {
              setSearch("");
              setStatus(undefined);
              setPage(1);
            }}
          />

          <Table
            loading={isLoading}
            columns={columns}
            dataSource={customers}
            rowKey="_id"
            scroll={{ x: 900 }}
            pagination={{
              current: page,
              pageSize: limit,
              total: data?.meta?.total,
              showSizeChanger: true,
              onChange: (page, size) => {
                setPage(page);
                setLimit(size);
              },
            }}
            onChange={(pagination, filters, sorter) => {
              if (!Array.isArray(sorter) && sorter.field) {
                setSortBy(sorter.field);
                setOrder(sorter.order === "ascend" ? "asc" : "desc");
              }
            }}
          />
        </div>
      ) : (
        <Empty description="No permission to view data" />
      )}
    </Card>
  );
}
