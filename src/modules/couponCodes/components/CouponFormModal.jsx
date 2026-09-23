"use client";

import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Space,
  Typography,
} from "antd";

import ImageUpload from "@/modules/shared/imageUpload/ImageUpload";
import dayjs from "dayjs";
import { useEffect } from "react";
import { discountTypeOptions, moduleOptions } from "../data/CouponData";
import { useCouponCodes } from "../hooks/useCouponCodes";
const { Title, Text } = Typography;

export default function CouponFormModal({
  open,
  setOpen,
  editData,
  setEditData,
}) {
  const [form] = Form.useForm();

  const { createCoupon, updateCoupon } = useCouponCodes();

  const discountType = Form.useWatch("discountType", form);

  useEffect(() => {
    if (open && editData) {
      form.setFieldsValue({
        code: editData.code,
        title: editData.title,
        image: editData?.image,
        applicableModules: editData.applicableModules,
        discountType: editData.discountType,
        discountValue: editData.discountValue,
        minAmount: editData.minAmount,

        validity:
          editData?.validity?.startDate && editData?.validity?.endDate
            ? [
                dayjs(editData.validity.startDate),
                dayjs(editData.validity.endDate),
              ]
            : undefined,

        isAutoApply: editData.isAutoApply,
        isActive: editData.isActive,
        image: editData.image,
      });
    } else {
      form.resetFields();
    }
  }, [open, editData, form]);

  const onFinish = async (values) => {
    const payload = {
      ...values,

      code: values.code?.trim().toUpperCase(),
      title: values.title?.trim(),
      image: values.image || null,

      validity: {
        startDate: values.validity?.[0]?.startOf("day")?.toISOString(),

        endDate: values.validity?.[1]?.endOf("day")?.toISOString(),
      },
    };

    // Form wale dayjs array ko remove kar do
    delete payload.validity;

    // Fir validity object add karo
    payload.validity = {
      startDate: values.validity?.[0]?.startOf("day")?.toISOString(),

      endDate: values.validity?.[1]?.endOf("day")?.toISOString(),
    };

    try {
      if (editData?._id) {
        await updateCoupon.mutateAsync({
          id: editData._id,
          data: payload,
        });
      } else {
        await createCoupon.mutateAsync(payload);
      }

      form.resetFields();
      setEditData(null);
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Modal
      open={open}
      width={760}
      centered
      footer={null}
      destroyOnHidden
      onCancel={() => {
        form.resetFields();
        setOpen(false);
      }}
      title={
        <div>
          <Title
            level={4}
            style={{
              marginBottom: 0,
            }}
          >
            {editData ? "Edit Coupon" : "Create Coupon"}
          </Title>

          <Text type="secondary">
            {editData ? "Update coupon details" : "Configure coupon code"}
          </Text>
        </div>
      }
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        {/* ================= CODE + TITLE ================= */}
        <Form.Item label="Coupon Image" name="image">
          <ImageUpload />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Coupon Code"
              name="code"
              rules={[
                {
                  required: true,
                  message: "Please enter coupon code",
                },
              ]}
            >
              <Input
                size="large"
                placeholder="Ex : HOTEL10"
                onChange={(e) =>
                  form.setFieldValue("code", e.target.value.toUpperCase())
                }
                style={{
                  textTransform: "uppercase",
                }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Coupon Title"
              name="title"
              rules={[
                {
                  required: true,
                  message: "Please enter coupon title",
                },
              ]}
            >
              <Input size="large" placeholder="Hotel Discount" />
            </Form.Item>
          </Col>
        </Row>

        {/* ================= MODULES ================= */}

        <Form.Item
          label="Applicable Modules"
          name="applicableModules"
          rules={[
            {
              required: true,
              message: "Please select modules",
            },
          ]}
        >
          <Select
            mode="multiple"
            size="large"
            placeholder="Select Modules"
            options={moduleOptions}
          />
        </Form.Item>

        {/* ================= DISCOUNT ================= */}

        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item
              label="Discount Type"
              name="discountType"
              rules={[
                {
                  required: true,
                  message: "Please select type",
                },
              ]}
            >
              <Select
  size="large"
  placeholder="Select Type"
  options={discountTypeOptions}
  onChange={(value) => {
    form.setFieldsValue({
      discountType: value,
      discountValue: undefined,
      minAmount: undefined,
    });
  }}
/>
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item label="Discount Value" required>
              <Space.Compact
                style={{
                  width: "100%",
                }}
              >
                <Form.Item
                  name="discountValue"
                  noStyle
                  rules={[
                    {
                      required: true,
                      message: "Please enter value",
                    },
                  ]}
                >
                  <InputNumber
                    min={0}
                    size="large"
                    style={{
                      width: "100%",
                    }}
                    placeholder="Discount"
                  />
                </Form.Item>

                <Button size="large" disabled>
                  {discountType === "percent" ? "%" : "₹"}
                </Button>
              </Space.Compact>
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item
              label="Minimum Amount"
              name="minAmount"
              rules={[
                {
                  required: true,
                  message: "Please enter minimum amount",
                },
              ]}
            >
              <InputNumber
                min={0}
                size="large"
                style={{
                  width: "100%",
                }}
                placeholder="Minimum Amount"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Coupon Validity"
              name="validity"
              rules={[
                {
                  required: true,
                  message: "Please select coupon validity",
                },
              ]}
            >
              <DatePicker.RangePicker
                size="large"
                style={{
                  width: "100%",
                }}
                format="DD MMM YYYY"
                disabledDate={(current) =>
                  current && current < dayjs().startOf("day")
                }
              />
            </Form.Item>
          </Col>
        </Row>

        {/* ================= SETTINGS ================= */}

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="isAutoApply"
              valuePropName="checked"
              initialValue={true}
            >
              <Checkbox>Auto Apply Coupon</Checkbox>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="isActive"
              valuePropName="checked"
              initialValue={true}
            >
              <Checkbox>Active</Checkbox>
            </Form.Item>
          </Col>
        </Row>

        {/* ================= ACTIONS ================= */}

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
            marginTop: 20,
          }}
        >
          <Button
            onClick={() => {
              form.resetFields();
              setOpen(false);
            }}
          >
            Cancel
          </Button>

          <Button
            type="primary"
            htmlType="submit"
            loading={createCoupon.isPending || updateCoupon.isPending}
          >
            {editData ? "Update Coupon" : "Create Coupon"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
