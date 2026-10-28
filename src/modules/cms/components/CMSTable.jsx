"use client";

import {
    CopyOutlined,
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
} from "@ant-design/icons";
import { App, Button, Empty, Popconfirm, Table, Tag, Tooltip } from "antd";
import { buildFrontendUrl } from "../utils/cmsUrl";

export default function CMSTable({
  pages,
  meta,
  page,
  limit,
  setPage,
  setLimit,
  isLoading,
  deleteCMS,
  canEdit,
  canDelete,
}) {
  const { message } = App.useApp();

  const handleCopyUrl = async (url) => {
    try {
      await navigator.clipboard.writeText(buildFrontendUrl(url));
      message.success("URL copied successfully");
    } catch {
      message.error("Failed to copy URL");
    }
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      width: 220,
    },
    {
      title: "Slug",
      dataIndex: "slug",
      width: 280,
      render: (val, record) => {
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
            }}
          >
            <span
              style={{
                color: "#1677ff",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: 200,
              }}
            >
              {record.url || `/${val}`}
            </span>

            <Tooltip title="Copy URL">
              <Button
                type="text"
                size="small"
                icon={<CopyOutlined />}
                disabled={!record.url}
                onClick={() => handleCopyUrl(record.url)}
              />
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: "Type",
      dataIndex: "entityType",
      width: 120,
      render: (val) => <Tag color="blue">{val}</Tag>,
    },
    {
      title: "Published",
      dataIndex: "isPublished",
      width: 120,
      render: (val) =>
        val ? <Tag color="green">Published</Tag> : <Tag color="red">Draft</Tag>,
    },
    {
      title: "Updated",
      dataIndex: "updatedAt",
      width: 140,
      render: (val) => (val ? new Date(val).toLocaleDateString("en-IN") : "-"),
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
                  gap: 8,
                }}
              >
                {/* EDIT */}

                {canEdit && (
                  <Tooltip title="Edit">
                    <Button
                      icon={<EditOutlined />}
                      href={`/dashboard/cms/edit/${record._id}`}
                    />
                  </Tooltip>
                )}

                {/* PREVIEW */}

                <Tooltip title="Preview">
                  <Button
                    icon={<EyeOutlined />}
                    href={buildFrontendUrl(record.url, { preview: true })}
                    disabled={!record.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                </Tooltip>

                {/* DELETE */}

                {canDelete && (
                  <Popconfirm
                    title="Delete page?"
                    onConfirm={async () => {
                      try {
                        await deleteCMS.mutateAsync(record._id);
                      } catch {}
                    }}
                  >
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      loading={
                        deleteCMS.variables === record._id &&
                        deleteCMS.isPending
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
      columns={columns}
      dataSource={pages}
      loading={isLoading}
      bordered
      size="middle"
      scroll={{
        x: 900,
      }}
      pagination={{
        current: page,
        pageSize: limit,
        total: meta?.total || 0,
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "50"],
        onChange: (current, pageSize) => {
          setPage(current);
          setLimit(pageSize);
        },
      }}
      locale={{
        emptyText: <Empty description="No CMS pages found" />,
      }}
    />
  );
}
