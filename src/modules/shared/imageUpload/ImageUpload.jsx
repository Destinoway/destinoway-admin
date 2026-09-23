"use client";

import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Upload, message } from "antd";
import { useEffect, useState } from "react";
import { useMediaUpload } from "./hooks/useMediaUpload";

export default function ImageUpload({
  value,
  onChange,

  folder = "common",

  multiple = false,

  accept = "image/*",

  maxSize = 2,
}) {
  const { uploadMedia } = useMediaUpload();

  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (!value) {
      setFileList([]);
      return;
    }

    if (multiple && Array.isArray(value)) {
      setFileList(
        value.map((url, index) => ({
          uid: `${index}`,
          name: `Image ${index + 1}`,
          status: "done",
          url,
        })),
      );
      return;
    }

    if (typeof value === "string" && value.trim()) {
      setFileList([
        {
          uid: "-1",
          name: "image",
          status: "done",
          url: value,
        },
      ]);
    } else {
      setFileList([]);
    }
  }, [value, multiple]);

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");

    if (!isImage) {
      message.error("Only image files are allowed.");
      return Upload.LIST_IGNORE;
    }

    const isValidSize = file.size / 1024 / 1024 < maxSize;

    if (!isValidSize) {
      message.error(`Image must be smaller than ${maxSize} MB.`);
      return Upload.LIST_IGNORE;
    }

    return true;
  };

  const customRequest = async ({ file, onSuccess, onError }) => {
    try {
      const formData = new FormData();

      formData.append("file", file);
      formData.append("folder", folder);

      const res = await uploadMedia.mutateAsync(formData);

      const url = res?.data?.url || res?.data?.secure_url || res?.url;

      if (!url) {
        throw new Error("Image url not found");
      }

      if (multiple) {
        const urls = [...(value || []), url];

        onChange?.(urls);
      } else {
        onChange?.(url);
      }

      onSuccess("ok");
    } catch (error) {
      console.error(error);

      message.error("Upload failed");

      onError(error);
    }
  };

  const handleRemove = (file) => {
    if (multiple) {
      const urls = (value || []).filter((item) => item !== file.url);

      onChange?.(urls);
    } else {
      onChange?.(null);
    }
  };

  return (
    <Upload
      listType="picture-card"
      accept={accept}
      fileList={fileList}
      beforeUpload={beforeUpload}
      customRequest={customRequest}
      onRemove={handleRemove}
      multiple={multiple}
      maxCount={multiple ? undefined : 1}
    >
      {(multiple || fileList.length === 0) && (
        <div>
          {uploadMedia.isPending ? <LoadingOutlined /> : <PlusOutlined />}

          <div
            style={{
              marginTop: 8,
            }}
          >
            Upload
          </div>
        </div>
      )}
    </Upload>
  );
}
