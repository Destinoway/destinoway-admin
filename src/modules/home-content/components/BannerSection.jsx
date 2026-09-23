"use client";

import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Empty, Image, Typography } from "antd";

import { useTheme } from "@/context/ThemeContext";
import { HOME_CONTENT_SECTIONS } from "../constants/homeContent.constants";

const { Text } = Typography;

export default function BannerSection({ banner, onEdit }) {
  const bannerItem = banner?.items?.[0];
  const { isDark } = useTheme();

  return (
    <Card
      className={`overflow-hidden rounded-2xl border transition-all ${
        isDark ? "border-[#2f2f2f] bg-[#1a1a1a]" : "border-gray-200 bg-white"
      }`}
      styles={{
        body: {
          padding: 20,
        },
        header: {
          padding: "16px 20px",
          borderBottom: isDark ? "1px solid #2f2f2f" : "1px solid #f1f5f9",
        },
      }}
      title={
        <span
          className={`text-lg font-semibold ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          Banner
        </span>
      }
      extra={
        <Button
          type="primary"
          size="middle"
          icon={banner ? <EditOutlined /> : <PlusOutlined />}
          onClick={() => onEdit(HOME_CONTENT_SECTIONS.BANNER, banner || null)}
        >
          {banner ? "Edit Banner" : "Create Banner"}
        </Button>
      }
    >
      {!banner ? (
        <Empty description="Banner not created yet" />
      ) : (
        <div className="grid grid-cols-12 gap-5">
          {/* Left */}
          <div
            className={`col-span-12 lg:col-span-3 rounded-xl border p-5 ${
              isDark
                ? "border-[#303030] bg-[#1f1f1f]"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <div className="space-y-3">
              <div>
                <p
                  className={`text-xs font-semibold uppercase tracking-wide ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Title
                </p>

                <p
                  className={`mt-1 text-sm font-semibold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {banner.title || "-"}
                </p>
              </div>

              <div>
                <p
                  className={`text-xs font-semibold uppercase tracking-wide ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Alt Text
                </p>

                <p
                  className={`mt-1 text-sm ${
                    isDark ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  {bannerItem?.alt || "-"}
                </p>
              </div>
            </div>
          </div>

          {/* Right */}

          <div className="col-span-12 lg:col-span-9">
            <div
              className={`overflow-hidden rounded-xl border ${
                isDark ? "border-[#303030]" : "border-gray-200"
              }`}
            >
              <Image
                preview
                src={bannerItem?.image}
                className=" w-full object-cover"
              />
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
