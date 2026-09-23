"use client";

import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Collapse,
  Empty,
  Image,
  Popconfirm,
} from "antd";

import { useTheme } from "@/context/ThemeContext";
import { HOME_CONTENT_SECTIONS } from "../constants/homeContent.constants";

export default function PopularDestinationsSection({
  destinations = [],
  onCreate,
  onEdit,
  onDelete,
}) {
  const { isDark } = useTheme();

  const InfoRow = ({ label, value }) => (
    <div className="flex text-sm">
      <span
        className={`w-20 shrink-0 font-medium ${
          isDark ? "text-gray-400" : "text-gray-500"
        }`}
      >
        {label}
      </span>

      <span
        className={`mx-2 ${
          isDark ? "text-gray-500" : "text-gray-400"
        }`}
      >
        :
      </span>

      <span
        className={`flex-1 break-all ${
          isDark ? "text-white" : "text-gray-900"
        }`}
      >
        {value || "-"}
      </span>
    </div>
  );

  return (
    <Card
      className={`rounded-2xl border shadow-sm ${
        isDark
          ? "border-[#2f2f2f] bg-[#1b1b1b]"
          : "border-gray-200 bg-white"
      }`}
      styles={{
        body: {
          padding: 20,
        },
      }}
      title={
        <span
          className={`text-lg font-semibold ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          Popular Destinations
        </span>
      }
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() =>
            onCreate(HOME_CONTENT_SECTIONS.POPULAR_DESTINATIONS)
          }
        >
          Add Category
        </Button>
      }
    >
      {destinations.length === 0 ? (
        <Empty description="No Categories Found" />
      ) : (
        <Collapse
          accordion={false}
          ghost
          defaultActiveKey={destinations[0]?._id}
          className="home-content-collapse"
          items={destinations.map((category) => ({
            key: category._id,

            label: (
              <div className="flex w-full items-center justify-between pr-4">
                <div className="flex items-center gap-3">
                  <h3
                    className={`text-base font-semibold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {category.category}
                  </h3>

                  <span
                    className={`rounded-full px-3 py-1 text-xs ${
                      isDark
                        ? "bg-[#303030] text-gray-300"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {category.items?.length || 0} Destinations
                  </span>
                </div>

                <div
                  className="flex gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() =>
                      onEdit(
                        HOME_CONTENT_SECTIONS.POPULAR_DESTINATIONS,
                        category,
                      )
                    }
                  >
                    Edit
                  </Button>

                  <Popconfirm
                    title="Delete this category?"
                    onConfirm={() => onDelete(category._id)}
                  >
                    <Button
                      danger
                      size="small"
                      icon={<DeleteOutlined />}
                    >
                      Delete
                    </Button>
                  </Popconfirm>
                </div>
              </div>
            ),

            children: (
              <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2 xl:grid-cols-4">
                {category.items?.map((destination) => (
                  <div
                    key={destination._id}
                    className={`overflow-hidden rounded-xl border transition-all hover:-translate-y-1 hover:shadow-lg ${
                      isDark
                        ? "border-[#303030] bg-[#1f1f1f]"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    {/* Fixed Size Image */}
                    <div className="h-[144px] w-full overflow-hidden">
                      <Image
                        preview
                        src={destination.image}
                        alt={destination.name || "Destination Image"}
                        width={500}
                        height={144}
                        className="!h-[144px] !w-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="space-y-3 p-4">
                      <h3
                        className={`line-clamp-2 text-sm font-semibold ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {destination.name}
                      </h3>

                      <div
                        className={`border-t pt-3 ${
                          isDark
                            ? "border-[#303030]"
                            : "border-gray-200"
                        }`}
                      >
                        <div className="space-y-2">
                          <InfoRow
                            label="City"
                            value={destination.city}
                          />

                          <InfoRow
                            label="City ID"
                            value={destination.cityId}
                          />

                          <InfoRow
                            label="Alt"
                            value={destination.alt}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ),
          }))}
        />
      )}
    </Card>
  );
}
