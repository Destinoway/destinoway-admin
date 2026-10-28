"use client";

import { useRoles } from "@/modules/role/hooks/useRoles";
import TableFilters from "@/modules/shared/components/TableFilters";
import { usePermission } from "@/modules/shared/hooks/usePermission"; // ✅ NEW
import { updateStaffStatus } from "@/modules/staff/api/user.service";
import StaffFormDrawer from "@/modules/staff/components/StaffFormDrawer";
import { useStaff } from "@/modules/staff/hooks/useStaff";
import { EditOutlined, PlusOutlined, UserOutlined } from "@ant-design/icons";
import { useQueryClient } from "@tanstack/react-query";
import { Avatar, Button, Card, Empty, Space, Switch, Table, Tag, Tooltip, Typography } from "antd";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import PermissionPopover from "../../../../modules/shared/components/PermissionPopover";
export default function StaffPage() {
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [status, setStatus] = useState();
  const [roleId, setRoleId] = useState();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  const queryClient = useQueryClient();
  const { roleOptions: roles } = useRoles(false, true);

  const roleOptions = roles.map((role) => ({
    label: role.label,
    value: role.value,
  }));

  const { canRead, canCreate, canEdit, isAdmin } = usePermission("users");

  const canFetch = canRead || isAdmin;

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const { data, isLoading } = useStaff({
    search: debouncedSearch,
    page,
    limit,
    roleId,
    isActive: status,
    sortBy,
    order,
  });

  const staff = data?.data || [];

  const handleStatusUpdate = async (id, newStatus) => {
    queryClient.setQueryData(["staff"], (old) => {
      if (!old) return old;
      return {
        ...old,
        data: old.data.map((u) =>
          u._id === id ? { ...u, isActive: newStatus } : u,
        ),
      };
    });

    await updateStaffStatus(id, {
      isActive: newStatus,
    });
  };

  const handleEdit = (record) => {
    setEditData(record);
    setOpen(true);
  };

  const hasActiveFilters =
    status !== undefined || roleId !== undefined || search?.trim();

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: true,
      width: 220,
      render: (name, record) => (
        <Space size={10}>
          <Avatar
            size={36}
            icon={<UserOutlined />}
            className="!bg-sky-100 !font-semibold !text-sky-700"
          >
            {name?.slice(0, 1)?.toUpperCase()}
          </Avatar>
          <span className="min-w-0">
            <Typography.Text strong className="block max-w-[150px]" ellipsis={{ tooltip: name || "Staff member" }}>
              {name || "Staff member"}
            </Typography.Text>
            {record.isSystemRole && <Tag color="gold" className="!m-0 !rounded-full !text-[10px]">System</Tag>}
          </span>
        </Space>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: true,
      width: 240,
      render: (email) => (
        <Typography.Text type="secondary" ellipsis={{ tooltip: email }} className="max-w-[210px]">
          {email || "-"}
        </Typography.Text>
      ),
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
      width: 150,
      render: (mobile) => mobile || <Typography.Text type="secondary">-</Typography.Text>,
    },

    {
      title: "Role",
      width: 150,
      render: (_, r) => r.role?.name ? (
        <Tag color="geekblue" className="!m-0 !rounded-full !px-2.5">{r.role.name}</Tag>
      ) : <Tag className="!m-0 !rounded-full">No role</Tag>,
    },

    {
      title: "Status",
      dataIndex: "isActive",
      width: 120,
      render: (val) => val ? (
        <Tag color="green" className="!m-0 !rounded-full !px-2.5">Active</Tag>
      ) : (
        <Tag color="red" className="!m-0 !rounded-full !px-2.5">Inactive</Tag>
      ),
    },

    {
      title: "Permissions",
      width: 150,
      render: (_, r) => {
        const perms = r.permissions || r.role?.permissions;
        return <PermissionPopover permissions={perms} />;
      },
    },

    {
      title: "Actions",
      width: 120,
      render: (_, record) => (
        <Space>
          {/* EDIT */}
          {canEdit && (
            <Tooltip title="Edit Staff">
              <Button
                className="!rounded-lg"
                icon={<EditOutlined />}
                onClick={() => handleEdit(record)}
              />
            </Tooltip>
          )}

          {/* STATUS TOGGLE */}
          {!record.isSystemRole && canEdit && (
            <Tooltip
              title={record.isActive ? "Deactivate Staff" : "Activate Staff"}
            >
              <Switch
                checked={!!record.isActive}
                onChange={(checked) => handleStatusUpdate(record._id, checked)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Card
      className="management-page-card !rounded-2xl !border-0 !shadow-sm"
      title={
        <div className="flex flex-col gap-0.5">
          <Typography.Text strong className="!text-lg">Staff Management</Typography.Text>
          <Typography.Text type="secondary" className="!text-xs">Manage staff profiles, roles and access status</Typography.Text>
        </div>
      }
      extra={
        canCreate && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditData(null);
              setOpen(true);
            }}
          >
            Add Staff
          </Button>
        )
      }
    >
      {canFetch ? (
        <div style={{ width: "100%", overflowX: "auto" }}>
          <TableFilters
            search={search}
            setSearch={setSearch}
            status={status}
            setStatus={setStatus}
            roleId={roleId}
            setRoleId={setRoleId}
            isLoading={isLoading}
            roleOptions={roleOptions}
            hasActiveFilters={hasActiveFilters}
            onReset={() => {
              setSearch("");
              setStatus(undefined);
              setRoleId(undefined);
              setPage(1);
            }}
          />

          <Table
            className="management-table staff-management-table"
            loading={isLoading}
            columns={columns}
            dataSource={staff}
            rowKey="_id"
            size="middle"
            bordered={false}
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

      <StaffFormDrawer open={open} setOpen={setOpen} editData={editData} />
    </Card>
  );
}
