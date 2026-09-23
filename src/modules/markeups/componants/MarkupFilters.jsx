"use client";

import { ClearOutlined } from "@ant-design/icons";

import { Button, Col, Input, Row, Select } from "antd";
import { levelOptions, statusOptions } from "../data/MarkupsData";

export default function MarkupFilters({
  statusFilter,
  setStatusFilter,
  levelFilter,
  setLevelFilter,
  search,
  setSearch,
  showSearch,
  hasActiveFilters,
  handleResetFilters,
}) {
  const getSearchPlaceholder = () => {
    switch (levelFilter) {
      case "country":
        return "Search country";
      case "state":
        return "Search state";
      case "city":
        return "Search city";
      case "hotel":
        return "Search hotel";
      default:
        return "Search";
    }
  };

  return (
    <Row
      gutter={[12, 12]}
      align="middle"
      style={{
        marginBottom: 16,
      }}
    >
      {/* STATUS */}

      <Col xs={24} md={6}>
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          style={{
            width: "100%",
          }}
          options={statusOptions}
        />
      </Col>

      {/* LEVEL */}

      <Col xs={24} md={6}>
        <Select
          value={levelFilter}
          onChange={(value) => {
            setLevelFilter(value);
            setSearch("");
          }}
          style={{
            width: "100%",
          }}
          options={levelOptions}
        />
      </Col>

      {/* SEARCH */}

      {showSearch && (
        <Col xs={24} md={8}>
          <Input.Search
            allowClear
            value={search}
            placeholder={getSearchPlaceholder()}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
      )}

      {/* RESET */}

      <Col xs={24} md={4}>
        <Button
          block
          className="text-red-500!"
          disabled={!hasActiveFilters}
          icon={<ClearOutlined />}
          onClick={handleResetFilters}
        >
          Reset
        </Button>
      </Col>
    </Row>
  );
}
