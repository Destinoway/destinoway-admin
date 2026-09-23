"use client";

import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { App, Button, Empty, Popconfirm, Table, Tag, Tooltip } from "antd";

import { MASTER_DATA_TYPES } from "../constants/masterData.constants";

export default function MasterDataTable({
  masterData,
  isLoading,
  deleteMasterData,
  canEdit,
  canDelete,
  onEdit,
}) {
  const { message } = App.useApp();

  const getTypeColor = (type) => {
    switch (type) {
      case MASTER_DATA_TYPES.VACATION_TYPES:
        return "blue";

      case MASTER_DATA_TYPES.DESTINATIONS:
        return "green";

      case MASTER_DATA_TYPES.BLOG_CATEGORIES:
        return "purple";

      default:
        return "default";
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case MASTER_DATA_TYPES.VACATION_TYPES:
        return "Vacation Type";

      case MASTER_DATA_TYPES.DESTINATIONS:
        return "Destination";

      case MASTER_DATA_TYPES.BLOG_CATEGORIES:
        return "Blog Category";

      default:
        return type;
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "placeName",
      key: "placeName",
    },

    {
      title: "Category",
      dataIndex: "type",
      key: "type",
      render: (value) => (
        <Tag color={getTypeColor(value)}>{getTypeLabel(value)}</Tag>
      ),
    },

    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (value) =>
        value ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="red">Inactive</Tag>
        ),
    },

    {
      title: "Updated",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (value) => new Date(value).toLocaleDateString("en-IN"),
    },

    ...(canEdit || canDelete
      ? [
          {
            title: "Actions",
            key: "actions",
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
                      onClick={() => onEdit(record)}
                    />
                  </Tooltip>
                )}

                {canDelete && (
                  <Popconfirm
                    title="Delete this item?"
                    okText="Yes"
                    cancelText="No"
                    onConfirm={async () => {
                      try {
                        await deleteMasterData.mutateAsync(record._id);

                        message.success("Item deleted successfully");
                      } catch {}
                    }}
                  >
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      loading={
                        deleteMasterData.isPending &&
                        deleteMasterData.variables === record._id
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

  return (
    <Table
      rowKey="_id"
      bordered
      size="middle"
      loading={isLoading}
      columns={columns}
      dataSource={masterData}
      pagination={false}
      locale={{
        emptyText: <Empty description="No master data found" />,
      }}
    />
  );
}
