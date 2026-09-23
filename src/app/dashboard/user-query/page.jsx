"use client";

import TableFilters from "@/modules/shared/components/TableFilters";
import { usePermission } from "@/modules/shared/hooks/usePermission";
import { useDashboardUIStore } from "@/modules/shared/store/dashboardUI.store";
import { useContactQuery } from "@/modules/User-Query/hook/useContactQuery";
import { useUpdateContactStatus } from "@/modules/User-Query/hook/useUpdateContactStatus";
import { EyeOutlined } from "@ant-design/icons";
import {
  App,
  Button,
  Card,
  Empty,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

export default function CustomersPage() {
  const [tableData, setTableData] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState("");

  const [debouncedSearch] = useDebounce(search, 500);
  const { message } = App.useApp();
  const { canRead, isAdmin, canEdit } = usePermission("userQuery");
  const canFetch = canRead || isAdmin;

  const setScrollLocked = useDashboardUIStore((state) => state.setScrollLocked);

  // FIRST: query call
  const { data, isLoading } = useContactQuery({
    search: debouncedSearch,
    page,
    limit,
    status,
  });

  // SECOND: mutation
  const { mutate: updateStatus, isPending } = useUpdateContactStatus();
  const statusOptions = [
    {
      label: "Open",
      value: "Open",
    },
    {
      label: "In Progress",
      value: "In-Progress",
    },
    {
      label: "Resolved",
      value: "Resolved",
    },
    {
      label: "Closed",
      value: "Closed",
    },
  ];
  // THIRD: sync local table state
  useEffect(() => {
    setTableData(data?.data?.contacts || []);
  }, [data]);

  // FOURTH: reset page on search
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const customers = tableData;
  const hasActiveFilters = status !== undefined || search?.trim();

  const getStatusColor = (status) => {
    switch (status) {
      case "Open":
        return "blue";
      case "In-Progress":
        return "orange";
      case "Resolved":
        return "green";
      case "Closed":
        return "red";
      default:
        return "default";
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "fullName",
      width: 180,
      render: (value) => value || "-",
    },
    {
      title: "Email",
      dataIndex: "email",
      width: 280,
      render: (value) => (
        <Typography.Text
          copyable
          ellipsis={{ tooltip: value }}
          style={{
            maxWidth: 220,
            display: "inline-block",
          }}
        >
          {value || "-"}
        </Typography.Text>
      ),
    },
    {
      title: "Type",
      dataIndex: "Type",
      width: 120,
      render: (value) => (
        <Tag color="magenta">
          {value ? value.charAt(0).toUpperCase() + value.slice(1) : "-"}
        </Tag>
      ),
    },
    {
      title: "Ticket ID",
      dataIndex: "ticketId",
      width: 150,
      render: (value) => (value ? <Tag color="gold">{value}</Tag> : "-"),
    },
    {
      title: "Subject",
      dataIndex: "subject",
      width: 180,
      render: (value) => <Tag color="purple">{value || "-"}</Tag>,
    },
    {
      title: "Message",
      dataIndex: "message",
      width: 100,
      render: (value) => (
        <Space size={4}>
          <Typography.Text
            ellipsis={{ tooltip: value }}
            style={{
              maxWidth: 100,
              display: "inline-block",
            }}
          >
            {value}
          </Typography.Text>

          <Button
            type="text"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedMessage(value);
              setMessageModalOpen(true);
            }}
          />
        </Space>
      ),
    },
    {
      title: "Booking Ref",
      dataIndex: "BookingRefNo",
      width: 170,
      render: (value) => (value ? <Tag color="geekblue">{value}</Tag> : "-"),
    },
    {
      title: "Category",
      dataIndex: "supportCategory",
      width: 180,
      render: (value) => (
        <Tag color="cyan">{value?.replaceAll("_", " ") || "-"}</Tag>
      ),
    },
    ...(canEdit
      ? [
          {
            title: "Status",
            dataIndex: "status",
            width: 180,
            render: (value, record) => (
              <Select
                size="small"
                value={value}
                style={{ width: 150 }}
                loading={updatingId === record._id}
                onOpenChange={(open) => {
                  setScrollLocked(open);
                }}
                onChange={(status) => {
                  setTableData((prev) =>
                    prev.map((item) =>
                      item._id === record._id ? { ...item, status } : item,
                    ),
                  );

                  updateStatus({
                    id: record._id,
                    payload: {
                      status,
                    },
                  });
                }}
                options={statusOptions.map((item) => ({
                  value: item.value,
                  label: (
                    <Tag color={getStatusColor(item.value)}>{item.label}</Tag>
                  ),
                }))}
              />
            ),
          },
        ]
      : []),
    {
      title: "Created",
      dataIndex: "createdAt",
      width: 180,
      render: (value) => (
        <Typography.Text type="secondary">
          {new Date(value).toLocaleString("en-IN")}
        </Typography.Text>
      ),
    },
  ];
  return (
    <Card title="Customer Queries">
      {canFetch ? (
        <div style={{ width: "100%" }}>
          <TableFilters
            search={search}
            setSearch={setSearch}
            searchPlaceholder="Search by Email or BookingRefNo"
            statusOptions={statusOptions.map((item) => ({
              value: item.value,
              label: <Tag color={getStatusColor(item.value)}>{item.label}</Tag>,
            }))}
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
            scroll={{ x: 1600 }}
            pagination={{
              current: page,
              pageSize: limit,
              total: data?.data?.pagination?.total,
              showSizeChanger: true,
              onChange: (page, size) => {
                setPage(page);
                setLimit(size);
              },
            }}
          />
        </div>
      ) : (
        <Empty description="No permission to view data" />
      )}

      <Modal
        title="User Message"
        open={messageModalOpen}
        footer={null}
        onCancel={() => setMessageModalOpen(false)}
        width={700}
      >
        <Typography.Paragraph
          style={{
            whiteSpace: "pre-wrap",
            marginBottom: 0,
            maxHeight: "400px",
            overflowY: "auto",
          }}
        >
          {selectedMessage}
        </Typography.Paragraph>
      </Modal>
    </Card>
  );
}
