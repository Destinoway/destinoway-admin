"use client";

import { ClearOutlined } from "@ant-design/icons";
import { Button, Col, Input, Row, Select } from "antd";

const { Search } = Input;

export default function TableFilters({
  search,
  setSearch,

  searchPlaceholder = "Search...",

  status,
  setStatus,

  statusOptions = [
    {
      label: "Active",
      value: true,
    },
    {
      label: "Inactive",
      value: false,
    },
  ],

  isLoading = false,

  roleId,
  setRoleId,

  hasActiveFilters,
  roleOptions = [],

  onReset,
}) {
  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
      {/* Search */}
      <Col xs={24} md={8}>
        <Search
          placeholder={searchPlaceholder}
          allowClear
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onSearch={setSearch}
          loading={isLoading}
        />
      </Col>

      {/* Status */}
      <Col xs={24} md={5}>
        <Select
          placeholder="Status"
          allowClear
          style={{ width: "100%" }}
          value={status}
          onChange={setStatus}
          options={statusOptions}
        />
      </Col>

      {/* Role */}
      {setRoleId && (
        <Col xs={24} md={5}>
          <Select
            placeholder="Role"
            allowClear
            style={{ width: "100%" }}
            value={roleId}
            onChange={setRoleId}
            options={roleOptions}
          />
        </Col>
      )}

      {/* Reset */}
      <Col xs={24} md={4}>
        <Button
          block
          className="text-red-500!"
          disabled={!hasActiveFilters}
          icon={<ClearOutlined />}
          onClick={onReset}
        >
          Reset
        </Button>
      </Col>
    </Row>
  );
}
