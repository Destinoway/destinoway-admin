"use client";

import { EyeOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import { Badge, Button, Empty, Popover, Space, Tag, Typography } from "antd";

const { Text } = Typography;

export default function PermissionPopover({ permissions, onOpenChange }) {
  if (!permissions || Object.keys(permissions).length === 0) {
    return <Tag className="!m-0 !rounded-full">No Access</Tag>;
  }

  const permissionModules = Object.entries(permissions).filter(([_, actions]) =>
    Object.values(actions).some(Boolean),
  );

  const totalPermissions = permissionModules.reduce((acc, [_, actions]) => {
    return acc + Object.values(actions).filter(Boolean).length;
  }, 0);

  const content = (
    <div className="w-[300px] max-h-[400px] overflow-y-auto">
      <div className="mb-[18px] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SafetyCertificateOutlined className="!text-[16px] !text-[#1677ff]" />

          <Text strong className="!text-[15px]">
            Role Permissions
          </Text>
        </div>

        <Badge
          count={totalPermissions}
          className="[&_.ant-badge-count]:!bg-[#1677ff]"
        />
      </div>

      {!permissionModules?.length ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No permissions assigned"
        />
      ) : (
        <div className="flex flex-col gap-[14px]">
          {permissionModules.map(([module, actions]) => {
            const enabled = Object.entries(actions)
              .filter(([_, val]) => val)
              .map(([key]) => key);

            return (
              <div key={module} className="border-b border-white/[0.06] pb-3">
                {/* ================= TOP ================= */}

                <div className="mb-[10px] flex items-center justify-between">
                  {/* MODULE */}

                  <Text strong className="!text-[13px] !capitalize">
                    {module}
                  </Text>

                  {/* COUNT */}

                  <Tag
                    color="blue"
                    className="!m-0 !rounded-full !px-[10px] !text-[11px] !font-medium"
                  >
                    {enabled.length} Access
                  </Tag>
                </div>

                <Space wrap size={[6, 6]}>
                  {enabled.map((act) => (
                    <Tag
                      key={act}
                      className="!m-0 !rounded-full !border !border-[rgba(82,196,26,0.2)] !bg-[rgba(82,196,26,0.12)] !px-[10px] !text-[11px] !font-medium !capitalize !text-[#52c41a]"
                    >
                      {act}
                    </Tag>
                  ))}
                </Space>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <Popover
      content={content}
      trigger="click"
      placement="bottom"
      onOpenChange={(visible) => {
        onOpenChange?.(visible);
      }}
      classNames={{
        body: "!rounded-[5px] !p-4",
      }}
    >
      <Button
        icon={<EyeOutlined />}
        size="small"
        className="!rounded-full !font-medium"
      >
        View Permissions
      </Button>
    </Popover>
  );
}
