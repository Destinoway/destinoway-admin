"use client";

import { Button, Drawer, Form, Input, Select, Space } from "antd";
import { useEffect } from "react";

import {
  MASTER_DATA_LABELS,
  MASTER_DATA_TYPE_OPTIONS,
  MASTER_DATA_TYPES,
} from "../constants/masterData.constants";

export default function MasterDataForm({
  open,
  onClose,
  editingMasterData,
  selectedType,
  createMasterData,
  updateMasterData,
}) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (!open) return;

    if (!editingMasterData) {
      form.resetFields();

      if (selectedType !== MASTER_DATA_TYPES.ALL) {
        form.setFieldValue("type", selectedType);
      }

      return;
    }

    form.setFieldsValue({
      placeName: editingMasterData.placeName,
      type: editingMasterData.type,
    });
  }, [open, editingMasterData, selectedType, form]);

  const handleFinish = async (values) => {
    try {
      const payload = {
        ...values,
        type:
          selectedType === MASTER_DATA_TYPES.ALL ? values.type : selectedType,
      };

      if (editingMasterData) {
        await updateMasterData.mutateAsync({
          id: editingMasterData._id,
          data: payload,
        });
      } else {
        await createMasterData.mutateAsync(payload);
      }

      form.resetFields();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const currentLabel = MASTER_DATA_LABELS[selectedType] || "Master Data";

  return (
    <Drawer
      size={420}
      open={open}
      onClose={onClose}
      title={editingMasterData ? `Edit ${currentLabel}` : `Add ${currentLabel}`}
    >
      <Form layout="vertical" form={form} onFinish={handleFinish}>
        <Form.Item
          label="Name"
          name="placeName"
          rules={[
            {
              required: true,
              message: "Please enter name",
            },
          ]}
        >
          <Input size="large" placeholder={`Enter ${currentLabel}`} />
        </Form.Item>

        {selectedType === MASTER_DATA_TYPES.ALL && !editingMasterData && (
          <Form.Item
            label="Category"
            name="type"
            rules={[
              {
                required: true,
                message: "Please select category",
              },
            ]}
          >
            <Select size="large" options={MASTER_DATA_TYPE_OPTIONS} />
          </Form.Item>
        )}

        <Space
          style={{
            width: "100%",
            justifyContent: "flex-end",
          }}
        >
          <Button onClick={onClose}>Cancel</Button>

          <Button
            type="primary"
            htmlType="submit"
            loading={createMasterData.isPending || updateMasterData.isPending}
          >
            {editingMasterData ? "Update" : "Create"}
          </Button>
        </Space>
      </Form>
    </Drawer>
  );
}
