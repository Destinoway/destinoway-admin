"use client";

import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Modal, theme } from "antd";
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

      Image.configure({
        inline: false,

        allowBase64: false,
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
