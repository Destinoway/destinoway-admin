"use client";

import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";

import {
  Button,
  Card,
  Empty,
  Popconfirm,
  Popover,
  Switch,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";

import { useRoles } from "@/modules/role/hooks/useRoles";
import { usePermission } from "@/modules/shared/hooks/usePermission";
import { useDashboardUIStore } from "@/modules/shared/store/dashboardUI.store";
import { useRouter } from "next/navigation";
import PermissionPopover from "../../../../modules/shared/components/PermissionPopover";
const { Text } = Typography;

export default function RolesPage() {
  const router = useRouter();
  // ================= PERMISSIONS =================
  const setScrollLocked = useDashboardUIStore((state) => state.setScrollLocked);
  const { canRead, canCreate, canEdit, isAdmin } = usePermission("roles");
  const canFetch = canRead || isAdmin;

  // ================= API =================

  const { roles, isLoading, updateStatus, deleteRole } = useRoles(canFetch);

  // ================= DELETE =================

  const handleDelete = async (record) => {
    try {
      await deleteRole(record?._id);
    } catch (error) {
      console.error("DELETE FAILED:", error);
    }
  };

  // ================= COLUMNS =================

  const columns = [
    {
      title: "Role",
      dataIndex: "name",
      width: 260,

      render: (_, record) => (
        <div className="flex min-w-[170px] items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-sm font-bold uppercase text-indigo-700">
            {record?.name?.slice(0, 1) || "R"}
          </span>
          <div className="flex min-w-0 flex-col gap-1">
            <Text strong className="!text-sm">{record?.name || "Unnamed role"}</Text>
            {record?.isSystemRole && (
              <Tag color="gold" className="!m-0 !w-fit !rounded-full !text-[10px] !font-medium">
                System role
              </Tag>
            )}
          </div>
        </div>
      ),
    },

    {
      title: "Description",
      dataIndex: "description",
      width: 300,

      render: (description) => {
        if (!description) {
          return <Text type="secondary">-</Text>;
        }
        const isLong = description.length > 50;
        const content = (
          <div className="max-w-[350px] break-words leading-[1.6]">
            {description}
          </div>
        );

        if (!isLong) {
          return <Text>{description}</Text>;
        }

        return (
          <Popover
            title="Description"
            content={content}
            trigger="click"
            placement="topLeft"
            onOpenChange={setScrollLocked}
          >
            <div className="flex cursor-pointer flex-col gap-1">
              <Text ellipsis className="!block !max-w-[240px]">
                {description}
              </Text>

              <Tag
                color="blue"
                className="!m-0 !w-fit !cursor-pointer !rounded-full !text-[11px] !font-medium"
              >
                Click to view
              </Tag>
            </div>
          </Popover>
        );
      },
    },

    {
      title: "Status",
      dataIndex: "isActive",
      width: 130,
      align: "center",

      render: (val) =>
        val ? (
          <Tag color="green" className="!m-0 !rounded-full !font-medium">
            Active
          </Tag>
        ) : (
          <Tag color="red" className="!m-0 !rounded-full !font-medium">
            Inactive
          </Tag>
        ),
    },

    {
      title: "Permissions",
      dataIndex: "permissions",
      width: 180,
      align: "center",

      render: (permissions) => (
        <PermissionPopover
          permissions={permissions}
          onOpenChange={setScrollLocked}
        />
      ),
    },

    {
      title: "Created",
      dataIndex: "createdAt",
      width: 150,
      responsive: ["lg"],

      render: (val) =>
        val
          ? new Date(val).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "-",
    },

    ...(canEdit
      ? [
          {
            title: "Actions",
            width: 170,
            align: "center",

            render: (_, record) => (
              <div className="flex items-center justify-center gap-2.5">
                {/* EDIT */}

                <Tooltip title="Edit Role">
              <Button
                    className="!rounded-lg"
                    icon={<EditOutlined />}
                    onClick={() =>
                      router.push(
                        `/dashboard/staff/create-role?id=${record._id}`,
                      )
                    }
                  />
                </Tooltip>

                {/* STATUS */}

                {!record?.isSystemRole && (
                  <Tooltip
                    title={
                      record?.isActive ? "Deactivate Role" : "Activate Role"
                    }
                  >
                    <Switch
                      checked={record?.isActive}
                      onChange={(checked) =>
                        updateStatus({
                          id: record?._id,
                          data: {
                            isActive: checked,
                          },
                        })
                      }
                    />
                  </Tooltip>
                )}
                {!record?.isSystemRole && (
                  <Popconfirm
                    title="Delete Role"
                    description={`Are you sure you want to delete "${record?.name}"?`}
                    okText="Yes"
                    cancelText="No"
                    okButtonProps={{
                      danger: true,
                    }}
                    onConfirm={() => handleDelete(record)}
                  >
                    <Tooltip title="Delete Role">
                      <Button danger className="!rounded-lg" icon={<DeleteOutlined />} />
                    </Tooltip>
                  </Popconfirm>
                )}
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <>
      <Card
        className="management-page-card !rounded-2xl !border-0 !shadow-sm"
        styles={{
          body: {
            paddingTop: 18,
          },
        }}
        title={
          <div className="flex flex-col gap-0.5">
            <Text strong className="!text-[18px]">
              Role Management
            </Text>

            <Text type="secondary" className="!text-[13px]">
              Manage roles and permissions for staff access
            </Text>
          </div>
        }
        extra={
          canCreate && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              onClick={() => router.push("/dashboard/staff/create-role")}
            >
              Create Role
            </Button>
          )
        }
      >
        {canFetch ? (
          <Table
            className="management-table role-management-table"
            columns={columns}
            dataSource={roles}
            rowKey="_id"
            loading={isLoading}
            size="middle"
            scroll={{ x: 900 }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50"],
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total}`,

              responsive: true,
            }}
            locale={{
              emptyText: <Empty description="No roles available" />,
            }}
          />
        ) : (
          <Empty description="No permission to view roles" />
        )}
      </Card>
    </>
  );
}
