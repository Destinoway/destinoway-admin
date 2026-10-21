"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import CodeMirror from "@uiw/react-codemirror";

import { html } from "@codemirror/lang-html";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorView } from "@codemirror/view";

export default function HtmlSourceEditor({
  value = "",
  onChange,
  darkMode = false,
  fullscreen = false,
}) {


  const [localValue, setLocalValue] = useState(value || "");

  const lastExternalValue = useRef(value || "");


  useEffect(() => {
    const incomingValue = value || "";


    if (incomingValue === localValue) {
      lastExternalValue.current = incomingValue;

      return;
    }



    if (incomingValue !== lastExternalValue.current) {
      setLocalValue(incomingValue);

      lastExternalValue.current = incomingValue;
    }
  }, [value, localValue]);


  const customTheme = useMemo(() => {
    return EditorView.theme({
      "&": {
        backgroundColor: "var(--editor-bg)",

        color: "var(--editor-text)",
      },

      "&.cm-focused": {
        outline: "none",
      },

      ".cm-scroller": {
        overflow: "auto",
      },

      ".cm-content": {
        minHeight: fullscreen ? "calc(85vh - 102px)" : "278px",

        padding: "20px",

        caretColor: "var(--editor-text)",

        fontFamily:
          "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",

        fontSize: "14px",

        lineHeight: "1.7",
      },

      ".cm-line": {
        padding: "0",
      },

      ".cm-gutters": {
        backgroundColor: "var(--editor-bg)",

        color: "var(--editor-muted)",

        borderRight: "1px solid var(--editor-border)",
      },

      ".cm-activeLine": {
        backgroundColor: "var(--editor-code-bg)",
      },

      ".cm-activeLineGutter": {
        backgroundColor: "var(--editor-code-bg)",
      },

      ".cm-selectionBackground": {
        backgroundColor: "var(--editor-selection) !important",
      },

      ".cm-matchingBracket": {
        backgroundColor: "var(--editor-selection)",
      },

      ".cm-tooltip": {
        backgroundColor: "var(--editor-bg)",

        color: "var(--editor-text)",

        border: "1px solid var(--editor-border)",
      },
    });
  }, [fullscreen]);


  const extensions = useMemo(() => {
    return [html(), EditorView.lineWrapping, customTheme];
  }, [customTheme]);

  const handleChange = (newValue) => {
    setLocalValue(newValue);

    lastExternalValue.current = newValue;

    onChange?.(newValue);
  };


  const formatHtml = async () => {
    try {
      const prettier = await import("prettier/standalone");

      const htmlPlugin = await import("prettier/plugins/html");

      const prettierFormat = prettier.format || prettier.default?.format;

      const plugin = htmlPlugin.default || htmlPlugin;

      if (!prettierFormat) {
        console.error("Prettier format function not found");

        return;
      }

      const formatted = await prettierFormat(localValue, {
        parser: "html",

        plugins: [plugin],

        printWidth: 100,

        tabWidth: 2,

        useTabs: false,

        singleQuote: false,

        bracketSameLine: false,
      });


      setLocalValue(formatted);

      lastExternalValue.current = formatted;

      onChange?.(formatted);
    } catch (error) {
      console.error("HTML formatting failed:", error);
    }
  };


  const editorHeight = fullscreen ? "calc(85vh - 102px)" : "278px";


  return (
    <div
      className={
        fullscreen
          ? "tiptap-html-source tiptap-html-source-fullscreen"
          : "tiptap-html-source"
      }
    >
  

      <div className="tiptap-html-source-header">
        <span className="tiptap-html-source-title">HTML Source</span>

        <button
          type="button"
          className="tiptap-html-format-button"
          onMouseDown={(event) => {
            /*
             * Don't steal editor focus.
             */

            event.preventDefault();
          }}
          onClick={formatHtml}
        >
          Format HTML
        </button>
      </div>


      <CodeMirror
        value={localValue}
        height={editorHeight}
        extensions={extensions}
        theme={darkMode ? oneDark : undefined}
        onChange={handleChange}
        basicSetup={{
          lineNumbers: true,

          foldGutter: true,

          dropCursor: true,

          allowMultipleSelections: true,

          indentOnInput: true,

          bracketMatching: true,

          closeBrackets: true,

          autocompletion: true,

          rectangularSelection: true,

          highlightActiveLine: true,

          highlightSelectionMatches: true,

          searchKeymap: true,

          foldKeymap: true,

          completionKeymap: true,

          closeBracketsKeymap: true,
        }}
      />
    </div>
  );
}
