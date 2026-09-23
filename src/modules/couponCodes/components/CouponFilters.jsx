"use client";

import { ClearOutlined } from "@ant-design/icons";
import { Button, Col, DatePicker, Input, Row, Select } from "antd";

import { statusOptions } from "../data/CouponData";

export default function CouponFilters({
  search,
  setSearch,

  statusFilter,
  setStatusFilter,

  validityFilter,
  setValidityFilter,

  hasActiveFilters,
  handleResetFilters,
}) {
  return (
    <Row
      gutter={[12, 12]}
      align="middle"
      style={{
        marginBottom: 16,
      }}
    >
      {/* SEARCH */}

      <Col xs={24} md={6}>
        <Input.Search
          allowClear
          value={search}
          placeholder="Search Coupon"
          onChange={(e) => setSearch(e.target.value)}
        />
      </Col>

      {/* STATUS */}

      <Col xs={24} md={4}>
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          style={{
            width: "100%",
          }}
          options={statusOptions}
        />
      </Col>

      {/* VALIDITY */}

      <Col xs={24} md={6}>
        <DatePicker.RangePicker
          value={validityFilter}
          onChange={setValidityFilter}
          style={{
            width: "100%",
          }}
          format="DD MMM YYYY"
          allowClear
        />
      </Col>

      {/* RESET */}

      <Col xs={24} md={4}>
        <Button
          block
          icon={<ClearOutlined />}
          className="text-red-500!"
          disabled={!hasActiveFilters}
          onClick={handleResetFilters}
        >
          Reset
        </Button>
      </Col>
    </Row>
  );
}
