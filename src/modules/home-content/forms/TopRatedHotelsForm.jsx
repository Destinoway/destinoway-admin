"use client";

import { useEffect } from "react";

import ImageUpload from "@/modules/shared/imageUpload/ImageUpload";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { App, Button, Card, Form, Input, InputNumber, Space } from "antd";

import HotelSelector from "@/modules/shared/selectors/HotelSelector";

import { HOME_CONTENT_SECTIONS } from "../constants/homeContent.constants";

export default function TopRatedHotelsForm({
  editingData,
  createHomeContent,
  updateHomeContent,
  onSuccess,
}) {
  const { message } = App.useApp();

  const [form] = Form.useForm();

  useEffect(() => {
    if (!editingData) {
      form.setFieldsValue({
        items: [
          {
            hotelId: "",
            name: "",
            city: "",
            image: "",
            alt: "",
            description: "",
            rating: null,
          },
        ],
      });

      return;
    }

    form.setFieldsValue({
      items: editingData.items,
    });
  }, [editingData, form]);

  const handleFinish = async (values) => {
    try {
      const payload = {
        sectionType: HOME_CONTENT_SECTIONS.TOP_RATED_HOTELS,

        title: "Top Rated Hotels",

        items: values.items,
      };

      if (editingData?._id) {
        await updateHomeContent.mutateAsync({
          id: editingData._id,
          data: payload,
        });

        message.success("Top Rated Hotels updated successfully");
      } else {
        await createHomeContent.mutateAsync(payload);

        message.success("Top Rated Hotels created successfully");
      }

      form.resetFields();

      onSuccess?.();
    } catch (error) {
      console.error(error);
      message.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong",
      );
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish}>
      <Form.List name="items">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name }) => (
              <Card
                key={key}
                style={{
                  marginBottom: 20,
                }}
              >
                <Form.Item
                  label="Hotel"
                  shouldUpdate={(prev, curr) => prev.items !== curr.items}
                >
                  {() => (
                    <HotelSelector
                      value={form.getFieldValue(["items", name, "hotelId"])}
                      initialLabel={form.getFieldValue(["items", name, "name"])}
                      onChange={(hotel) => {
                        form.setFields([
                          {
                            name: ["items", name, "hotelId"],
                            value: hotel.hotelId,
                          },
                          {
                            name: ["items", name, "name"],
                            value: hotel.name,
                          },
                          {
                            name: ["items", name, "city"],
                            value: hotel.city,
                          },
                        ]);

                        // Validation clear karne ke liye
                        form.validateFields([["items", name, "hotelId"]]);
                      }}
                    />
                  )}
                </Form.Item>

                <Form.Item
                  hidden
                  name={[name, "hotelId"]}
                  rules={[
                    {
                      required: true,
                      message: "Please select hotel",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item hidden name={[name, "name"]}>
                  <Input />
                </Form.Item>

                <Form.Item hidden name={[name, "city"]}>
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Image"
                  name={[name, "image"]}
                  rules={[
                    {
                      required: true,
                      message: "Please upload hotel image",
                    },
                  ]}
                >
                  <ImageUpload maxSize={5} />
                </Form.Item>

                <Form.Item
                  label="Description"
                  name={[name, "description"]}
                  rules={[
                    {
                      required: true,
                      message: "Please enter description",
                    },
                  ]}
                >
                  <Input.TextArea rows={4} maxLength={300} showCount />
                </Form.Item>

                <Form.Item
                  label="Rating"
                  name={[name, "rating"]}
                  rules={[
                    {
                      required: true,
                      message: "Please enter rating",
                    },
                  ]}
                >
                  <InputNumber
                    min={1}
                    max={5}
                    step={0.1}
                    precision={1}
                    style={{
                      width: "100%",
                    }}
                  />
                </Form.Item>

                <Form.Item
                  label="Alt Text"
                  name={[name, "alt"]}
                  rules={[
                    {
                      required: true,
                      message: "Please enter alt text",
                    },
                  ]}
                >
                  <Input placeholder="Enter alt text" />
                </Form.Item>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    disabled={fields.length === 1}
                    onClick={() => remove(name)}
                  >
                    Remove
                  </Button>
                </div>
              </Card>
            ))}

            <Button
              block
              icon={<PlusOutlined />}
              onClick={() =>
                add({
                  hotelId: "",
                  name: "",
                  city: "",
                  image: "",
                  alt: "",
                  description: "",
                  rating: 0,
                })
              }
            >
              Add Hotel
            </Button>
          </>
        )}
      </Form.List>

      <Space
        style={{
          width: "100%",
          justifyContent: "flex-end",
          marginTop: 24,
        }}
      >
        <Button onClick={onSuccess}>Cancel</Button>

        <Button
          type="primary"
          htmlType="submit"
          loading={createHomeContent.isPending || updateHomeContent.isPending}
        >
          {editingData ? "Update" : "Create"}
        </Button>
      </Space>
    </Form>
  );
}
