"use client";

import { Col, ColorPicker, Form, Input, Row } from "antd";

export default function ThemeColorField({ label, name }) {
  return (
    <Form.Item label={label} style={{ marginBottom: 20 }}>
      <Row gutter={12}>
        <Col flex="70px">
          <Form.Item name={name} noStyle>
            <ColorPicker
              style={{
                width: "100%",
                height: 40,
              }}
              format="hex"
            />
          </Form.Item>
        </Col>

        <Col flex="auto">
          <Form.Item name={name} noStyle>
            <Input placeholder="#FFFFFF" size="large" />
          </Form.Item>
        </Col>
      </Row>
    </Form.Item>
  );
}
