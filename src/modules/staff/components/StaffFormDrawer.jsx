"use client";

import { useRoles } from "@/modules/role/hooks/useRoles";
import { usePermission } from "@/modules/shared/hooks/usePermission";
import { createStaff, updateStaff } from "@/modules/staff/api/user.service";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Drawer, Form, Input, Select, Typography } from "antd";
import { useEffect, useState } from "react";

export default function StaffFormDrawer({ open, setOpen, editData }) {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const queryClient = useQueryClient();
  const { canCreate, canEdit } = usePermission("users");
  const { roleOptions, dropdownLoading } = useRoles(false, canCreate || canEdit);

  useEffect(() => {
    if (!open) return;

    if (editData) {
      form.setFieldsValue({
        name: editData.name,
        email: editData.email,
        mobile: editData.mobile,
        role: editData.role?._id,
      });
    } else {
      form.resetFields();
    }
  }, [open, editData, form]);

  const onFinish = async (values) => {
    setSaving(true);
    try {
      if (editData) {
        await updateStaff(editData._id, values);
      } else {
        await createStaff(values);
      }

      await queryClient.invalidateQueries({ queryKey: ["staff"] });
      setOpen(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Drawer
      className="staff-form-drawer"
      title={
        <div className="flex flex-col gap-0.5">
          <Typography.Text strong className="!text-lg">
            {editData ? "Edit staff member" : "Add staff member"}
          </Typography.Text>
          <Typography.Text type="secondary" className="!text-xs !font-normal">
            {editData
              ? "Update profile details, role and access."
              : "Create a staff account and assign its role."}
          </Typography.Text>
        </div>
      }
      open={open}
      onClose={() => setOpen(false)}
      placement="right"
      width={480}
      destroyOnHidden
      styles={{ body: { padding: 24 }, footer: { padding: "14px 24px" } }}
      footer={
        <div className="flex justify-end gap-2">
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          {(canCreate || canEdit) && (
            <Button
              type="primary"
              htmlType="submit"
              form="staff-member-form"
              loading={saving}
            >
              {editData ? "Save changes" : "Create staff"}
            </Button>
          )}
        </div>
      }
    >
      <Form
        id="staff-member-form"
        form={form}
        layout="vertical"
        onFinish={onFinish}
        requiredMark="optional"
      >
        <div className="mb-5 rounded-xl bg-sky-50 px-4 py-3 text-sm text-sky-900">
          Staff members use their email address to sign in to the admin dashboard.
        </div>

        <Form.Item
          name="name"
          label="Full name"
          rules={[{ required: true, whitespace: true, message: "Enter the staff member's name." }]}
        >
          <Input size="large" placeholder="e.g. Aditi Sharma" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email address"
          rules={[
            { required: true, message: "Enter an email address." },
            { type: "email", message: "Enter a valid email address." },
          ]}
        >
          <Input size="large" type="email" placeholder="name@example.com" />
        </Form.Item>

        <Form.Item name="mobile" label="Mobile number">
          <Input size="large" placeholder="Enter mobile number" />
        </Form.Item>

        {!editData && (
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Enter a password." }]}
          >
            <Input.Password size="large" placeholder="Enter password" />
          </Form.Item>
        )}

        {(canCreate || canEdit) && (
          <Form.Item name="role" label="Assigned role">
            <Select
              size="large"
              placeholder="Select a role"
              loading={dropdownLoading}
              options={roleOptions}
              showSearch
              optionFilterProp="label"
            />
          </Form.Item>
        )}
      </Form>
    </Drawer>
  );
}
