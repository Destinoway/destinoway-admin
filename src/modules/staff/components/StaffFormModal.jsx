"use client";

import { useRoles } from "@/modules/role/hooks/useRoles"; // ✅ NEW
import { usePermission } from "@/modules/shared/hooks/usePermission"; // ✅ NEW
import { createStaff, updateStaff } from "@/modules/staff/api/user.service";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, Modal, Select } from "antd";
import { useEffect } from "react";

export default function StaffFormModal({ open, setOpen, editData }) {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { canCreate, canEdit } = usePermission("users");

  const { roleOptions, dropdownLoading } = useRoles(
    false,
    canCreate || canEdit,
  );

  console.log("roleOptions", roleOptions);

  useEffect(() => {
    if (open) {
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
    }
  }, [open, editData, form]);

  const onFinish = async (values) => {
    if (editData) {
      await updateStaff(editData._id, values);
    } else {
      await createStaff(values);
    }

    queryClient.invalidateQueries({ queryKey: ["staff"] });
    setOpen(false);
  };

  return (
    <Modal
      title={editData ? "Edit Staff" : "Create Staff"}
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        {/* NAME */}
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        {/* EMAIL */}
        <Form.Item name="email" label="Email" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        {/* MOBILE */}
        <Form.Item name="mobile" label="Mobile">
          <Input />
        </Form.Item>

        {/* PASSWORD (only create) */}
        {!editData && (
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true }]}
          >
            <Input.Password />
          </Form.Item>
        )}

        {(canCreate || canEdit) && (
          <Form.Item name="role" label="Role">
            <Select
              placeholder="Select Role"
              loading={dropdownLoading}
              options={roleOptions}
            />
          </Form.Item>
        )}

        {(canCreate || canEdit) && (
          <Button type="primary" htmlType="submit" block>
            {editData ? "Update" : "Create"}
          </Button>
        )}
      </Form>
    </Modal>
  );
}
