"use client";

import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { App, Form, Image, Upload } from "antd";
import { useState } from "react";
import { uploadMediaApi } from "../api/cms.service";

export default function CMSImageUpload({ form, namePath, label = "Image" }) {
  const { message } = App.useApp();
  const [uploading, setUploading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const image = form.getFieldValue(namePath);
  const fileList = image
    ? [
        {
          uid: "-1",
          name: "image",
          status: "done",
          url: encodeURI(image),
        },
      ]
    : [];

  const handleUpload = async (options) => {
    const { file, onSuccess, onError } = options;
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "cms");
      const res = await uploadMediaApi(formData);
      const url = res?.data?.url || res?.url;
      if (!url) {
        throw new Error("Upload failed");
      }

      const values = form.getFieldsValue(true);
      const blockIndex = namePath[2];
      const fieldKey = namePath[4];
      const blocks = values?.data?.blocks || [];
      const updatedBlocks = blocks.map((block, idx) =>
        idx === blockIndex
          ? {
              ...block,
              data: {
                ...block.data,
                [fieldKey]: url,
              },
            }
          : block,
      );

      form.setFieldsValue({
        ...values,
        data: {
          ...values.data,
          blocks: updatedBlocks,
        },
      });
      message.success("Image uploaded");
      onSuccess("ok");
    } catch (err) {
      console.log(err);
      message.error("Upload failed");
      onError(err);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    const values = form.getFieldsValue(true);
    const blockIndex = namePath[2];
    const fieldKey = namePath[4];
    const blocks = values?.data?.blocks || [];
    const updatedBlocks = blocks.map((block, idx) =>
      idx === blockIndex
        ? {
            ...block,
            data: {
              ...block.data,
              [fieldKey]: null,
            },
          }
        : block,
    );

    form.setFieldsValue({
      ...values,
      data: {
        ...values.data,
        blocks: updatedBlocks,
      },
    });
    message.success("Image removed");
    return true;
  };

  return (
    <Form.Item noStyle shouldUpdate>
      {() => {
        const image = form.getFieldValue(namePath);
        const fileList = image
          ? [
              {
                uid: "-1",
                name: "image",
                status: "done",
                url: encodeURI(image),
              },
            ]
          : [];

        return (
          <Form.Item label={label}>
            <Upload
              listType="picture-card"
              customRequest={handleUpload}
              fileList={fileList}
              maxCount={1}
              onRemove={handleRemove}
              accept="image/*"
              showUploadList={{
                showPreviewIcon: true,
                showRemoveIcon: true,
              }}
              onPreview={() => setPreviewOpen(true)}
            >
              {!image && (
                <div>
                  {uploading ? <LoadingOutlined /> : <PlusOutlined />}

                  <div
                    style={{
                      marginTop: 8,
                    }}
                  >
                    {uploading ? "Uploading" : "Upload"}
                  </div>
                </div>
              )}
            </Upload>

            {image && (
              <Image
                styles={{
                  root: {
                    display: "none",
                  },
                }}
                preview={{
                  open: previewOpen,
                  src: encodeURI(image),
                  onOpenChange: (open) => setPreviewOpen(open),
                }}
              />
            )}
          </Form.Item>
        );
      }}
    </Form.Item>
  );
}
