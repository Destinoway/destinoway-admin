"use client";

import { Button, Card, Collapse, Form, Input, Select, theme } from "antd";
import CMSImageUpload from "./CMSImageUpload";
import TextEditor from "./editor/TextEditor";
// import CKEditorTextEditor from "./editor/CKEditorTextEditor";

const blockOptions = [
  {
    value: "hero",
    label: "Hero",
  },
  {
    value: "content",
    label: "Content",
  },
  {
    value: "faq",
    label: "FAQ",
  },
  {
    value: "cta",
    label: "CTA",
  },
  {
    value: "marketing",
    label: "Marketing",
  },
  {
    value: "imageContent",
    label: "Image Content",
  },
  {
    label: "Links",
    value: "links",
  },
];

function BlockFields({ field, form }) {
  return (
    <Form.Item noStyle shouldUpdate>
      {({ getFieldValue }) => {
        const type = getFieldValue(["data", "blocks", field.name, "type"]);

        return (
          <>
            {type === "hero" && (
              <>
                <Form.Item
                  name={[field.name, "data", "title"]}
                  label={
                    <span className="font-semibold text-gray-700">
                      Hero Title
                    </span>
                  }
                >
                  <Input size="large" placeholder="Enter hero title" />
                </Form.Item>

                <Form.Item
                  name={[field.name, "data", "subtitle"]}
                  label={
                    <span className="font-semibold text-gray-700">
                      Hero Subtitle
                    </span>
                  }
                >
                  <Input.TextArea rows={3} placeholder="Enter hero subtitle" />
                </Form.Item>

                <CMSImageUpload
                  form={form}
                  label="Hero Image"
                  namePath={["data", "blocks", field.name, "data", "image"]}
                />

                {/* Button Fields - 6 / 6 */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Form.Item
                    name={[field.name, "data", "buttonText"]}
                    label={
                      <span className="font-semibold text-gray-700">
                        Button Text
                      </span>
                    }
                    className="mb-0"
                  >
                    <Input size="large" placeholder="Enter button text" />
                  </Form.Item>

                  <Form.Item
                    name={[field.name, "data", "buttonLink"]}
                    label={
                      <span className="font-semibold text-gray-700">
                        Button Link
                      </span>
                    }
                    className="mb-0"
                  >
                    <Input size="large" placeholder="Enter button link" />
                  </Form.Item>
                </div>
              </>
            )}

            {type === "content" && (
              <Form.Item name={[field.name, "data", "content"]} label="Content">
                <TextEditor />
                {/* <CKEditorTextEditor /> */}
              </Form.Item>
            )}

            {type === "faq" && (
              <>
                <Form.Item
                  name={[field.name, "data", "title"]}
                  label="FAQ Section Title"
                >
                  <Input />
                </Form.Item>

                <Form.List name={[field.name, "data", "items"]}>
                  {(faqFields, { add, remove }) => (
                    <>
                      {faqFields.map((faqField) => (
                        <Card
                          key={faqField.key}
                          size="small"
                          style={{
                            marginBottom: 12,
                          }}
                          extra={
                            <Button
                              danger
                              size="small"
                              onClick={() => remove(faqField.name)}
                            >
                              Remove
                            </Button>
                          }
                        >
                          <Form.Item
                            name={[faqField.name, "question"]}
                            label="Question"
                          >
                            <Input />
                          </Form.Item>

                          <Form.Item
                            name={[faqField.name, "answer"]}
                            label="Answer"
                          >
                            <Input.TextArea rows={4} />
                          </Form.Item>
                        </Card>
                      ))}

                      <Button type="dashed" block onClick={() => add()}>
                        + Add FAQ
                      </Button>
                    </>
                  )}
                </Form.List>
              </>
            )}

            {type === "marketing" && (
              <>
                <Form.Item
                  name={[field.name, "data", "heading"]}
                  label="Heading"
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name={[field.name, "data", "subheading"]}
                  label="Sub Heading"
                >
                  <Input.TextArea rows={3} />
                </Form.Item>

                <CMSImageUpload
                  form={form}
                  label="Marketing Image"
                  namePath={["data", "blocks", field.name, "data", "image"]}
                />

                <Form.List name={[field.name, "data", "items"]}>
                  {(itemFields, { add, remove }) => (
                    <>
                      {itemFields.map((itemField) => (
                        <Card
                          key={itemField.key}
                          size="small"
                          style={{
                            marginBottom: 12,
                          }}
                          extra={
                            <Button
                              danger
                              size="small"
                              onClick={() => remove(itemField.name)}
                            >
                              Remove
                            </Button>
                          }
                        >
                          <Form.Item
                            name={[itemField.name, "title"]}
                            label="Item Title"
                          >
                            <Input />
                          </Form.Item>

                          <Form.Item
                            name={[itemField.name, "description"]}
                            label="Description"
                          >
                            <Input.TextArea rows={3} />
                          </Form.Item>
                        </Card>
                      ))}

                      <Button type="dashed" block onClick={() => add()}>
                        + Add Item
                      </Button>
                    </>
                  )}
                </Form.List>
              </>
            )}

            {type === "cta" && (
              <>
                <Form.Item
                  name={[field.name, "data", "title"]}
                  label="CTA Title"
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name={[field.name, "data", "description"]}
                  label="Description"
                >
                  <Input.TextArea rows={3} />
                </Form.Item>

                <CMSImageUpload
                  form={form}
                  label="CTA Background"
                  namePath={[
                    "data",
                    "blocks",
                    field.name,
                    "data",
                    "background",
                  ]}
                />

                <Form.Item
                  name={[field.name, "data", "buttonText"]}
                  label="Button Text"
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name={[field.name, "data", "buttonLink"]}
                  label="Button Link"
                >
                  <Input />
                </Form.Item>
              </>
            )}

            {type === "imageContent" && (
              <>
                {/* Section Title */}
                <Form.Item
                  name={[field.name, "data", "title"]}
                  label={
                    <span className="font-semibold text-gray-700">
                      Section Title
                    </span>
                  }
                >
                  <Input size="large" placeholder="Enter section title" />
                </Form.Item>

                {/* Content */}
                <Form.Item
                  name={[field.name, "data", "content"]}
                  label={
                    <span className="font-semibold text-gray-700">Content</span>
                  }
                >
                  <TextEditor />
                  {/* <CKEditorTextEditor /> */}

                </Form.Item>

                {/* Section Image */}
                <CMSImageUpload
                  form={form}
                  label="Section Image"
                  namePath={["data", "blocks", field.name, "data", "image"]}
                />

                {/* Image Position */}
                <Form.Item
                  name={[field.name, "data", "layout"]}
                  label={
                    <span className="font-semibold text-gray-700">
                      Image Position
                    </span>
                  }
                  initialValue="left"
                >
                  <Select
                    size="large"
                    placeholder="Select image position"
                    options={[
                      {
                        label: "Left Image",
                        value: "left",
                      },
                      {
                        label: "Right Image",
                        value: "right",
                      },
                    ]}
                  />
                </Form.Item>

                {/* Button Fields - 6 / 6 */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {/* Button Text */}
                  <Form.Item
                    name={[field.name, "data", "buttonText"]}
                    label={
                      <span className="font-semibold text-gray-700">
                        Button Text
                      </span>
                    }
                    className="mb-0"
                  >
                    <Input size="large" placeholder="Enter button text" />
                  </Form.Item>

                  {/* Button Link */}
                  <Form.Item
                    name={[field.name, "data", "buttonLink"]}
                    label={
                      <span className="font-semibold text-gray-700">
                        Button Link
                      </span>
                    }
                    className="mb-0"
                  >
                    <Input size="large" placeholder="Enter button link" />
                  </Form.Item>
                </div>
              </>
            )}

            {type === "links" && (
              <Form.List name={[field.name, "data", "groups"]}>
                {(groupFields, { add: addGroup, remove: removeGroup }) => (
                  <div className="space-y-5">
                    {/* =========================
            LINK GROUPS
        ========================== */}
                    {groupFields.map((groupField, groupIndex) => (
                      <Card
                        key={groupField.key}
                        size="small"
                        className="rounded-lg border border-gray-200"
                        title={
                          <span className="font-semibold text-gray-700">
                            Link Group {groupIndex + 1}
                          </span>
                        }
                        extra={
                          <Button
                            danger
                            size="small"
                            onClick={() => removeGroup(groupField.name)}
                          >
                            Remove Group
                          </Button>
                        }
                      >
                        {/* =========================
                GROUP TITLE
            ========================== */}
                        <Form.Item
                          name={[groupField.name, "title"]}
                          label={
                            <span className="font-semibold text-gray-700">
                              Group Title
                            </span>
                          }
                        >
                          <Input size="large" placeholder="Enter group title" />
                        </Form.Item>

                        {/* =========================
                LINKS
            ========================== */}
                        <Form.List name={[groupField.name, "links"]}>
                          {(
                            linkFields,
                            { add: addLink, remove: removeLink },
                          ) => (
                            <div className="space-y-4">
                              {/* Existing Links */}
                              {linkFields.map((linkField, linkIndex) => (
                                <Card
                                  key={linkField.key}
                                  size="small"
                                  className="rounded-md border border-gray-200 bg-gray-50"
                                  title={
                                    <span className="text-sm font-semibold text-gray-600">
                                      Link {linkIndex + 1}
                                    </span>
                                  }
                                  extra={
                                    <Button
                                      danger
                                      size="small"
                                      onClick={() => removeLink(linkField.name)}
                                    >
                                      Remove
                                    </Button>
                                  }
                                >
                                  {/* =========================
                          LABEL + URL : 6 / 6
                      ========================== */}
                                  <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
                                    {/* Link Label */}
                                    <Form.Item
                                      name={[linkField.name, "label"]}
                                      label={
                                        <span className="font-semibold text-gray-700">
                                          Label
                                        </span>
                                      }
                                      className="!mb-0"
                                    >
                                      <Input
                                        size="large"
                                        placeholder="Enter link label"
                                      />
                                    </Form.Item>

                                    {/* Link URL */}
                                    <Form.Item
                                      name={[linkField.name, "url"]}
                                      label={
                                        <span className="font-semibold text-gray-700">
                                          URL
                                        </span>
                                      }
                                      className="!mb-0"
                                    >
                                      <Input
                                        size="large"
                                        placeholder="https://example.com"
                                      />
                                    </Form.Item>
                                  </div>
                                </Card>
                              ))}

                              {/* =========================
                      ADD LINK
                  ========================== */}
                              <Button
                                type="dashed"
                                block
                                size="large"
                                onClick={() => addLink()}
                              >
                                + Add Link
                              </Button>
                            </div>
                          )}
                        </Form.List>
                      </Card>
                    ))}

                    {/* =========================
            ADD GROUP
        ========================== */}
                    <Button
                      type="dashed"
                      block
                      size="large"
                      onClick={() => addGroup()}
                    >
                      + Add Group
                    </Button>
                  </div>
                )}
              </Form.List>
            )}
          </>
        );
      }}
    </Form.Item>
  );
}

export default function CMSBlocksBuilder({ form }) {
  const {
    token: {
      colorBgContainer,
      colorBorderSecondary,
      colorText,
      colorPrimary,
      colorFillAlter,
    },
  } = theme.useToken();
  return (
    <Form.List name={["data", "blocks"]}>
      {(fields, { add, remove, move }) => (
        <>
          <Collapse
            accordion
            defaultActiveKey={fields.length ? [String(fields[0].key)] : []}
            ghost
            style={{
              marginBottom: 16,
            }}
            items={fields.map((field) => {
              const type =
                form.getFieldValue(["data", "blocks", field.name, "type"]) ||
                "block";

              const icons = {
                hero: "🖼️",
                content: "📝",
                faq: "❓",
                cta: "🚀",
                marketing: "⭐",
                imageContent: "📷",
                links: "🔗",
              };

              return {
                key: String(field.key),

                styles: {
                  header: {
                    background: colorBgContainer,
                    border: `1px solid ${colorBorderSecondary}`,
                    borderRadius: 5,
                    marginBottom: 10,
                  },

                  body: {
                    borderTop: "none",
                    borderRadius: "0 0 5px 5px",
                    background: colorFillAlter,
                    border: `1px solid ${colorBorderSecondary}`,
                    padding: 20,
                  },
                },

                label: (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      <div
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: "50%",
                          background: colorPrimary,
                          color: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                          fontSize: 14,
                        }}
                      >
                        {field.name + 1}
                      </div>

                      <div>
                        <div
                          style={{
                            fontWeight: 600,
                            color: colorText,
                          }}
                        >
                          {icons[type]}{" "}
                          {(
                            form.getFieldValue([
                              "data",
                              "blocks",
                              field.name,
                              "type",
                            ]) || "Block"
                          )
                            .replace(/([A-Z])/g, " $1")
                            .trim()}
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        size="small"
                        disabled={field.name === 0}
                        onClick={() => move(field.name, field.name - 1)}
                      >
                        ↑
                      </Button>

                      <Button
                        size="small"
                        disabled={field.name === fields.length - 1}
                        onClick={() => move(field.name, field.name + 1)}
                      >
                        ↓
                      </Button>

                      <Button
                        danger
                        size="small"
                        onClick={() => remove(field.name)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ),

                children: (
                  <div>
                    <Form.Item
                      name={[field.name, "type"]}
                      label="Block Type"
                      rules={[{ required: true }]}
                    >
                      <Select options={blockOptions} />
                    </Form.Item>

                    <BlockFields field={field} form={form} />
                  </div>
                ),
              };
            })}
          />

          <Button
            type="primary"
            ghost
            block
            size="large"
            style={{
              marginTop: 20,
              height: 46,
              borderStyle: "dashed",
            }}
            onClick={() =>
              add({
                type: "content",
                data: {},
              })
            }
          >
            + Add New Content Block
          </Button>
        </>
      )}
    </Form.List>
  );
}
