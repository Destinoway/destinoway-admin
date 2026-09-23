"use client";

import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, Form, InputNumber, Row, Select, Space } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import { useLocations } from "../hooks/useLocations";

export default function ServiceTaxFields() {
  const form = Form.useFormInstance();

  const ruleType = Form.useWatch("ruleType", form);
  const taxType = Form.useWatch("taxType", form);
  const slabs = Form.useWatch("slabs", form);

  const [countrySearch, setCountrySearch] = useState("");
  const [debouncedCountrySearch] = useDebounce(countrySearch, 500);

  // ================= COUNTRIES =================

  const { data: countries = [], isLoading: countriesLoading } = useLocations({
    type: "countries",
    search: debouncedCountrySearch,
    enabled: true,
  });

  const countryOptions = useMemo(() => {
    if (!Array.isArray(countries)) return [];

    return countries.map((item) => ({
      label: item.countryName || item.name,
      value: item.countryCode || item.code,
    }));
  }, [countries]);

  // ================= DEFAULT SLAB =================

  useEffect(() => {
    if (ruleType === "slab") {
      const currentSlabs = form.getFieldValue("slabs");

      if (!currentSlabs || currentSlabs.length === 0) {
        form.setFieldValue("slabs", [
          {
            minAmount: undefined,
            taxValue: undefined,
          },
        ]);
      }
    }

    if (ruleType === "flat") {
      form.setFieldValue("slabs", undefined);
    }
  }, [ruleType, form]);

  return (
    <>
      {/* ================= COUNTRY ================= */}

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            label="Country"
            name="countryCode"
            rules={[
              {
                required: true,
                message: "Please select country",
              },
            ]}
          >
            <Select
              size="large"
              showSearch
              allowClear
              placeholder="Select Country"
              loading={countriesLoading}
              filterOption={false}
              onSearch={setCountrySearch}
              options={countryOptions}
            />
          </Form.Item>
        </Col>
      </Row>

      {/* ================= RULE TYPE ================= */}

      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            label="Rule Type"
            name="ruleType"
            rules={[
              {
                required: true,
                message: "Please select rule type",
              },
            ]}
          >
            <Select
              size="large"
              placeholder="Select Rule Type"
              options={[
                {
                  label: "Slab",
                  value: "slab",
                },
                {
                  label: "Flat",
                  value: "flat",
                },
              ]}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label="Tax Type"
            name="taxType"
            rules={[
              {
                required: true,
                message: "Please select tax type",
              },
            ]}
          >
            <Select
              size="large"
              placeholder="Select Tax Type"
              options={[
                {
                  label: "Percentage",
                  value: "percentage",
                },
                {
                  label: "Fixed",
                  value: "fixed",
                },
              ]}
            />
          </Form.Item>
        </Col>
      </Row>

      {/* ================= FLAT ================= */}

      {ruleType === "flat" && (
        <Form.Item label="Tax Value" required>
          <Space.Compact style={{ width: "100%" }}>
            <Form.Item
              name="taxValue"
              noStyle
              rules={[
                {
                  required: true,
                  message: "Please enter tax value",
                },
              ]}
            >
              <InputNumber
                size="large"
                min={0}
                style={{ width: "100%" }}
                placeholder="Enter Tax Value"
              />
            </Form.Item>

            <Button disabled size="large">
              {taxType === "percentage" ? "%" : "₹"}
            </Button>
          </Space.Compact>
        </Form.Item>
      )}

      {/* ================= SLABS ================= */}

      {ruleType === "slab" && (
        <Form.List name="slabs">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field) => (
                <Row key={field.key} gutter={12} align="middle">
                  <Col xs={24} md={10}>
                    <Form.Item
                      name={[field.name, "minAmount"]}
                      label="Minimum Amount"
                      rules={[
                        {
                          required: true,
                          message: "Required",
                        },
                      ]}
                    >
                      <InputNumber
                        size="large"
                        min={0}
                        style={{ width: "100%" }}
                        placeholder="Enter tax value"
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={10}>
                    <Form.Item
                      name={[field.name, "taxValue"]}
                      label="Tax Value"
                      rules={[
                        {
                          required: true,
                          message: "Required",
                        },
                      ]}
                    >
                      <InputNumber
                        size="large"
                        min={0}
                        style={{ width: "100%" }}
                        placeholder="Enter tax value"
                      />
                    </Form.Item>
                  </Col>

                  <Col
                    xs={24}
                    md={4}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      paddingTop: 30,
                    }}
                  >
                    <Button
                      type="text"
                      danger
                      icon={<MinusCircleOutlined />}
                      disabled={fields.length === 1}
                      onClick={() => remove(field.name)}
                    />
                  </Col>
                </Row>
              ))}

              <Button
                type="dashed"
                htmlType="button"
                icon={<PlusOutlined />}
                onClick={() =>
                  add({
                    minAmount: undefined,
                    taxValue: undefined,
                  })
                }
                block
              >
                Add Slab
              </Button>
            </>
          )}
        </Form.List>
      )}
    </>
  );
}
