"use client";

import { useMasterData } from "@/modules/master-data/hooks/useMasterData";
import { usePermission } from "@/modules/shared/hooks/usePermission";
import { CopyOutlined } from "@ant-design/icons";
import {
    App,
    Button,
    Card,
    Col,
    Form,
    Input,
    Row,
    Select,
    Space,
    Switch,
    Tooltip,
    theme,
} from "antd";
import Text from "antd/es/typography/Text";
import { debounce } from "lodash";
import { useEffect, useMemo } from "react";
import useCMSForm from "../hooks/useCMSForm";
import { buildFrontendUrl } from "../utils/cmsUrl";
import ImageUpload from "./../../shared/imageUpload/ImageUpload"; // apne path ke hisab se
import CMSBlocksBuilder from "./CMSBlocksBuilder";
import CMSSeoFields from "./CMSSeoFields";
import CMSCitySelector from "./entity-selector/CMSCitySelector";
import CMSHotelSelector from "./entity-selector/CMSHotelSelector";

export default function CMSForm({ id }) {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const entityType = Form.useWatch("entityType", form);
  const { masterData } = useMasterData(
    {
      type: "BLOGS",
    },
    entityType === "blog",
  );

  console.log("CMSForm masterData", masterData);

  const title = Form.useWatch("title", form);
  const slug = Form.useWatch("slug", form);
  const entityId = Form.useWatch("entityId", form);
  const hotelMeta = Form.useWatch(["data", "hotelMeta"], form);
  const cityMeta = Form.useWatch("cityMeta", form);

  const { canCreate, canEdit, isAdmin } = usePermission("cmsPages");

  const canSubmit = id ? canEdit || isAdmin : canCreate || isAdmin;

  const { handleSubmit, isSubmitting, previewSlug } = useCMSForm({
    id,
    form,
  });

  const showEntityId = entityType === "hotelCity" || entityType === "hotel";

  const {
    token: { colorBgContainer, colorBorderSecondary, colorTextSecondary },
  } = theme.useToken();

  const debouncedPreview = useMemo(
    () => debounce(previewSlug, 500),
    [previewSlug],
  );

  useEffect(() => {
    return () => {
      debouncedPreview.cancel();
    };
  }, [debouncedPreview]);

  useEffect(() => {
    if (id) return;

    if (
      entityType === "static" ||
      entityType === "marketing" ||
      entityType === "blog"
    ) {
      if (title) {
        debouncedPreview();
      }
    }

    if (entityType === "hotelCity") {
      if (cityMeta?.destination) {
        debouncedPreview();
      }
    }

    if (entityType === "hotel") {
      if (hotelMeta?.hotelName) {
        debouncedPreview();
      }
    }
  }, [entityType, title, cityMeta, hotelMeta, id, debouncedPreview]);

  /*
    PREVIEW
  */
  const handlePreview = () => {
    const values = form.getFieldsValue(true);

    if (!id) {
      message.warning("Save draft before preview");
      return;
    }

    if (!values.url) {
      message.warning("Preview URL not found");
      return;
    }

    window.open(
      buildFrontendUrl(values.url, { preview: true }),
      "_blank",
      "noopener,noreferrer",
    );
  };

  const url = Form.useWatch("url", form);

  const handleSlugChange = (event) => {
    const nextSlug = event.target.value
      .toLowerCase()
      .trim()
      .replace(/&/g, "and")
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    let nextUrl = `/${nextSlug}`;
    if (entityType === "hotelCity") {
      nextUrl = `/hotels/${nextSlug}`;
    } else if (entityType === "hotel") {
      const citySlug = (cityMeta?.destination || "")
        .split(",")[0]
        .toLowerCase()
        .trim()
        .replace(/&/g, "and")
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
      nextUrl = `/hotel-details/${citySlug}/${nextSlug}?hid=${entityId || ""}`;
    }

    form.setFieldsValue({ slug: nextSlug, url: nextUrl });
  };

  const handleCopySlug = async () => {
    if (!url) return;

    await navigator.clipboard.writeText(buildFrontendUrl(url));

    message.success("URL copied successfully");
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        isPublished: true,
        entityType: "static",
      }}
    >
      <Row gutter={[24, 24]}>
        {/* LEFT */}

        <Col xs={24} lg={16}>
          <Card
            variant={false}
            style={{
              borderRadius: 5,
              background: colorBgContainer,
            }}
          >
            {/* HEADER */}
            <div
              style={{
                marginBottom: 24,
                paddingBottom: 16,
                borderBottom: `1px solid ${colorBorderSecondary}`,
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: 20,
                  fontWeight: 700,
                }}
              >
                Page Information
              </h2>
            </div>

            <Form.Item
              name="entityType"
              label={<span className="font-bold">entity Type</span>}
              rules={[{ required: true }]}
            >
              <Select
                size="large"
                options={[
                  {
                    value: "static",
                    label: "Static Page",
                  },
                  {
                    value: "hotelCity",
                    label: "City Pages",
                  },
                  {
                    value: "hotel",
                    label: "Hotel Pages",
                  },
                  {
                    value: "blog",
                    label: "Blogs",
                  },
                ]}
              />
            </Form.Item>

            <Text type="secondary">
              Select what kind of page you want to create.
            </Text>

            <Row gutter={16} className="mt-4">
              {entityType === "blog" && (
                <Col xs={24} md={24}>
                  <Form.Item
                    name="categoryId"
                    label={
                      <span className="font-bold">Select Blog Category</span>
                    }
                    rules={[
                      {
                        required: true,
                        message: "Please select a blog category",
                      },
                    ]}
                  >
                    <Select
                      size="large"
                      placeholder="Select Blog Category"
                      allowClear
                      options={(masterData || []).map((item) => ({
                        label: item.placeName,
                        value: item._id,
                      }))}
                    />
                  </Form.Item>
                </Col>
              )}

              <Col xs={24} md={12}>
                <Form.Item
                  name="title"
                  label={<span className="font-bold">Page Title</span>}
                  rules={[{ required: true }]}
                >
                  <Input placeholder="Enter page title" size="large" />
                </Form.Item>
              </Col>

              <Col xs={24} md={6}>
                <Form.Item
                  name="slug"
                  label={<span className="font-bold">Slug</span>}
                >
                  <Input
                    size="large"
                    onChange={handleSlugChange}
                    placeholder="Auto generated"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={6}>
                <Form.Item label={<span className="font-bold">Public URL</span>}>
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                    }}
                  >
                    <Input
                      size="large"
                      value={url}
                      disabled
                      placeholder="Auto generated"
                      style={{
                        flex: 1,
                      }}
                    />

                    <Tooltip title="Copy URL">
                      <Button
                        icon={<CopyOutlined />}
                        onClick={handleCopySlug}
                        disabled={!url}
                      />
                    </Tooltip>
                  </div>
                </Form.Item>

                <Form.Item name="url" hidden>
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            {entityType === "hotelCity" && (
              <CMSCitySelector form={form} entityType={entityType} />
            )}

            {entityType === "hotel" && (
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <CMSCitySelector form={form} entityType={entityType} />
                </Col>

                <Col xs={24} md={12}>
                  <CMSHotelSelector form={form} />
                </Col>
              </Row>
            )}

            {entityType === "blog" && (
              <>
                <Form.Item
                  name="description"
                  label={<span className="font-bold">Description</span>}
                  rules={[
                    {
                      required: true,
                      message: "Please enter description",
                    },
                  ]}
                >
                  <Input.TextArea
                    rows={4}
                    placeholder="Enter short description"
                    showCount
                    maxLength={500}
                  />
                </Form.Item>

                <Form.Item
                  name={["blogMeta", "featuredImage"]}
                  label={<span className="font-bold">Featured Image</span>}
                  rules={[
                    {
                      required: true,
                      message: "Please upload featured image",
                    },
                  ]}
                >
                  <ImageUpload />
                </Form.Item>
              </>
            )}

            {showEntityId && (
              <>
                <Form.Item name="entityId" hidden>
                  <Input />
                </Form.Item>

                <Form.Item name="cityMeta" hidden>
                  <Input />
                </Form.Item>
              </>
            )}
          </Card>

          <div
            style={{
              marginTop: 20,
            }}
          >
            <CMSBlocksBuilder form={form} />
          </div>
        </Col>

        {/* RIGHT */}

        <Col xs={24} lg={8}>
          <div
            style={{
              position: "sticky",
              top: 20,
            }}
          >
            <Card
              title="SEO Settings"
              variant={false}
              style={{
                borderRadius: 5,
                background: colorBgContainer,
                boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
              }}
            >
              <CMSSeoFields />

              <Form.Item
                name="isPublished"
                label={<span className="font-bold">Published</span>}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Space
                orientation="vertical"
                style={{
                  width: "100%",
                }}
              >
                <Button
                  block
                  size="large"
                  onClick={handlePreview}
                  disabled={!form.getFieldValue("url")}
                >
                  Preview
                </Button>

                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  size="large"
                  loading={isSubmitting}
                  disabled={!canSubmit}
                >
                  {id ? "Update Page" : "Publish Page"}
                </Button>
              </Space>
            </Card>
          </div>
        </Col>
      </Row>
    </Form>
  );
}
