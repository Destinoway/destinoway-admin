"use client";

import {
  LockOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
} from "@ant-design/icons";

import {
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Empty,
  Form,
  Input,
  Row,
  Space,
  Typography,
  theme,
} from "antd";

import { bottomMenuItems } from "@/config/bottomMenuConfig";
import { menuItems } from "@/config/menuConfig";
import { moduleConfig } from "@/config/module.config";
import {
  createRole,
  getRoleById,
  updateRole,
} from "@/modules/role/api/role.service";
import { usePermission } from "@/modules/shared/hooks/usePermission";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
const { Title, Text } = Typography;
const { TextArea } = Input;

export default function RoleForm() {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const router = useRouter();

  const searchParams = useSearchParams();

  const roleId = searchParams.get("id");
  const [roleData, setRoleData] = useState(null);
  const [isRoleLoading, setIsRoleLoading] = useState(false);

  const {
    token: { colorBorder, borderRadiusLG, colorPrimary },
  } = theme.useToken();
  const { canCreate, canEdit, isAdmin } = usePermission("roles");
  const hasAccess = isAdmin || canCreate || canEdit;

  const extractModules = (items, result = new Set()) => {
    items.forEach((item) => {
      if (item.module) result.add(item.module);
      if (item.children) {
        extractModules(item.children, result);
      }
    });
    return result;
  };

  const allMenus = [...menuItems, ...bottomMenuItems];

  const menuModules = Array.from(extractModules(allMenus));
  const modules = menuModules.map((key) => ({
    key,
    label: moduleConfig[key]?.label || key,
    actions: moduleConfig[key]?.actions || ["read"],
  }));
  const permissions = Form.useWatch("permissions", form);

  useEffect(() => {
    const fetchRole = async () => {
      if (!roleId || !hasAccess) {
        setRoleData(null);
        return;
      }

      try {
        setIsRoleLoading(true);

        const response = await getRoleById(roleId);

        const data = response?.data || response;

        setRoleData(data);
      } catch (error) {
        console.error("Failed to fetch role:", error);
      } finally {
        setIsRoleLoading(false);
      }
    };

    fetchRole();
  }, [roleId, hasAccess]);

  useEffect(() => {
    if (!hasAccess) return;

    if (roleData) {
      form.setFieldsValue({
        name: roleData?.name,
        description: roleData?.description,
        permissions: roleData?.permissions || {},
      });
    } else if (!roleId) {
      form.resetFields();
    }
  }, [roleData, roleId, form, hasAccess]);

  const onFinish = async (values) => {
    if (!hasAccess) return;
    const payload = {
      ...values,
      type: "staff",
    };

    if (roleData) {
      await updateRole(roleData?._id, payload);
    } else {
      await createRole(payload);
    }
    queryClient.invalidateQueries({
      queryKey: ["roles"],
    });
    form.resetFields();
    router.push("/dashboard/staff/roles");
  };

  return (
    <>
      {!hasAccess ? (
        <Empty description="No permission to manage roles" />
      ) : (
        <Form
          className="role-form-page mx-auto w-full max-w-[1440px] pb-6"
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            permissions: {},
          }}
        >
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <Space align="start" size={14}>
              <div
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: 16,
                  background: "rgba(22,119,255,0.10)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: colorPrimary,
                  fontSize: 22,
                }}
              >
                <SafetyCertificateOutlined />
              </div>

              <div>
                <Title level={3} style={{ marginBottom: 4 }}>
                  {roleId ? "Edit Role" : "Create Role"}
                </Title>

                <Text
                  type="secondary"
                  style={{
                    fontSize: 13,
                  }}
                >
                  Configure permissions and access control for staff members
                </Text>
              </div>
            </Space>
          </div>

          {/* ================= BASIC INFO ================= */}

          <Card
            className="role-details-card"
            title="Role details"
            extra={<Text type="secondary" className="!text-xs">Name is required</Text>}
            style={{ marginBottom: 28, borderRadius: borderRadiusLG }}
          >
            <Row gutter={[20, 4]} align="top">
              {/* ROLE NAME */}
              <Col xs={24} md={9}>
                <Form.Item
                  name="name"
                  label="Role name"
                  rules={[
                    {
                      required: true,
                      message: "Please enter role name",
                    },
                  ]}
                >
                  <Input
                    size="large"
                    prefix={<UserOutlined />}
                    placeholder="Enter role name"
                  />
                </Form.Item>
              </Col>

              {/* DESCRIPTION */}

              <Col xs={24} md={15}>
                <Form.Item name="description" label="Description">
                  <TextArea rows={3} placeholder="Describe what this role is responsible for" />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* ================= HEADER ================= */}

          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <Space size={10}>
              <LockOutlined
                style={{
                  color: colorPrimary,
                }}
              />

              <Text
                strong
                style={{
                  fontSize: 16,
                }}
              >
                Permissions
              </Text>
            </Space>

            <Text
              type="secondary"
              style={{
                fontSize: 12,
              }}
            >
              Select allowed actions for each module
            </Text>
          </div>

          {/* ================= PERMISSIONS ================= */}

          <div>
            <Row gutter={[16, 16]}>
              {modules.map((module) => (
                <Col xs={24} sm={12} xl={8} key={module.key}>
                  <Card
                    className="role-permission-card"
                    size="small"
                    style={{
                      borderRadius: borderRadiusLG,
                      border: `1px solid ${colorBorder}`,
                      height: "100%",
                    }}
                    styles={{
                      body: {
                        padding: 16,
                      },
                    }}
                  >
                    {/* MODULE HEADER */}

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 14,
                      }}
                    >
                      <Text
                        strong
                        style={{
                          fontSize: 14,
                        }}
                      >
                        {module.label}
                      </Text>

                      <div
                        style={{
                          padding: "2px 10px",
                          borderRadius: 999,
                          fontSize: 11,
                          fontWeight: 500,
                          background: "rgba(22,119,255,0.10)",
                          color: colorPrimary,
                        }}
                      >
                        {module.actions.filter((action) => action !== "update").length} Actions
                      </div>
                    </div>

                    <Divider
                      style={{
                        margin: "0 0 14px",
                      }}
                    />

                    {/* ACTIONS */}

                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {module.actions
                        .filter((action) => action !== "update")
                        .map((action) => (
                          <Form.Item
                            key={action}
                            name={["permissions", module.key, action]}
                            valuePropName="checked"
                            className="role-permission-item !mb-0"
                          >
                            <Checkbox
                              disabled={
                                (!canEdit && !isAdmin) ||
                                (action !== "read" &&
                                  !permissions?.[module.key]?.read)
                              }
                              checked={
                                action === "write"
                                  ? permissions?.[module.key]?.write ||
                                    permissions?.[module.key]?.update ||
                                    false
                                  : permissions?.[module.key]?.[action] || false
                              }
                              onChange={(e) => {
                                const checked = e.target.checked;

                                const current =
                                  form.getFieldValue("permissions") || {};

                                const modulePerm = current[module.key] || {};

                                const updated = {
                                  ...current,

                                  [module.key]: {
                                    ...modulePerm,
                                    [action]: checked,
                                  },
                                };

                                // READ OFF => RESET ALL DEPENDENT ACTIONS
                                if (action === "read" && !checked) {
                                  updated[module.key].write = false;
                                  updated[module.key].update = false;
                                  updated[module.key].delete = false;
                                }

                                // WRITE / UPDATE => BOTH TOGETHER
                                if (action === "write") {
                                  updated[module.key].write = checked;
                                  updated[module.key].update = checked;
                                }

                                form.setFieldsValue({
                                  permissions: updated,
                                });
                              }}
                            >
                              <span className="font-medium capitalize">
                                {action === "write" ? "Write / Update" : action}
                              </span>
                            </Checkbox>
                          </Form.Item>
                        ))}
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>

          {/* ================= FOOTER ================= */}

          <div className="role-form-actions mt-7 flex justify-end gap-3">
            <Button
              size="large"
              onClick={() => {
                form.resetFields();
                router.back();
              }}
            >
              Cancel
            </Button>

            <Button
              type="primary"
              htmlType="submit"
              size="large"
              disabled={!canCreate && !canEdit && !isAdmin}
            >
              {roleId ? "Update Role" : "Create Role"}
            </Button>
          </div>
        </Form>
      )}
    </>
  );
}
