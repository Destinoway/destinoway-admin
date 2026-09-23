"use client";

import { Form, Input } from "antd";

export default function CMSSeoFields() {
  return (
    <>
      <Form.Item name="metaTitle" label="Meta Title">
        <Input />
      </Form.Item>

      <Form.Item name="metaDescription" label="Meta Description">
        <Input.TextArea rows={3} />
      </Form.Item>

      <Form.Item name="keywords" label="Keywords">
        <Input placeholder="comma separated" />
      </Form.Item>
    </>
  );
}
