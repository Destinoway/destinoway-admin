"use client";

import Color from "@tiptap/extension-color";
import { mergeAttributes } from "@tiptap/core";
import Highlight from "@tiptap/extension-highlight";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import { Button, Modal, Space, Tooltip, theme } from "antd";
import { RotateRightOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

import {
  BackgroundColor,
  FontFamily,
  FontSize,
  LineHeight,
  TextStyle,
} from "@tiptap/extension-text-style";

import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";

import {
  Table,
  TableCell,
  TableHeader,
  TableRow,
} from "@tiptap/extension-table";

import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import HtmlSourceEditor from "./HtmlSourceEditor";
import TiptapToolbar from "./TiptapToolbar";

const CmsImage = Image.extend({
  addAttributes() {
    const parentAttributes = this.parent?.() || {};

    return {
      ...parentAttributes,
      width: {
        ...parentAttributes.width,
        parseHTML: (element) =>
          Number.parseFloat(element.style.width) ||
          Number.parseFloat(element.getAttribute("width")) ||
          null,
        renderHTML: ({ width }) =>
          width ? { width, style: `width: ${width}px` } : {},
      },
      height: {
        ...parentAttributes.height,
        parseHTML: (element) =>
          Number.parseFloat(element.style.height) ||
          Number.parseFloat(element.getAttribute("height")) ||
          null,
        renderHTML: ({ height }) =>
          height ? { height, style: `height: ${height}px` } : {},
      },
      rotation: {
        default: 0,
        parseHTML: (element) => {
          const match = element.style.transform.match(/rotate\((-?\d+(?:\.\d+)?)deg\)/);
          return match ? Number(match[1]) : 0;
        },
        renderHTML: ({ rotation }) =>
          rotation ? { style: `transform: rotate(${rotation}deg)` } : {},
      },
      layout: {
        default: "center",
        parseHTML: (element) => {
          const layout = element.getAttribute("data-image-layout");
          if (["left", "center", "right"].includes(layout)) return layout;
          if (["left", "right"].includes(element.style.float)) return element.style.float;
          return "center";
        },
        renderHTML: ({ layout }) => {
          if (layout === "left") {
            return {
              "data-image-layout": layout,
              style: "display: block; float: left; margin: 0 16px 12px 0",
            };
          }
          if (layout === "right") {
            return {
              "data-image-layout": layout,
              style: "display: block; float: right; margin: 0 0 12px 16px",
            };
          }
          return {
            "data-image-layout": "center",
            style: "display: block; float: none; margin: 10px auto",
          };
        },
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    return ["img", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
  },

  addNodeView() {
    const createNodeView = this.parent?.();

    return (props) => {
      const nodeView = createNodeView?.(props);
      if (!nodeView) return nodeView;

      const dom = nodeView.dom;
      const syncImageStyles = (node) => {
        const layout = node.attrs.layout || "center";
        const image = dom.querySelector("img");

        dom.dataset.imageLayout = layout;
        dom.style.width = "max-content";
        dom.style.maxWidth = "100%";
        dom.style.float = layout === "left" || layout === "right" ? layout : "none";
        dom.style.margin =
          layout === "left"
            ? "0 16px 12px 0"
            : layout === "right"
              ? "0 0 12px 16px"
              : "10px auto";

        if (image) {
          image.dataset.imageLayout = layout;
          image.style.float = "none";
          image.style.transform = node.attrs.rotation
            ? `rotate(${node.attrs.rotation}deg)`
            : "";
        }
      };

      syncImageStyles(props.node);

      return {
        dom,
        contentDOM: nodeView.contentDOM,
        update(node, decorations, innerDecorations) {
          const updated = nodeView.update?.(node, decorations, innerDecorations);
          if (updated) syncImageStyles(node);
          return updated;
        },
        destroy() {
          nodeView.destroy?.();
        },
      };
    };
  },
});

export default function TextEditor({ value = "", onChange }) {
  const [fullscreen, setFullscreen] = useState(false);
  const [htmlMode, setHtmlMode] = useState(false);
  const [htmlSource, setHtmlSource] = useState("");

  const { token } = theme.useToken();

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,

      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
      }),

      Placeholder.configure({
        placeholder: "Start writing content...",
      }),

      TextStyle,
      Color,
      BackgroundColor,
      FontFamily,
      FontSize,
      LineHeight,

      Highlight.configure({
        multicolor: true,
      }),

      Underline,
      Subscript,
      Superscript,

      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),

      HorizontalRule,

      CmsImage.configure({
        inline: false,
        allowBase64: false,
        resize: {
          enabled: true,
          directions: ["top-left", "top-right", "bottom-left", "bottom-right"],
          minWidth: 80,
          minHeight: 60,
          alwaysPreserveAspectRatio: true,
        },
      }),

      Table.configure({
        resizable: true,
        lastColumnResizable: true,
        allowTableNodeSelection: true,
        cellMinWidth: 80,
      }),

      TableRow,
      TableHeader,
      TableCell,
    ],

    content: value || "",

    onUpdate({ editor }) {
      if (htmlMode) {
        return;
      }

      onChange?.(editor.getHTML());
    },
  });

  const selectedImage = useEditorState({
    editor,
    selector: ({ editor: currentEditor }) =>
      currentEditor?.isActive("image")
        ? currentEditor.getAttributes("image")
        : null,
  });

  const startImageRotation = (event) => {
    event.preventDefault();
    if (event.button !== 0) return;
    const nodeDOM = editor.view.nodeDOM(editor.state.selection.from);
    const image = nodeDOM?.matches?.("img") ? nodeDOM : nodeDOM?.querySelector?.("img");
    if (!image) return;

    const bounds = image.getBoundingClientRect();
    const centerX = bounds.left + bounds.width / 2;
    const centerY = bounds.top + bounds.height / 2;
    const pointerAngle = (pointerEvent) =>
      Math.atan2(pointerEvent.clientY - centerY, pointerEvent.clientX - centerX) *
      (180 / Math.PI);
    const startAngle = pointerAngle(event);
    const originalRotation = Number(selectedImage?.rotation || 0);

    const handleMove = (pointerEvent) => {
      const delta = pointerAngle(pointerEvent) - startAngle;
      const normalizedDelta = ((delta + 540) % 360) - 180;
      const rotation =
        (Math.round(originalRotation + normalizedDelta) % 360 + 360) % 360;
      editor.commands.updateAttributes("image", { rotation });
    };
    const handleEnd = () => {
      document.removeEventListener("pointermove", handleMove);
      document.removeEventListener("pointerup", handleEnd);
      document.removeEventListener("pointercancel", handleEnd);
    };

    document.addEventListener("pointermove", handleMove);
    document.addEventListener("pointerup", handleEnd);
    document.addEventListener("pointercancel", handleEnd);
  };

  useEffect(() => {
    if (!editor) {
      return;
    }

    if (htmlMode) {
      return;
    }

    const incoming = value || "";

    const current = editor.getHTML();

    if (incoming === current) {
      return;
    }

    if (editor.isFocused) {
      return;
    }

    editor.commands.setContent(incoming, false);
  }, [value, editor, htmlMode]);

  const openHtmlMode = () => {
    if (!editor) {
      return;
    }

    const currentHTML = editor.getHTML();

    setHtmlSource(currentHTML);

    setHtmlMode(true);
  };

  const closeHtmlMode = () => {
    if (!editor) {
      return;
    }

    try {
      editor.commands.setContent(htmlSource, false);

      const finalHTML = editor.getHTML();

      onChange?.(finalHTML);

      setHtmlMode(false);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          editor.chain().focus("end").run();
        });
      });
    } catch (error) {
      console.error("HTML parsing failed:", error);
    }
  };

  const toggleHtmlMode = () => {
    if (htmlMode) {
      closeHtmlMode();
    } else {
      openHtmlMode();
    }
  };

  const editorTheme = {
    "--editor-bg": token.colorBgContainer,
    "--editor-text": token.colorText,
    "--editor-border": token.colorBorder,
    "--editor-toolbar-bg": token.colorFillAlter,
    "--editor-toolbar-border": token.colorBorderSecondary,
    "--editor-muted": token.colorTextSecondary,
    "--editor-link": token.colorLink,
    "--editor-code-bg": token.colorFillQuaternary,
    "--editor-selection": token.colorPrimaryBg,
    "--editor-primary": token.colorPrimary,
  };

  const isDark =
    token.colorBgContainer === "#141414" ||
    token.colorBgContainer?.includes("rgb(20");

  const renderToolbar = (fullscreenMode = false) => {
    return (
      <div className="tiptap-editor-toolbar">
        <TiptapToolbar
          editor={editor}
          htmlMode={htmlMode}
          onToggleHtml={toggleHtmlMode}
          onFullscreen={() => setFullscreen(!fullscreenMode)}
        />
      </div>
    );
  };

  const renderVisualEditor = (fullscreenMode = false) => {
    return (
      <div
        className={
          fullscreenMode
            ? "tiptap-editor-content tiptap-editor-content-fullscreen"
            : "tiptap-editor-content"
        }
      >
        <EditorContent editor={editor} />
        <BubbleMenu
          editor={editor}
          shouldShow={({ editor: currentEditor }) =>
            currentEditor.isActive("image")
          }
          options={{ placement: "top" }}
        >
          <Space className="tiptap-image-controls" size={4}>
            <Tooltip title="Drag to rotate image">
              <Button
                size="small"
                className="tiptap-rotate-handle"
                aria-label="Drag to rotate image"
                icon={<RotateRightOutlined />}
                onPointerDown={startImageRotation}
              />
            </Tooltip>
            <Button
              size="small"
              type={selectedImage?.layout === "left" ? "primary" : "default"}
              aria-label="Align image left and wrap text"
              onClick={() =>
                editor.chain().focus().updateAttributes("image", { layout: "left" }).run()
              }
            >
              Image left
            </Button>
            <Button
              size="small"
              type={selectedImage?.layout === "right" ? "primary" : "default"}
              aria-label="Align image right and wrap text"
              onClick={() =>
                editor.chain().focus().updateAttributes("image", { layout: "right" }).run()
              }
            >
              Image right
            </Button>
            <Button
              size="small"
              type={selectedImage?.layout === "center" ? "primary" : "default"}
              aria-label="Center image"
              onClick={() =>
                editor.chain().focus().updateAttributes("image", { layout: "center" }).run()
              }
            >
              Center
            </Button>
          </Space>
        </BubbleMenu>
      </div>
    );
  };

  const renderHtmlEditor = (fullscreenMode = false) => {
    return (
      <HtmlSourceEditor
        value={htmlSource}
        onChange={setHtmlSource}
        darkMode={isDark}
        fullscreen={fullscreenMode}
      />
    );
  };

  if (!editor) {
    return <div className="tiptap-editor-wrapper" style={editorTheme} />;
  }

  return (
    <>
      {!fullscreen && (
        <div className="tiptap-editor-wrapper" style={editorTheme}>
          {renderToolbar(false)}

          {htmlMode ? renderHtmlEditor(false) : renderVisualEditor(false)}
        </div>
      )}

      <Modal
        open={fullscreen}
        footer={null}
        closable
        destroyOnHidden={false}
        onCancel={() => setFullscreen(false)}
        width="95vw"
        style={{
          top: 20,
        }}
        styles={{
          body: {
            padding: 0,
          },
        }}
      >
        <div className="tiptap-editor-wrapper" style={editorTheme}>
          {renderToolbar(true)}

          {htmlMode ? renderHtmlEditor(true) : renderVisualEditor(true)}
        </div>
      </Modal>
    </>
  );
}
