"use client";

import { useEffect } from "react";

import { App, Button, Card, Form, Input, Select, Space } from "antd";

import ImageUpload from "@/modules/shared/imageUpload/ImageUpload";
import CitySelector from "@/modules/shared/selectors/CitySelector";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";

import { HOME_CONTENT_SECTIONS } from "../constants/homeContent.constants";

import { useMasterData } from "@/modules/master-data/hooks/useMasterData";

export default function VibeForm({
  editingData,

  createHomeContent,
  updateHomeContent,

  onSuccess,
}) {
  const { message } = App.useApp();

  const [form] = Form.useForm();

  const { destinations } = useMasterData(
    {
      type: "YOUR_VIBE",
    },
    true,
  );

  useEffect(() => {
    if (!editingData) {
      form.resetFields();

      form.setFieldsValue({
        items: [{}],
      });

      return;
    }

    form.setFieldsValue({
      category: editingData.category,

      items: editingData.items,
    });
  }, [editingData, form]);

  const handleFinish = async (values) => {
    try {
      const payload = {
        sectionType: HOME_CONTENT_SECTIONS.VIBE,
        title: "Places As Per Your Vibe",
        category: values.category,
        items: values.items,
      };

      if (editingData?._id) {
        await updateHomeContent.mutateAsync({
          id: editingData._id,
          data: payload,
        });

        message.success("Vibe updated successfully");
      } else {
        await createHomeContent.mutateAsync(payload);

        message.success("Vibe created successfully");
      }

      form.resetFields();

      onSuccess?.();
    } catch (error) {
      console.error(error);

      message.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <Form layout="vertical" form={form} onFinish={handleFinish}>
      <Form.Item
        label="Category"
        name="category"
        rules={[
          {
            required: true,

            message: "Please select category",
          },
        ]}
      >
        <Select
          size="large"
          placeholder="Select Category"
          options={(destinations || []).map((item) => ({
            label: item.placeName,
            value: item.placeName,
          }))}
        />
      </Form.Item>

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
                <Form.Item label="Destination" shouldUpdate>
                  {() => (
                    <CitySelector
                      value={form.getFieldValue(["items", name, "cityId"])}
                      initialLabel={form.getFieldValue(["items", name, "city"])}
                      onChange={(city) => {
                        form.setFieldValue(["items", name, "name"], city.name);

                        form.setFieldValue(["items", name, "city"], city.city);

                        form.setFieldValue(
                          ["items", name, "cityId"],
                          city.cityId,
                        );
                      }}
                    />
                  )}
                </Form.Item>

                {/* Hidden Fields */}

                <Form.Item name={[name, "name"]} hidden>
                  <Input />
                </Form.Item>

                <Form.Item name={[name, "city"]} hidden>
                  <Input />
                </Form.Item>

                <Form.Item name={[name, "cityId"]} hidden>
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Image"
                  name={[name, "image"]}
                  rules={[
                    {
                      required: true,
                      message: "Please upload image",
                    },
                  ]}
                >
                  <ImageUpload />
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
                    onClick={() => remove(name)}
                    disabled={fields.length === 1}
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
                  name: "",
                  city: "",
                  cityId: "",
                  image: "",
                  alt: "",
                })
              }
            >
              Add Destination
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
