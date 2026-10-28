"use client";

import {
  AlignCenterOutlined,
  AlignLeftOutlined,
  AlignRightOutlined,
  BoldOutlined,
  ClearOutlined,
  CodeOutlined,
  FontColorsOutlined,
  FullscreenOutlined,
  HighlightOutlined,
  InboxOutlined,
  ItalicOutlined,
  LinkOutlined,
  MinusOutlined,
  OrderedListOutlined,
  PictureOutlined,
  RedoOutlined,
  StrikethroughOutlined,
  TableOutlined,
  UnderlineOutlined,
  UndoOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";

import {
  App,
  Button,
  Divider,
  Dropdown,
  Input,
  Modal,
  Select,
  Space,
  Tabs,
  Tooltip,
  Upload,
} from "antd";
import { useState } from "react";
import { uploadMediaApi } from "../../api/cms.service";

const { Dragger } = Upload;

export default function TiptapToolbar({
  editor,
  htmlMode = false,
  onToggleHtml,
  onFullscreen,
}) {
  const { message } = App.useApp();
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imageSource, setImageSource] = useState("upload");
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageTarget, setImageTarget] = useState(null);

  if (!editor) {
    return null;
  }

  const getHeading = () => {
    for (let level = 1; level <= 6; level++) {
      if (
        editor.isActive("heading", {
          level,
        })
      ) {
        return `h${level}`;
      }
    }

    return "p";
  };

  const setHeading = (value) => {
    if (value === "p") {
      editor.chain().focus().setParagraph().run();

      return;
    }

    editor
      .chain()
      .focus()
      .toggleHeading({
        level: Number(value.replace("h", "")),
      })
      .run();
  };

  const fontFamilies = [
    "Arial",
    "Helvetica",
    "Georgia",
    "Times New Roman",
    "Verdana",
    "Tahoma",
    "Courier New",
  ].map((font) => ({
    value: font,
    label: font,
  }));

  const fontSizes = [
    "10px",
    "11px",
    "12px",
    "13px",
    "14px",
    "16px",
    "18px",
    "20px",
    "24px",
    "28px",
    "32px",
    "36px",
    "48px",
  ].map((size) => ({
    value: size,
    label: size,
  }));

  const colors = [
    "#000000",
    "#ffffff",
    "#ff4d4f",
    "#fa8c16",
    "#fadb14",
    "#52c41a",
    "#13c2c2",
    "#1677ff",
    "#722ed1",
    "#eb2f96",
    "#8c8c8c",
  ];

  const colorItems = colors.map((color) => ({
    key: color,

    label: (
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: 4,

          backgroundColor: color,

          border: color === "#ffffff" ? "1px solid #999" : "none",
        }}
      />
    ),

    onClick: () => editor.chain().focus().setColor(color).run(),
  }));

  colorItems.push({
    key: "remove-color",

    label: "Remove Color",

    onClick: () => editor.chain().focus().unsetColor().run(),
  });

  const highlightColors = [
    "#fff566",
    "#ffd591",
    "#b7eb8f",
    "#87e8de",
    "#91d5ff",
    "#adc6ff",
    "#d3adf7",
    "#ffadd2",
  ];

  const highlightItems = highlightColors.map((color) => ({
    key: color,

    label: (
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: 4,

          backgroundColor: color,
        }}
      />
    ),

    onClick: () =>
      editor
        .chain()
        .focus()
        .toggleHighlight({
          color,
        })
        .run(),
  }));

  highlightItems.push({
    key: "remove-highlight",

    label: "Remove Highlight",

    onClick: () => editor.chain().focus().unsetHighlight().run(),
  });

  const tableItems = [
    {
      key: "3x3",

      label: "Insert 3 × 3 Table",
    },

    {
      key: "4x4",

      label: "Insert 4 × 4 Table",
    },

    {
      key: "5x5",

      label: "Insert 5 × 5 Table",
    },

    {
      type: "divider",
    },

    {
      key: "add-row-before",

      label: "Add Row Before",
    },

    {
      key: "add-row-after",

      label: "Add Row After",
    },

    {
      key: "delete-row",

      label: "Delete Row",

      danger: true,
    },

    {
      type: "divider",
    },

    {
      key: "add-column-before",

      label: "Add Column Before",
    },

    {
      key: "add-column-after",

      label: "Add Column After",
    },

    {
      key: "delete-column",

      label: "Delete Column",

      danger: true,
    },

    {
      type: "divider",
    },

    {
      key: "merge",

      label: "Merge Cells",
    },

    {
      key: "split",

      label: "Split Cell",
    },

    {
      key: "header",

      label: "Toggle Header Row",
    },

    {
      type: "divider",
    },

    {
      key: "delete-table",

      label: "Delete Table",

      danger: true,
    },
  ];

  const tableMenu = {
    items: tableItems,

    onClick: ({ key }) => {
      const chain = editor.chain().focus();

      switch (key) {
        case "3x3":
          chain
            .insertTable({
              rows: 3,
              cols: 3,
              withHeaderRow: true,
            })
            .run();

          break;

        case "4x4":
          chain
            .insertTable({
              rows: 4,
              cols: 4,
              withHeaderRow: true,
            })
            .run();

          break;

        case "5x5":
          chain
            .insertTable({
              rows: 5,
              cols: 5,
              withHeaderRow: true,
            })
            .run();

          break;

        case "add-row-before":
          chain.addRowBefore().run();

          break;

        case "add-row-after":
          chain.addRowAfter().run();

          break;

        case "delete-row":
          chain.deleteRow().run();

          break;

        case "add-column-before":
          chain.addColumnBefore().run();

          break;

        case "add-column-after":
          chain.addColumnAfter().run();

          break;

        case "delete-column":
          chain.deleteColumn().run();

          break;

        case "merge":
          chain.mergeCells().run();

          break;

        case "split":
          chain.splitCell().run();

          break;

        case "header":
          chain.toggleHeaderRow().run();

          break;

        case "delete-table":
          chain.deleteTable().run();

          break;

        default:
          break;
      }
    },
  };

  const addLink = () => {
    const current = editor.getAttributes("link")?.href || "";

    const url = window.prompt(
      "Enter URL (use /path for an internal link)",
      current || "/",
    );

    if (url === null) {
      return;
    }

    if (!url.trim()) {
      editor.chain().focus().unsetLink().run();

      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({
        href: url.trim(),

        target: "_blank",

        rel: "noopener noreferrer",
      })
      .run();
  };

  const addImage = () => {
    const currentImage = editor.isActive("image");
    const currentAttributes = editor.getAttributes("image");
    const position = editor.state.selection.from;
    setImageTarget({
      from: position,
      to: currentImage ? position + 1 : position,
      width: currentAttributes.width || null,
      height: currentAttributes.height || null,
      rotation: currentAttributes.rotation || 0,
      layout: currentAttributes.layout || "center",
    });
    setImageUrl(currentAttributes.src || "");
    setImageAlt(currentAttributes.alt || "");
    setImageFile(null);
    setImageSource("upload");
    setImageModalOpen(true);
  };

  const insertImage = (src) => {
    if (!src || !imageTarget) return;
    editor
      .chain()
      .focus()
      .insertContentAt(
        { from: imageTarget.from, to: imageTarget.to },
        {
          type: "image",
          attrs: {
            src,
            alt: imageAlt.trim(),
            width: imageTarget.width,
            height: imageTarget.height,
            rotation: imageTarget.rotation,
            layout: imageTarget.layout,
          },
        },
      )
      .run();
    editor.commands.setNodeSelection(imageTarget.from);
    setImageModalOpen(false);
  };

  const saveImage = async () => {
    if (imageSource === "url") {
      if (!imageUrl.trim()) {
        message.error("Please enter an image URL.");
        return;
      }
      insertImage(imageUrl.trim());
      return;
    }

    if (!imageFile) {
      message.error("Select or drop an image to upload.");
      return;
    }

    setImageUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("folder", "cms");
      const response = await uploadMediaApi(formData);
      const uploadedUrl = response?.data?.url || response?.url;
      if (!uploadedUrl)
        throw new Error("Image URL not found in upload response");
      insertImage(uploadedUrl);
      message.success("Image uploaded");
    } catch (error) {
      console.error("Image upload failed:", error);
      message.error("Image upload failed");
    } finally {
      setImageUploading(false);
    }
  };

  return (
    <Space
      wrap
      size={[6, 6]}
      style={{
        width: "100%",
      }}
    >
      <Tooltip title="Paragraph / Heading">
        <Select
          value={getHeading()}
          onChange={setHeading}
          style={{
            width: 135,
          }}
          options={[
            {
              value: "p",
              label: "Paragraph",
            },

            {
              value: "h1",
              label: "Heading 1",
            },

            {
              value: "h2",
              label: "Heading 2",
            },

            {
              value: "h3",
              label: "Heading 3",
            },

            {
              value: "h4",
              label: "Heading 4",
            },

            {
              value: "h5",
              label: "Heading 5",
            },

            {
              value: "h6",
              label: "Heading 6",
            },
          ]}
        />
      </Tooltip>

      <Divider orientation="vertical" />

      <Tooltip title="Font Family">
        <Select
          placeholder="Font"
          style={{
            width: 125,
          }}
          options={fontFamilies}
          onChange={(font) => editor.chain().focus().setFontFamily(font).run()}
        />
      </Tooltip>

      <Tooltip title="Font Size">
        <Select
          placeholder="Size"
          style={{
            width: 75,
          }}
          options={fontSizes}
          onChange={(size) => editor.chain().focus().setFontSize(size).run()}
        />
      </Tooltip>

      <Divider orientation="vertical" />

      <Tooltip title="Bold">
        <Button
          type={editor.isActive("bold") ? "primary" : "default"}
          icon={<BoldOutlined />}
          onClick={() => editor.chain().focus().toggleBold().run()}
        />
      </Tooltip>

      <Tooltip title="Italic">
        <Button
          type={editor.isActive("italic") ? "primary" : "default"}
          icon={<ItalicOutlined />}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        />
      </Tooltip>

      <Tooltip title="Underline">
        <Button
          type={editor.isActive("underline") ? "primary" : "default"}
          icon={<UnderlineOutlined />}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        />
      </Tooltip>

      <Tooltip title="Strikethrough">
        <Button
          type={editor.isActive("strike") ? "primary" : "default"}
          icon={<StrikethroughOutlined />}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        />
      </Tooltip>

      <Tooltip title="Superscript">
        <Button
          type={editor.isActive("superscript") ? "primary" : "default"}
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
        >
          X<sup>2</sup>
        </Button>
      </Tooltip>

      <Tooltip title="Subscript">
        <Button
          type={editor.isActive("subscript") ? "primary" : "default"}
          onClick={() => editor.chain().focus().toggleSubscript().run()}
        >
          X<sub>2</sub>
        </Button>
      </Tooltip>

      <Divider orientation="vertical" />

      {/* ================================================
          COLOR
      ================================================ */}

      <Tooltip title="Text Color">
        <Dropdown
          menu={{
            items: colorItems,
          }}
          trigger={["click"]}
        >
          <Button icon={<FontColorsOutlined />} />
        </Dropdown>
      </Tooltip>

      {/* HIGHLIGHT */}

      <Tooltip title="Highlight">
        <Dropdown
          menu={{
            items: highlightItems,
          }}
          trigger={["click"]}
        >
          <Button icon={<HighlightOutlined />} />
        </Dropdown>
      </Tooltip>

      <Divider orientation="vertical" />

      {/* ================================================
          LISTS
      ================================================ */}

      <Tooltip title="Bullet List">
        <Button
          type={editor.isActive("bulletList") ? "primary" : "default"}
          icon={<UnorderedListOutlined />}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        />
      </Tooltip>

      <Tooltip title="Numbered List">
        <Button
          type={editor.isActive("orderedList") ? "primary" : "default"}
          icon={<OrderedListOutlined />}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        />
      </Tooltip>

      <Divider orientation="vertical" />

      {/* ================================================
          ALIGNMENT
      ================================================ */}

      <Tooltip title="Align Left">
        <Button
          type={
            editor.isActive({
              textAlign: "left",
            })
              ? "primary"
              : "default"
          }
          icon={<AlignLeftOutlined />}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        />
      </Tooltip>

      <Tooltip title="Align Center">
        <Button
          type={
            editor.isActive({
              textAlign: "center",
            })
              ? "primary"
              : "default"
          }
          icon={<AlignCenterOutlined />}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        />
      </Tooltip>

      <Tooltip title="Align Right">
        <Button
          type={
            editor.isActive({
              textAlign: "right",
            })
              ? "primary"
              : "default"
          }
          icon={<AlignRightOutlined />}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        />
      </Tooltip>

      <Tooltip title="Justify">
        <Button
          type={
            editor.isActive({
              textAlign: "justify",
            })
              ? "primary"
              : "default"
          }
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        >
          ≡
        </Button>
      </Tooltip>

      <Divider orientation="vertical" />

      {/* ================================================
          BLOCK
      ================================================ */}

      <Tooltip title="Blockquote">
        <Button
          type={editor.isActive("blockquote") ? "primary" : "default"}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          &quot;
        </Button>
      </Tooltip>

      <Tooltip title="Inline Code">
        <Button
          type={editor.isActive("code") ? "primary" : "default"}
          icon={<CodeOutlined />}
          onClick={() => editor.chain().focus().toggleCode().run()}
        />
      </Tooltip>

      <Tooltip title="Code Block">
        <Button onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
          {"</>"}
        </Button>
      </Tooltip>

      <Tooltip title="Horizontal Rule">
        <Button
          icon={<MinusOutlined />}
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        />
      </Tooltip>

      <Divider orientation="vertical" />

      {/* ================================================
          LINK
      ================================================ */}

      <Tooltip title="Link">
        <Button
          type={editor.isActive("link") ? "primary" : "default"}
          icon={<LinkOutlined />}
          onClick={addLink}
        />
      </Tooltip>

      {/* IMAGE */}

      <Tooltip title="Upload an image or insert it from a URL">
        <Button icon={<PictureOutlined />} onClick={addImage} />
      </Tooltip>

      <Modal
        title="Insert image"
        open={imageModalOpen}
        onCancel={() => setImageModalOpen(false)}
        onOk={saveImage}
        okText={imageSource === "upload" ? "Upload and insert" : "Insert image"}
        confirmLoading={imageUploading}
        destroyOnHidden
      >
        <Tabs
          activeKey={imageSource}
          onChange={setImageSource}
          items={[
            {
              key: "upload",
              label: "Upload image",
              children: (
                <Dragger
                  accept="image/*"
                  maxCount={1}
                  multiple={false}
                  beforeUpload={(file) => {
                    if (!file.type.startsWith("image/")) {
                      message.error("Only image files are allowed.");
                      return Upload.LIST_IGNORE;
                    }
                    setImageFile(file);
                    return false;
                  }}
                  onRemove={() => setImageFile(null)}
                  fileList={imageFile ? [imageFile] : []}
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">Click or drag an image here</p>
                  <p className="ant-upload-hint">
                    The image will be uploaded to the CMS media storage.
                  </p>
                </Dragger>
              ),
            },
            {
              key: "url",
              label: "Image URL",
              children: (
                <Input
                  value={imageUrl}
                  onChange={(event) => setImageUrl(event.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              ),
            },
          ]}
        />
        <Input
          value={imageAlt}
          onChange={(event) => setImageAlt(event.target.value)}
          placeholder="Alt text (optional)"
          aria-label="Image alt text"
          style={{ marginTop: 12 }}
        />
      </Modal>

      {/* TABLE */}

      <Tooltip title="Table">
        <Dropdown menu={tableMenu} trigger={["click"]}>
          <Button
            type={editor.isActive("table") ? "primary" : "default"}
            icon={<TableOutlined />}
          />
        </Dropdown>
      </Tooltip>

      <Divider orientation="vertical" />

      {/* ================================================
          CLEAR
      ================================================ */}

      <Tooltip title="Clear Formatting">
        <Button
          icon={<ClearOutlined />}
          onClick={() =>
            editor.chain().focus().unsetAllMarks().clearNodes().run()
          }
        />
      </Tooltip>

      {/* ================================================
          UNDO
      ================================================ */}

      <Tooltip title="Undo">
        <Button
          disabled={!editor.can().undo()}
          icon={<UndoOutlined />}
          onClick={() => editor.chain().focus().undo().run()}
        />
      </Tooltip>

      {/* REDO */}

      <Tooltip title="Redo">
        <Button
          disabled={!editor.can().redo()}
          icon={<RedoOutlined />}
          onClick={() => editor.chain().focus().redo().run()}
        />
      </Tooltip>

      <Divider orientation="vertical" />

      {/* ================================================
          HTML SOURCE
      ================================================ */}

      <Tooltip title={htmlMode ? "Visual Editor" : "HTML Source"}>
        <Button type={htmlMode ? "primary" : "default"} onClick={onToggleHtml}>
          {"</>"}
        </Button>
      </Tooltip>

      {/* ================================================
          FULLSCREEN
      ================================================ */}

      <Tooltip title="Fullscreen">
        <Button icon={<FullscreenOutlined />} onClick={onFullscreen} />
      </Tooltip>
    </Space>
  );
}
