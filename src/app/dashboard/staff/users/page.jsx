"use client";

import { useRoles } from "@/modules/role/hooks/useRoles";
import TableFilters from "@/modules/shared/components/TableFilters";
import { usePermission } from "@/modules/shared/hooks/usePermission"; // ✅ NEW
import { updateStaffStatus } from "@/modules/staff/api/user.service";
import StaffFormModal from "@/modules/staff/components/StaffFormModal";
import { useStaff } from "@/modules/staff/hooks/useStaff";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Card, Empty, Space, Switch, Table, Tag, Tooltip } from "antd";
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

  console.log("rolesData in userpage", roles);
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
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: true,
    },
    { title: "Mobile", dataIndex: "mobile" },

    {
      title: "Role",
      render: (_, r) =>
        r.role?.name ? (
          <Tag color="blue">{r.role.name}</Tag>
        ) : (
          <Tag>No Role</Tag>
        ),
    },

    {
      title: "Status",
      dataIndex: "isActive",
      render: (val) =>
        val ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>,
    },

    {
      title: "Permissions",
      render: (_, r) => {
        const perms = r.permissions || r.role?.permissions;
        return <PermissionPopover permissions={perms} />;
      },
    },

    {
      title: "Actions",
      render: (_, record) => (
        <Space>
          {/* EDIT */}
          {canEdit && (
            <Tooltip title="Edit Staff">
              <Button
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
      title="Staff Management"
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
            loading={isLoading}
            columns={columns}
            dataSource={staff}
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

      <StaffFormModal open={open} setOpen={setOpen} editData={editData} />
    </Card>
  );
}
