"use client";

import { Col, ColorPicker, Form, Input, Row } from "antd";

export default function ThemeColorPicker({ form, name, label }) {
  const value = Form.useWatch(name, form) || "#FFFFFF";

  const handleColorChange = (color) => {
    form.setFieldValue(name, color.toHexString());
  };

  const handleInputChange = (e) => {
    form.setFieldValue(name, e.target.value);
  };

  return (
    <Form.Item
      label={label}
      required
      style={{
        marginBottom: 20,
      }}
    >
      <Row gutter={12} align="middle">
        {/* Color Picker */}

        <Col flex="60px">
          <ColorPicker
            value={value}
            format="hex"
            allowClear={false}
            onChangeComplete={handleColorChange}
            style={{
              width: 48,
              height: 40,
            }}
          />
        </Col>

        {/* HEX Input */}

        <Col flex="auto">
          <Form.Item
            name={name}
            noStyle
            rules={[
              {
                required: true,
                message: `${label} is required`,
              },
              {
                pattern: /^#([A-Fa-f0-9]{6})$/,
                message: "Please enter a valid HEX color",
              },
            ]}
          >
            <Input
              size="large"
              placeholder="#FFFFFF"
              onChange={handleInputChange}
            />
          </Form.Item>
        </Col>

        {/* Live Color Preview */}

        <Col flex="48px">
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              border: "1px solid #d9d9d9",
              background: value,
            }}
          />
        </Col>
      </Row>
    </Form.Item>
  );
}
