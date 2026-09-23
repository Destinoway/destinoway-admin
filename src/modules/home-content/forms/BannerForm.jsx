"use client";

import { App, Button, Form, Input, Space } from "antd";
import { useEffect } from "react";

import ImageUpload from "@/modules/shared/imageUpload/ImageUpload";

import { HOME_CONTENT_SECTIONS } from "../constants/homeContent.constants";

export default function BannerForm({
  editingData,

  createHomeContent,
  updateHomeContent,

  onSuccess,
}) {
  const { message } = App.useApp();

  const [form] = Form.useForm();

  /*
  -----------------------------------
  Prefill
  -----------------------------------
  */

  useEffect(() => {
    if (!editingData) {
      form.resetFields();
      return;
    }

    form.setFieldsValue({
      title: editingData.title,

      image: editingData.items?.[0]?.image,

      alt: editingData.items?.[0]?.alt,
    });
  }, [editingData, form]);

  /*
  -----------------------------------
  Submit
  -----------------------------------
  */

  const handleFinish = async (values) => {
    try {
      const payload = {
        sectionType: HOME_CONTENT_SECTIONS.BANNER,

        title: values.title,

        items: [
          {
            image: values.image,

            alt: values.alt,
          },
        ],
      };

      if (editingData?._id) {
        await updateHomeContent.mutateAsync({
          id: editingData._id,
          data: payload,
        });

        message.success("Banner updated successfully");
      } else {
        await createHomeContent.mutateAsync(payload);

        message.success("Banner created successfully");
      }

      form.resetFields();

      onSuccess?.();
    } catch (error) {
      console.error(error);

      message.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <Form layout="vertical" form={form} onFinish={handleFinish}>
      <Form.Item
        label="Banner Title"
        name="title"
        rules={[
          {
            required: true,
            message: "Please enter banner title",
          },
        ]}
      >
        <Input size="large" placeholder="Enter banner title" />
      </Form.Item>

      <Form.Item
        label="Banner Image"
        name="image"
        rules={[
          {
            required: true,
            message: "Please upload banner image",
          },
        ]}
      >
        <ImageUpload />
      </Form.Item>

      <Form.Item
        label="Alt Text"
        name="alt"
        rules={[
          {
            required: true,
            message: "Please enter alt text",
          },
        ]}
      >
        <Input size="large" placeholder="Enter image alt text" />
      </Form.Item>

      <Space
        style={{
          width: "100%",
          justifyContent: "flex-end",
        }}
      >
        <Button onClick={onSuccess}>Cancel</Button>

        <Button
          type="primary"
          htmlType="submit"
          loading={createHomeContent.isPending || updateHomeContent.isPending}
        >
          {editingData ? "Update Banner" : "Create Banner"}
        </Button>
      </Space>
    </Form>
  );
}
