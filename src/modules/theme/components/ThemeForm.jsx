"use client";

import {
  App,
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Switch,
  Typography,
} from "antd";
import { useEffect, useState } from "react";

const { Text, Title } = Typography;

export default function ThemeForm({ theme, updateTheme }) {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [preview, setPreview] = useState({});

  useEffect(() => {
    if (!theme) return;

    const values = {
      primaryColor: theme.primaryColor || "#FDA20F",
      secondaryColor: theme.secondaryColor || "#05144B",
      hoverColor: theme.hoverColor || "#0C2FB1",

      textPrimary: theme.textPrimary || "#05144B",
      textSecondary: theme.textSecondary || "#FDA20F",

      borderColor: theme.borderColor || "#051449",

      gradientStart: theme.gradientStart || "#05144B",
      gradientEnd: theme.gradientEnd || "#0C2FB1",

      searchBarBackgroundColor: theme.searchBarBackgroundColor || "#DBE9FF",

      searchBarButtonBackgroundColor:
        theme.searchBarButtonBackgroundColor || "#0C5863",

      footerBackgroundColor: theme.footerBackgroundColor || "#E8EDFF",

      footerTextColor: theme.footerTextColor || "#000000",

      websiteBackgroundColor: theme.websiteBackgroundColor || "#FFFFFF",

      whiteColor: theme.whiteColor || "#FFFFFF",

      isActive: theme.isActive ?? true,
    };

    form.setFieldsValue(values);
    setPreview(values);
  }, [theme, form]);

  const handleValuesChange = (_, allValues) => {
    setPreview((prev) => ({
      ...prev,
      ...allValues,
    }));
  };

  const handleFinish = async (values) => {
    try {
      await updateTheme.mutateAsync(values);
    } catch (error) {
      message.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  /* =========================================================
     COLOR FIELD
  ========================================================= */

  const renderColorField = (label, name) => (
    <Form.Item
      label={label}
      style={{
        marginBottom: 18,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        {/* Color Picker */}

        <input
          type="color"
          value={preview[name] || "#FFFFFF"}
          onChange={(e) => {
            const value = e.target.value;

            form.setFieldValue(name, value);

            setPreview((prev) => ({
              ...prev,
              [name]: value,
            }));
          }}
          style={{
            width: 48,
            minWidth: 48,
            height: 42,
            padding: 3,
            border: "1px solid #d9d9d9",
            borderRadius: 8,
            cursor: "pointer",
            background: "#fff",
          }}
        />

        {/* HEX Input */}

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
              message: "Invalid HEX color",
            },
          ]}
        >
          <Input
            size="large"
            placeholder="#FFFFFF"
            style={{
              flex: 1,
            }}
          />
        </Form.Item>
      </div>
    </Form.Item>
  );

  /* =========================================================
     CATEGORY HEADER
  ========================================================= */

  const renderSectionHeader = (title, description) => (
    <div
      style={{
        marginBottom: 18,
      }}
    >
      <Title
        level={5}
        style={{
          margin: 0,
          marginBottom: 4,
        }}
      >
        {title}
      </Title>

      <Text
        type="secondary"
        style={{
          fontSize: 13,
        }}
      >
        {description}
      </Text>
    </div>
  );

  return (
    <Form
      form={form}
      layout="vertical"
      onValuesChange={handleValuesChange}
      onFinish={handleFinish}
    >
      <Row gutter={[24, 24]}>
        {/* =====================================================
            LEFT SIDE - THEME SETTINGS
        ====================================================== */}

        <Col xs={24} xl={16}>
          <Card title="Theme Colors" variant="outlined">
            {/* =================================================
                1. BRAND COLORS
            ================================================= */}

            {renderSectionHeader(
              "Brand Colors",
              "Manage the primary, secondary and interaction colors used across the website.",
            )}

            <Row gutter={[20, 0]}>
              <Col xs={24} md={12}>
                {renderColorField("Primary Color", "primaryColor")}
              </Col>

              <Col xs={24} md={12}>
                {renderColorField("Secondary Color", "secondaryColor")}
              </Col>

              <Col xs={24} md={12}>
                {renderColorField("Hover Color", "hoverColor")}
              </Col>

              <Col xs={24} md={12}>
                {renderColorField("Border Color", "borderColor")}
              </Col>
            </Row>

            <Divider />

            {/* =================================================
                2. TEXT COLORS
            ================================================= */}

            {renderSectionHeader(
              "Text Colors",
              "Control the primary and secondary text colors used throughout the website.",
            )}

            <Row gutter={[20, 0]}>
              <Col xs={24} md={12}>
                {renderColorField("Primary Text Color", "textPrimary")}
              </Col>

              <Col xs={24} md={12}>
                {renderColorField("Secondary Text Color", "textSecondary")}
              </Col>
            </Row>

            <Divider />

            {/* =================================================
                3. GRADIENT COLORS
            ================================================= */}

            {renderSectionHeader(
              "Gradient Colors",
              "These colors control the start and end points of the main website gradient.",
            )}

            <Row gutter={[20, 0]}>
              <Col xs={24} md={12}>
                {renderColorField("Gradient Start", "gradientStart")}
              </Col>

              <Col xs={24} md={12}>
                {renderColorField("Gradient End", "gradientEnd")}
              </Col>
            </Row>

            <Divider />

            {/* =================================================
                4. SEARCH BAR
            ================================================= */}

            {renderSectionHeader(
              "Search Bar Colors",
              "Customize the search area background and the Search button background color.",
            )}

            <Row gutter={[20, 0]}>
              <Col xs={24} md={12}>
                {renderColorField(
                  "Search Bar Background",
                  "searchBarBackgroundColor",
                )}
              </Col>

              <Col xs={24} md={12}>
                {renderColorField(
                  "Search Button Background",
                  "searchBarButtonBackgroundColor",
                )}
              </Col>
            </Row>

            <Divider />

            {/* =================================================
                5. FOOTER
            ================================================= */}

            {renderSectionHeader(
              "Footer Colors",
              "Customize the footer background and the text displayed inside the footer.",
            )}

            <Row gutter={[20, 0]}>
              <Col xs={24} md={12}>
                {renderColorField("Footer Background", "footerBackgroundColor")}
              </Col>

              <Col xs={24} md={12}>
                {renderColorField("Footer Text Color", "footerTextColor")}
              </Col>
            </Row>

            <Divider />

            {/* =================================================
                6. WEBSITE
            ================================================= */}

            {renderSectionHeader(
              "Website Colors",
              "Control the main website background and the reusable white color.",
            )}

            <Row gutter={[20, 0]}>
              <Col xs={24} md={12}>
                {renderColorField(
                  "Website Background",
                  "websiteBackgroundColor",
                )}
              </Col>

              <Col xs={24} md={12}>
                {renderColorField("White Color", "whiteColor")}
              </Col>
            </Row>

            <Divider />

            {/* =================================================
                STATUS
            ================================================= */}

            <Form.Item
              name="isActive"
              label="Theme Status"
              valuePropName="checked"
              style={{
                marginBottom: 0,
              }}
            >
              <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
            </Form.Item>
          </Card>
        </Col>

        {/* =====================================================
            RIGHT SIDE - LIVE PREVIEW
        ====================================================== */}

        <Col xs={24} xl={8}>
          <Card
            title="Live Preview"
            variant="outlined"
            styles={{
              body: {
                backgroundColor: preview.websiteBackgroundColor || "#FFFFFF",
              },
            }}
          >
            {/* =========================
                WEBSITE BACKGROUND
            ========================== */}

            <PreviewLabel
              title="Website Background"
              description="Main page background"
            />

            <div
              style={{
                height: 45,
                backgroundColor: preview.websiteBackgroundColor,
                border: `1px solid ${preview.borderColor}`,
                borderRadius: 8,
                marginBottom: 22,
              }}
            />

            {/* =========================
                TEXT
            ========================== */}

            <PreviewLabel
              title="Text Colors"
              description="Primary and secondary website text"
            />

            <div
              style={{
                background: preview.whiteColor,
                border: `1px solid ${preview.borderColor}`,
                padding: 14,
                borderRadius: 10,
                marginBottom: 22,
              }}
            >
              <div
                style={{
                  color: preview.textPrimary,
                  fontSize: 17,
                  fontWeight: 700,
                  marginBottom: 5,
                }}
              >
                Primary Text
              </div>

              <div
                style={{
                  color: preview.textSecondary,
                  fontSize: 14,
                }}
              >
                Secondary text appears like this.
              </div>
            </div>

            {/* =========================
                BUTTON COLORS
            ========================== */}

            <PreviewLabel
              title="Brand & Button Colors"
              description="Primary, secondary and hover colors"
            />

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                marginBottom: 22,
              }}
            >
              <PreviewButton
                color={preview.primaryColor}
                textColor={preview.whiteColor}
              >
                Primary
              </PreviewButton>

              <PreviewButton
                color={preview.secondaryColor}
                textColor={preview.whiteColor}
              >
                Secondary
              </PreviewButton>

              <PreviewButton
                color={preview.hoverColor}
                textColor={preview.whiteColor}
              >
                Hover
              </PreviewButton>
            </div>

            {/* =========================
                GRADIENT
            ========================== */}

            <PreviewLabel
              title="Gradient"
              description="Gradient start → gradient end"
            />

            <div
              style={{
                height: 85,
                borderRadius: 10,

                background: `linear-gradient(
                  180deg,
                  ${preview.gradientStart} 0%,
                  ${preview.gradientEnd} 100%
                )`,

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                color: preview.whiteColor,
                fontWeight: 600,

                marginBottom: 22,
              }}
            >
              Gradient Preview
            </div>

            {/* =========================
                BORDER
            ========================== */}

            <PreviewLabel
              title="Border Color"
              description="Borders used across cards and components"
            />

            <div
              style={{
                border: `2px solid ${preview.borderColor}`,
                borderRadius: 10,
                padding: 14,
                background: preview.whiteColor,
                color: preview.textPrimary,
                marginBottom: 22,
              }}
            >
              Border Preview
            </div>

            {/* =========================
                SEARCH BAR
            ========================== */}

            <PreviewLabel
              title="Search Bar"
              description="Search background + Search button"
            />

            <div
              style={{
                backgroundColor: preview.searchBarBackgroundColor,

                padding: 12,
                borderRadius: 10,

                display: "flex",
                alignItems: "center",
                gap: 8,

                marginBottom: 22,
              }}
            >
              <div
                style={{
                  background: preview.whiteColor,
                  color: preview.textPrimary,

                  flex: 1,

                  padding: "9px 10px",
                  borderRadius: 7,

                  fontSize: 12,
                }}
              >
                Search destination...
              </div>

              <button
                type="button"
                style={{
                  backgroundColor: preview.searchBarButtonBackgroundColor,

                  color: preview.whiteColor,

                  border: "none",
                  borderRadius: 7,

                  padding: "9px 12px",

                  cursor: "default",
                }}
              >
                Search
              </button>
            </div>

            {/* =========================
                FOOTER
            ========================== */}

            <PreviewLabel
              title="Footer"
              description="Footer background + Footer text"
            />

            <div
              style={{
                backgroundColor: preview.footerBackgroundColor,

                color: preview.footerTextColor,

                borderRadius: 10,
                padding: 16,
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  marginBottom: 5,
                }}
              >
                PAN Journey
              </div>

              <div
                style={{
                  color: preview.footerTextColor,
                  fontSize: 12,
                }}
              >
                Explore the world with PAN Journey.
              </div>

              <div
                style={{
                  color: preview.footerTextColor,
                  fontSize: 11,
                  marginTop: 10,
                  opacity: 0.8,
                }}
              >
                © 2026 PAN Journey
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* =====================================================
          UPDATE BUTTON
      ====================================================== */}

      <Row
        justify="end"
        style={{
          marginTop: 24,
        }}
      >
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          loading={updateTheme.isPending}
          style={{
            minWidth: 180,
          }}
        >
          Update Theme
        </Button>
      </Row>
    </Form>
  );
}

/* =========================================================
   PREVIEW LABEL
========================================================= */

function PreviewLabel({ title, description }) {
  return (
    <div
      style={{
        marginBottom: 8,
      }}
    >
      <Text
        strong
        style={{
          display: "block",
          fontSize: 13,
        }}
      >
        {title}
      </Text>

      <Text
        type="secondary"
        style={{
          fontSize: 11,
        }}
      >
        {description}
      </Text>
    </div>
  );
}

/* =========================================================
   PREVIEW BUTTON
========================================================= */

function PreviewButton({ color, textColor, children }) {
  return (
    <button
      type="button"
      style={{
        backgroundColor: color,
        color: textColor,

        border: "none",
        borderRadius: 7,

        padding: "8px 12px",

        fontSize: 12,
        fontWeight: 500,

        cursor: "default",
      }}
    >
      {children}
    </button>
  );
}
