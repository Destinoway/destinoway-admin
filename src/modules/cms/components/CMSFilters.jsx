"use client";

import { Input, Select, Space } from "antd";

export default function CMSFilters({
  search,
  setSearch,
  entityType,
  setEntityType,
}) {
  return (
    <Space
      wrap
      style={{
        marginBottom: 16,
      }}
    >
      <Input.Search
        placeholder="Search page..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        allowClear
        style={{
          width: 260,
        }}
      />

      <Select
        value={entityType}
        onChange={setEntityType}
        style={{
          width: 180,
        }}
        options={[
          {
            value: "all",
            label: "All Types",
          },

          {
            value: "static",
            label: "Static",
          },

          {
            value: "hotel",
            label: "Hotel",
          },

          {
            value: "hotelCity",
            label: "City",
          },

          {
            value: "marketing",
            label: "Marketing",
          },
           {
            value: "blog",
            label: "Blogs",
          },
        ]}
      />
    </Space>
  );
}
