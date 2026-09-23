"use client";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import { useEffect, useMemo, useRef } from "react";

import {
  Alignment,
  BlockQuote,
  Bold,
  ClassicEditor,
  Code,
  CodeBlock,
  Essentials,
  FindAndReplace,
  Font,
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
  Fullscreen,
  GeneralHtmlSupport,
  Heading,
  Highlight,
  HorizontalLine,
  Image,
  ImageCaption,
  ImageInsert,
  ImageResize,
  ImageStyle,
  ImageToolbar,
  Indent,
  Italic,
  Link,
  List,
  Paragraph,
  SelectAll,
  SpecialCharacters,
  SpecialCharactersEssentials,
  Strikethrough,
  Subscript,
  Superscript,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  TodoList,
  Underline,
  Undo,
} from "ckeditor5";

import {
  CaseChange,
  FormatPainter,
  SourceEditingEnhanced,
} from "ckeditor5-premium-features";

import "ckeditor5-premium-features/ckeditor5-premium-features.css";
import "ckeditor5/ckeditor5.css";

export default function CKEditorTextEditor({
  value = "",
  onChange,
  placeholder = "Start writing content...",
}) {
  const editorRef = useRef(null);

  const licenseKey = process.env.NEXT_PUBLIC_CKEDITOR_LICENSE_KEY || "";

  const config = useMemo(
    () => ({
      licenseKey,

      plugins: [
        Essentials,
        Paragraph,
        Heading,

        Bold,
        Italic,
        Underline,
        Strikethrough,
        Subscript,
        Superscript,

        Font,
        FontFamily,
        FontSize,
        FontColor,
        FontBackgroundColor,

        Highlight,

        Alignment,

        List,
        TodoList,

        Indent,

        Link,

        BlockQuote,
        Code,
        CodeBlock,
        HorizontalLine,

        Image,
        ImageCaption,
        ImageInsert,
        ImageResize,
        ImageStyle,
        ImageToolbar,

        Table,
        TableCaption,
        TableCellProperties,
        TableColumnResize,
        TableProperties,
        TableToolbar,

        GeneralHtmlSupport,

        FindAndReplace,

        Fullscreen,

        SelectAll,
        SpecialCharacters,
        SpecialCharactersEssentials,

        Undo,

        SourceEditingEnhanced,
        FormatPainter,
        CaseChange,
      ],

      toolbar: {
        items: [
          "undo",
          "redo",

          "|",

          "sourceEditingEnhanced",

          "|",

          "heading",

          "|",

          "bold",
          "italic",
          "underline",
          "strikethrough",
          "subscript",
          "superscript",

          "|",

          "fontFamily",
          "fontSize",
          "fontColor",
          "fontBackgroundColor",

          "|",

          "highlight",

          "|",

          "alignment",

          "|",

          "bulletedList",
          "numberedList",
          "todoList",

          "|",

          "outdent",
          "indent",

          "|",

          "link",

          "insertImage",

          "insertTable",

          "|",

          "blockQuote",
          "code",
          "codeBlock",
          "horizontalLine",

          "|",

          "formatPainter",
          "caseChange",

          "|",

          "findAndReplace",

          "|",

          "specialCharacters",

          "|",

          "selectAll",

          "|",

          "fullscreen",
        ],

        shouldNotGroupWhenFull: true,
      },

      heading: {
        options: [
          {
            model: "paragraph",
            title: "Paragraph",
            class: "ck-heading_paragraph",
          },

          {
            model: "heading1",
            view: "h1",
            title: "Heading 1",
            class: "ck-heading_heading1",
          },

          {
            model: "heading2",
            view: "h2",
            title: "Heading 2",
            class: "ck-heading_heading2",
          },

          {
            model: "heading3",
            view: "h3",
            title: "Heading 3",
            class: "ck-heading_heading3",
          },

          {
            model: "heading4",
            view: "h4",
            title: "Heading 4",
            class: "ck-heading_heading4",
          },

          {
            model: "heading5",
            view: "h5",
            title: "Heading 5",
            class: "ck-heading_heading5",
          },

          {
            model: "heading6",
            view: "h6",
            title: "Heading 6",
            class: "ck-heading_heading6",
          },
        ],
      },

      fontFamily: {
        options: [
          "default",

          "Arial, Helvetica, sans-serif",

          "Georgia, serif",

          "Tahoma, Geneva, sans-serif",

          "Times New Roman, Times, serif",

          "Verdana, Geneva, sans-serif",

          "Courier New, Courier, monospace",

          "Trebuchet MS, Helvetica, sans-serif",

          "Inter, sans-serif",

          "Roboto, sans-serif",
        ],

        supportAllValues: true,
      },

      fontSize: {
        options: [
          10, 11, 12, 13, 14, 16, 18, 20, 22, 24, 28, 32, 36, 42, 48, 56, 64,
        ],

        supportAllValues: true,
      },

      link: {
        decorators: {
          openInNewTab: {
            mode: "manual",

            label: "Open in a new tab",

            attributes: {
              target: "_blank",
              rel: "noopener noreferrer",
            },
          },
        },
      },

      image: {
        toolbar: [
          "imageTextAlternative",
          "toggleImageCaption",

          "imageStyle:inline",
          "imageStyle:block",
          "imageStyle:side",

          "resizeImage",
        ],
      },

      table: {
        contentToolbar: [
          "tableColumn",
          "tableRow",
          "mergeTableCells",
          "tableProperties",
          "tableCellProperties",
        ],
      },

      tableProperties: {
        borderColors: [
          {
            color: "#000000",
            label: "Black",
          },

          {
            color: "#d9d9d9",
            label: "Gray",
          },

          {
            color: "#1677ff",
            label: "Blue",
          },

          {
            color: "#52c41a",
            label: "Green",
          },

          {
            color: "#ff4d4f",
            label: "Red",
          },

          {
            color: "#722ed1",
            label: "Purple",
          },
        ],

        backgroundColors: [
          {
            color: "#ffffff",
            label: "White",
          },

          {
            color: "#f5f5f5",
            label: "Light Gray",
          },

          {
            color: "#e6f4ff",
            label: "Light Blue",
          },

          {
            color: "#f6ffed",
            label: "Light Green",
          },

          {
            color: "#fff2f0",
            label: "Light Red",
          },

          {
            color: "#f9f0ff",
            label: "Light Purple",
          },
        ],
      },

      tableCellProperties: {
        borderColors: [
          {
            color: "#000000",
            label: "Black",
          },

          {
            color: "#d9d9d9",
            label: "Gray",
          },

          {
            color: "#1677ff",
            label: "Blue",
          },

          {
            color: "#52c41a",
            label: "Green",
          },

          {
            color: "#ff4d4f",
            label: "Red",
          },
        ],

        backgroundColors: [
          {
            color: "#ffffff",
            label: "White",
          },

          {
            color: "#f5f5f5",
            label: "Light Gray",
          },

          {
            color: "#e6f4ff",
            label: "Light Blue",
          },

          {
            color: "#f6ffed",
            label: "Light Green",
          },

          {
            color: "#fff2f0",
            label: "Light Red",
          },
        ],
      },

      htmlSupport: {
        allow: [
          {
            name: /.*/,

            attributes: true,

            classes: true,

            styles: true,
          },
        ],
      },

      sourceEditingEnhanced: {
        theme: "default",
      },

      caseChange: {
        titleCase: {
          excludeWords: [
            "a",
            "an",
            "and",
            "as",
            "at",
            "but",
            "by",
            "for",
            "if",
            "in",
            "nor",
            "of",
            "on",
            "or",
            "per",
            "the",
            "to",
            "vs",
            "vs.",
            "via",
          ],
        },
      },

      findAndReplace: {
        uiType: "dialog",
      },

      fullscreen: {
        menuBar: {
          isVisible: true,
        },
      },

      specialCharacters: {
        items: ["Text", "Latin", "Mathematical", "Currency"],
      },

      placeholder,

      initialData: value || "",
    }),
    [licenseKey, placeholder],
  );

  useEffect(() => {
    const editor = editorRef.current;

    if (!editor) {
      return;
    }

    const incomingValue = value || "";

    const currentValue = editor.getData();

    if (currentValue === incomingValue) {
      return;
    }

    if (editor.editing.view.hasFocus) {
      return;
    }

    editor.setData(incomingValue);
  }, [value]);

  return (
    <div className="cms-ckeditor-wrapper">
      <CKEditor
        editor={ClassicEditor}
        config={config}
        onReady={(editor) => {
          editorRef.current = editor;

          console.log("CKEditor 5 ready");

          console.log(
            "Enhanced Source Editing:",
            !!editor.plugins.get("SourceEditingEnhanced"),
          );

          console.log(
            "Edit Source command:",
            !!editor.commands.get("editSource"),
          );
        }}
        onChange={(event, editor) => {
          const data = editor.getData();

          onChange?.(data);
        }}
        onError={(error) => {
          console.error("CKEditor error:", error);
        }}
      />
    </div>
  );
}
