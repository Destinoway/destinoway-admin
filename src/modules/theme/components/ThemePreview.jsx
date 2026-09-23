"use client";

import { Button, Card, Space, Typography } from "antd";

const { Title, Text } = Typography;

export default function ThemePreview({ theme }) {
  if (!theme) {
    return (
      <Card title="Theme Preview">
        <Text type="secondary">No theme data available.</Text>
      </Card>
    );
  }

  return (
    <Card
      title="Theme Preview"
      style={{
        marginBottom: 24,
      }}
    >
      <Space
        orientation="vertical"
        size={20}
        style={{
          width: "100%",
        }}
      >
        {/* ============================================================= */}
        {/* WEBSITE BACKGROUND                                            */}
        {/* ============================================================= */}

        <div
          style={{
            backgroundColor: theme.websiteBackgroundColor,
            padding: 18,
            borderRadius: 12,
            border: `1px solid ${theme.borderColor}`,
          }}
        >
          <Text
            strong
            style={{
              display: "block",
              marginBottom: 12,
            }}
          >
            Website Background
          </Text>

          <Text
            style={{
              color: theme.textPrimary,
            }}
          >
            This represents the main background color of the website.
          </Text>
        </div>

        {/* ============================================================= */}
        {/* TEXT COLORS                                                    */}
        {/* ============================================================= */}

        <div
          style={{
            padding: 18,
            borderRadius: 12,
            border: `1px solid ${theme.borderColor}`,
            background: theme.whiteColor,
          }}
        >
          <Text
            strong
            style={{
              display: "block",
              marginBottom: 12,
            }}
          >
            Text Colors
          </Text>

          <Title
            level={4}
            style={{
              color: theme.textPrimary,
              margin: "0 0 6px",
            }}
          >
            Primary Text
          </Title>

          <Text
            style={{
              color: theme.textSecondary,
              display: "block",
              marginBottom: 12,
            }}
          >
            Secondary Text
          </Text>

          <Text
            style={{
              color: theme.primaryColor,
              fontWeight: 600,
            }}
          >
            Primary Color Text
          </Text>
        </div>

        {/* ============================================================= */}
        {/* PRIMARY / SECONDARY COLORS                                    */}
        {/* ============================================================= */}

        <div
          style={{
            padding: 18,
            borderRadius: 12,
            background: theme.whiteColor,
            border: `1px solid ${theme.borderColor}`,
          }}
        >
          <Text
            strong
            style={{
              display: "block",
              marginBottom: 12,
            }}
          >
            Primary & Secondary Colors
          </Text>

          <Space wrap>
            {/* Primary */}
            <Button
              style={{
                backgroundColor: theme.primaryColor,
                borderColor: theme.primaryColor,
                color: theme.whiteColor,
              }}
            >
              Primary Color
            </Button>

            {/* Secondary */}
            <Button
              style={{
                backgroundColor: theme.secondaryColor,
                borderColor: theme.secondaryColor,
                color: theme.whiteColor,
              }}
            >
              Secondary Color
            </Button>

            {/* Hover */}
            <Button
              style={{
                backgroundColor: theme.hoverColor,
                borderColor: theme.hoverColor,
                color: theme.whiteColor,
              }}
            >
              Hover Color
            </Button>
          </Space>
        </div>

        {/* ============================================================= */}
        {/* BORDER                                                        */}
        {/* ============================================================= */}

        <div
          style={{
            padding: 18,
            borderRadius: 12,
            border: `2px solid ${theme.borderColor}`,
            background: theme.whiteColor,
          }}
        >
          <Text
            strong
            style={{
              display: "block",
              marginBottom: 8,
            }}
          >
            Border Color
          </Text>

          <Text>This box demonstrates the configured border color.</Text>
        </div>

        {/* ============================================================= */}
        {/* GRADIENT                                                      */}
        {/* ============================================================= */}

        <div>
          <Text
            strong
            style={{
              display: "block",
              marginBottom: 10,
            }}
          >
            Gradient
          </Text>

          <div
            style={{
              height: 100,
              borderRadius: 12,
              background: `linear-gradient(
                180deg,
                ${theme.gradientStart} 0%,
                ${theme.gradientEnd} 100%
              )`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                color: theme.whiteColor,
                fontWeight: 700,
                fontSize: 18,
              }}
            >
              Gradient Preview
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 8,
            }}
          >
            <Text type="secondary">Start: {theme.gradientStart}</Text>

            <Text type="secondary">End: {theme.gradientEnd}</Text>
          </div>
        </div>

        {/* ============================================================= */}
        {/* SEARCH BAR                                                     */}
        {/* ============================================================= */}

        <div>
          <Text
            strong
            style={{
              display: "block",
              marginBottom: 10,
            }}
          >
            Search Bar
          </Text>

          <div
            style={{
              backgroundColor: theme.searchBarBackgroundColor,
              padding: 14,
              borderRadius: 12,
              display: "flex",
              gap: 10,
              alignItems: "center",
            }}
          >
            <div
              style={{
                flex: 1,
                background: theme.whiteColor,
                borderRadius: 8,
                padding: "10px 14px",
                color: theme.textPrimary,
              }}
            >
              Search destination...
            </div>

            <Button
              style={{
                backgroundColor: theme.searchBarButtonBackgroundColor,
                borderColor: theme.searchBarButtonBackgroundColor,
                color: theme.whiteColor,
                height: 42,
              }}
            >
              Search
            </Button>
          </div>
        </div>

        {/* ============================================================= */}
        {/* FOOTER                                                        */}
        {/* ============================================================= */}

        <div
          style={{
            backgroundColor: theme.footerBackgroundColor,
            padding: 20,
            borderRadius: 12,
          }}
        >
          <Text
            strong
            style={{
              display: "block",
              color: theme.footerTextColor,
              fontSize: 16,
              marginBottom: 8,
            }}
          >
            Footer Preview
          </Text>

          <Text
            style={{
              color: theme.footerTextColor,
              opacity: 0.8,
            }}
          >
            © 2026 Pan Journey. All rights reserved.
          </Text>
        </div>

        {/* ============================================================= */}
        {/* WHITE COLOR                                                    */}
        {/* ============================================================= */}

        <div
          style={{
            backgroundColor: theme.whiteColor,
            border: `1px solid ${theme.borderColor}`,
            padding: 18,
            borderRadius: 12,
          }}
        >
          <Text
            strong
            style={{
              display: "block",
              marginBottom: 8,
            }}
          >
            White Color
          </Text>

          <div
            style={{
              backgroundColor: theme.secondaryColor,
              padding: 12,
              borderRadius: 8,
              color: theme.whiteColor,
            }}
          >
            White text / icon preview
          </div>
        </div>

        {/* ============================================================= */}
        {/* COLOR SUMMARY                                                  */}
        {/* ============================================================= */}

        <div
          style={{
            padding: 18,
            borderRadius: 12,
            background: "#f8f8f8",
          }}
        >
          <Text
            strong
            style={{
              display: "block",
              marginBottom: 14,
            }}
          >
            Theme Color Summary
          </Text>

          <Space wrap size={[12, 12]}>
            <ColorBox label="Primary" color={theme.primaryColor} />

            <ColorBox label="Secondary" color={theme.secondaryColor} />

            <ColorBox label="Hover" color={theme.hoverColor} />

            <ColorBox label="Text Primary" color={theme.textPrimary} />

            <ColorBox label="Text Secondary" color={theme.textSecondary} />

            <ColorBox label="Border" color={theme.borderColor} />

            <ColorBox
              label="Search Background"
              color={theme.searchBarBackgroundColor}
            />

            <ColorBox
              label="Search Button"
              color={theme.searchBarButtonBackgroundColor}
            />

            <ColorBox
              label="Footer Background"
              color={theme.footerBackgroundColor}
            />

            <ColorBox label="Footer Text" color={theme.footerTextColor} />

            <ColorBox
              label="Website Background"
              color={theme.websiteBackgroundColor}
            />

            <ColorBox label="White" color={theme.whiteColor} />
          </Space>
        </div>
      </Space>
    </Card>
  );
}

/* ========================================================================== */
/* Color Box                                                                  */
/* ========================================================================== */

function ColorBox({ label, color }) {
  return (
    <div
      style={{
        width: 140,
      }}
    >
      <div
        style={{
          width: "100%",
          height: 50,
          borderRadius: 8,
          backgroundColor: color,
          border: "1px solid #d9d9d9",
        }}
      />

      <div
        style={{
          marginTop: 6,
          fontSize: 12,
          fontWeight: 600,
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: 11,
          color: "#666",
          marginTop: 2,
        }}
      >
        {color || "-"}
      </div>
    </div>
  );
}
