"use client";

import { PlusOutlined, StarFilled } from "@ant-design/icons";
import { Button, Card, Empty, Image } from "antd";

import { useTheme } from "@/context/ThemeContext";
import { HOME_CONTENT_SECTIONS } from "../constants/homeContent.constants";

export default function TopRatedHotelsSection({ data = null, onEdit }) {
  const { isDark } = useTheme();

  const InfoRow = ({ label, value, className = "" }) => (
    <div className={`flex text-sm ${className}`}>
      <span
        className={`w-20 shrink-0 font-medium ${
          isDark ? "text-gray-400" : "text-gray-500"
        }`}
      >
        {label}
      </span>

      <span className={`mx-2 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
        :
      </span>

      <span className={`flex-1 ${isDark ? "text-white" : "text-gray-900"}`}>
        {value || "-"}
      </span>
    </div>
  );

  return (
    <Card
      className={`rounded-2xl border shadow-sm ${
        isDark ? "border-[#2f2f2f] bg-[#1b1b1b]" : "border-gray-200 bg-white"
      }`}
      styles={{
        body: {
          padding: 20,
        },
      }}
      title={
        <div className="flex items-center gap-3">
          <span
            className={`text-lg font-semibold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Top Rated Hotels
          </span>

          {data && (
            <span
              className={`rounded-full px-2 py-1 text-xs ${
                isDark
                  ? "bg-[#303030] text-gray-300"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {data.items?.length || 0} Hotels
            </span>
          )}
        </div>
      }
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => onEdit(HOME_CONTENT_SECTIONS.TOP_RATED_HOTELS, data)}
        >
          {data ? "Edit" : "Create"}
        </Button>
      }
    >
      {!data ? (
        <Empty description="No Top Rated Hotels Found" />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {data.items?.map((hotel) => (
            <div
              key={hotel._id || hotel.hotelId}
              className={`overflow-hidden rounded-xl border transition-all hover:-translate-y-1 hover:shadow-lg ${
                isDark
                  ? "border-[#303030] bg-[#232323]"
                  : "border-gray-200 bg-white"
              }`}
            >
              {/* Image */}
              <div className="h-[144px] w-[300px] overflow-hidden">
                <Image
                  preview
                  src={hotel.image}
                  alt={hotel.name || "Hotel Image"}
                  width={300}
                  height={144}
                  className="!h-[144px] !w-[300px] object-cover"
                />
              </div>

              {/* Content */}
              <div className="space-y-3 p-4">
                {/* Name + Rating */}
                <div className="flex items-start justify-between gap-2">
                  <h3
                    className={`line-clamp-2 text-sm font-semibold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {hotel.name}
                  </h3>

                  <div
                    className={`flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
                      isDark
                        ? "bg-yellow-500/20 text-yellow-300"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    <StarFilled />
                    {hotel.rating}
                  </div>
                </div>

                {/* Hotel Information */}
                <div
                  className={`border-t pt-3 ${
                    isDark ? "border-[#303030]" : "border-gray-200"
                  }`}
                >
                  <div className="space-y-2">
                    <InfoRow label="City" value={hotel.city} />

                    <InfoRow label="Hotel ID" value={hotel.hotelId} />

                    <InfoRow label="Alt" value={hotel.alt} />

                    <InfoRow
                      label="Description"
                      value={
                        <span className="line-clamp-2">
                          {hotel.description}
                        </span>
                      }
                      className="items-start"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
