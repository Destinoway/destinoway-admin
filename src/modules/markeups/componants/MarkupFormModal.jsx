"use client";

import { PercentageOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

import {
  Button,
  Card,
  Col,
  Form,
  InputNumber,
  Modal,
  Row,
  Select,
  Space,
  Typography,
} from "antd";

import { useEffect } from "react";
import { LEVEL_OPTIONS } from "../data/MarkupsData";
import { useMarkups } from "../hooks/useMarkups";
import LevelFields from "./LevelFields";
import ServiceTaxFields from "./ServiceTaxFields";
const { Text, Title } = Typography;

export default function MarkupFormModal({
  open,
  setOpen,
  editData,
  isTaxEdit,
  setEditData,
  setIsTaxEdit,
}) {
  const [form] = Form.useForm();
  const level = Form.useWatch("level", form);
  const ruleType = Form.useWatch("ruleType", form);
  const taxType = Form.useWatch("taxType", form);
  const markupType = Form.useWatch("markupType", form);
  const markupValue = Form.useWatch("markupValue", form);
  const { createMarkup, updateMarkup, createTax, updateTax } = useMarkups();

  const handleClose = () => {
    form.resetFields();
    setEditData(null);
    setIsTaxEdit(false);

    setOpen(false);
  };

  // ================= EDIT =================

  useEffect(() => {
    if (open && editData) {
      // ================= TAX EDIT =================

      if (isTaxEdit) {
        console.log("isTaxEdit", isTaxEdit);
        console.log("editData", editData);
        console.log("Flat Tax Value:", editData?.taxValue);
        form.setFieldsValue({
          level: "serviceTax",
          countryCode: editData?.countryCode,
          ruleType: editData?.ruleType,
          taxType: editData?.taxType,

          ...(editData?.ruleType === "flat"
            ? {
                taxValue: editData?.taxValue,
              }
            : {
                slabs:
                  editData?.slabs?.map((item) => ({
                    minAmount: item?.minAmount,
                    taxValue: item?.taxValue,
                  })) || [],
              }),
        });

        return;
      }
      form.setFieldsValue({
        level: editData?.level,
        countryCode: editData?.countryCode,
        stateName: editData?.stateName,
        cityData: editData?.cityId
          ? {
              label: editData?.cityName,
              value: JSON.stringify({
                cityId: editData?.cityId,
                cityName: editData?.cityName,
              }),
            }
          : undefined,
        hotelData: editData?.hotelId
          ? {
              label: editData?.hotelName,
              value: JSON.stringify({
                hotelId: editData?.hotelId,
                hotelName: editData?.hotelName,
              }),
            }
          : undefined,

        addDateRange: !!editData?.startDate && !!editData?.endDate,
        dateRange:
          editData?.startDate && editData?.endDate
            ? [dayjs(editData?.startDate), dayjs(editData?.endDate)]
            : undefined,
        markupType: editData?.markupType,
        markupValue: editData?.markupValue,
        serviceChargeValue: editData?.serviceChargeValue,
      });
    } else {
      form.resetFields();
    }
  }, [editData, open, form, isTaxEdit]);

  // ================= SUBMIT =================

  const onFinish = async (values) => {
    console.log("values", values);
    // ================= SERVICE TAX =================

    if (values.level === "serviceTax") {
      const payload = {
        countryCode: values.countryCode,
        ruleType: values.ruleType,
        taxType: values.taxType,
        serviceType: "hotel",
        isActive: editData?.isActive ?? true,
      };

      if (values.ruleType === "flat") {
        payload.taxValue = values.taxValue;
      } else {
        payload.slabs = values.slabs;
      }

      // ================= UPDATE =================

      if (isTaxEdit) {
        await updateTax.mutateAsync({
          id: editData._id,
          data: payload,
        });
      }

      // ================= CREATE =================
      else {
        await createTax.mutateAsync(payload);
      }

      form.resetFields();

      setOpen(false);

      return;
    }

    // ================= MARKUP =================
    // CITY

    if (values?.cityData) {
      const parsedCity = JSON.parse(values.cityData.value);
      values.cityId = parsedCity?.cityId;
      values.cityName = parsedCity?.cityName;
      delete values.cityData;
    }

    // HOTEL

    if (values?.hotelData) {
      const parsedHotel = JSON.parse(values.hotelData.value);
      values.hotelId = parsedHotel?.hotelId;
      values.hotelName = parsedHotel?.hotelName;
      delete values.hotelData;
    }
    if (values?.dateRange) {
      values.startDate = values.dateRange[0]?.toISOString();
      values.endDate = values.dateRange[1]?.toISOString();
      delete values.dateRange;
    }

    if (!values?.addDateRange) {
      values.startDate = null;
      values.endDate = null;
    }

    // UPDATE

    if (editData?._id) {
      await updateMarkup.mutateAsync({
        id: editData?._id,
        data: values,
      });
    }

    // CREATE
    else {
      await createMarkup.mutateAsync(values);
    }
    form.resetFields();
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      footer={null}
      centered
      width={760}
      destroyOnHidden
      onCancel={handleClose}
      styles={{
        body: {
          paddingTop: 10,
        },
      }}
      title={
        <div>
          <Title
            level={4}
            style={{
              marginBottom: 0,
              fontSize: 18,
            }}
          >
            {level === "serviceTax"
              ? editData
                ? "Edit Service Tax"
                : "Create Service Tax"
              : editData
                ? "Edit Markup"
                : "Create Markup"}
          </Title>
          <Text type="secondary">
            {level === "serviceTax"
              ? "Configure service tax rules"
              : "Configure pricing rules"}
          </Text>
        </div>
      }
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        {/* ================= LEVEL ================= */}

        <div
          style={{
            marginBottom: 18,
          }}
        >
          <Text
            strong
            style={{
              display: "block",
              marginBottom: 10,
            }}
          >
            Select Scope
          </Text>

          <Form.Item
            name="level"
            style={{
              marginBottom: 0,
            }}
            rules={[
              {
                required: true,
                message: "Please select level",
              },
            ]}
          >
            <Row gutter={[10, 10]}>
              {LEVEL_OPTIONS?.map((item) => {
                const active = level === item?.value;

                return (
                  <Col xs={12} sm={8} md={4} key={item?.value}>
                    <Card
                      hoverable
                      size="small"
                      onClick={() => form.setFieldValue("level", item?.value)}
                      styles={{
                        body: {
                          padding: 10,
                        },
                      }}
                      style={{
                        textAlign: "center",
                        cursor: "pointer",
                        border: active
                          ? `1.5px solid ${item.color}`
                          : undefined,

                        background: active ? `${item.color}10` : undefined,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <div
                          style={{
                            fontSize: 18,
                            color: item.color,
                          }}
                        >
                          {item.icon}
                        </div>

                        <Text
                          style={{
                            fontSize: 12,
                          }}
                          strong
                        >
                          {item.label}
                        </Text>
                      </div>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </Form.Item>
        </div>

        {/* ================= LOCATION ================= */}

        {["country", "state", "city", "hotel"]?.includes(level) && (
          <div
            style={{
              marginBottom: 18,
            }}
          >
            <Text
              strong
              style={{
                display: "block",
                marginBottom: 12,
              }}
            >
              Location Details
            </Text>

            <LevelFields level={level} />
          </div>
        )}
        {level === "serviceTax" && (
          <div
            style={{
              marginBottom: 18,
            }}
          >
            <Text
              strong
              style={{
                display: "block",
                marginBottom: 12,
              }}
            >
              Service Tax Configuration
            </Text>

            <ServiceTaxFields />
          </div>
        )}

        {/* ================= MARKUP CONFIG ================= */}

        {level !== "serviceTax" && (
          <div
            style={{
              marginBottom: 18,
            }}
          >
            <Text
              strong
              style={{
                display: "block",
                marginBottom: 12,
              }}
            >
              Pricing Configuration
            </Text>

            <Row gutter={16}>
              {/* TYPE */}

              <Col xs={24} md={8}>
                <Form.Item
                  label="Markup Type"
                  name="markupType"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Select
                    size="large"
                    placeholder="Select Type"
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

              {/* MARKUP VALUE */}

              <Col xs={24} md={8}>
                <Form.Item label="Markup Value" required>
                  <Space.Compact
                    style={{
                      width: "100%",
                    }}
                  >
                    <Form.Item
                      name="markupValue"
                      noStyle
                      rules={[
                        {
                          required: true,
                          message: "Please enter markup value",
                        },
                      ]}
                    >
                      <InputNumber
                        size="large"
                        min={0}
                        style={{
                          width: "100%",
                        }}
                        placeholder="Enter markup"
                      />
                    </Form.Item>

                    <Button size="large" disabled>
                      {markupType === "percentage" ? "%" : "₹"}
                    </Button>
                  </Space.Compact>
                </Form.Item>
              </Col>

              {/* SERVICE CHARGE */}

              <Col xs={24} md={8}>
                <Form.Item label="Service Charge Value" required>
                  <Space.Compact
                    style={{
                      width: "100%",
                    }}
                  >
                    <Form.Item
                      name="serviceChargeValue"
                      noStyle
                      rules={[
                        {
                          required: true,
                          message: "Please enter service charge",
                        },
                      ]}
                    >
                      <InputNumber
                        size="large"
                        min={0}
                        style={{
                          width: "100%",
                        }}
                        placeholder="Enter service charge"
                      />
                    </Form.Item>

                    <Button size="large" disabled>
                      {markupType === "percentage" ? "%" : "₹"}
                    </Button>
                  </Space.Compact>
                </Form.Item>
              </Col>
            </Row>
          </div>
        )}

        {/* ================= ACTIONS ================= */}

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",

            gap: 10,
          }}
        >
          <Button onClick={handleClose}>Cancel</Button>

          <Button
            type="primary"
            htmlType="submit"
            icon={<PercentageOutlined />}
            loading={
              createMarkup.isPending ||
              updateMarkup.isPending ||
              createTax.isPending ||
              updateTax.isPending
            }
          >
            {level === "serviceTax"
              ? editData
                ? "Update Tax"
                : "Create Tax"
              : editData
                ? "Update"
                : "Create"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
