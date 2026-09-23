// // "use client";

// // import {
// //   AlignCenterOutlined,
// //   AlignLeftOutlined,
// //   AlignRightOutlined,
// //   BoldOutlined,
// //   ClearOutlined,
// //   CodeOutlined,
// //   DeleteOutlined,
// //   FontColorsOutlined,
// //   FullscreenOutlined,
// //   HighlightOutlined,
// //   ItalicOutlined,
// //   LinkOutlined,
// //   MinusOutlined,
// //   OrderedListOutlined,
// //   PictureOutlined,
// //   RedoOutlined,
// //   StrikethroughOutlined,
// //   TableOutlined,
// //   UnderlineOutlined,
// //   UndoOutlined,
// //   UnorderedListOutlined,
// // } from "@ant-design/icons";

// // import { Button, Divider, Dropdown, Select, Space, Tooltip } from "antd";

// // export default function TiptapToolbar({ editor, onFullscreen }) {
// //   if (!editor) {
// //     return null;
// //   }

// //   const getHeadingValue = () => {
// //     for (let level = 1; level <= 6; level++) {
// //       if (
// //         editor.isActive("heading", {
// //           level,
// //         })
// //       ) {
// //         return `h${level}`;
// //       }
// //     }

// //     return "p";
// //   };

// //   const changeHeading = (value) => {
// //     if (value === "p") {
// //       editor.chain().focus().setParagraph().run();

// //       return;
// //     }

// //     editor
// //       .chain()
// //       .focus()
// //       .toggleHeading({
// //         level: Number(value.replace("h", "")),
// //       })
// //       .run();
// //   };

// //   const handleLink = () => {
// //     const oldUrl = editor.getAttributes("link").href || "";

// //     const url = window.prompt("Enter URL", oldUrl || "https://");

// //     if (url === null) {
// //       return;
// //     }

// //     if (!url.trim()) {
// //       editor.chain().focus().unsetLink().run();

// //       return;
// //     }

// //     editor
// //       .chain()
// //       .focus()
// //       .extendMarkRange("link")
// //       .setLink({
// //         href: url.trim(),
// //         target: "_blank",
// //         rel: "noopener noreferrer",
// //       })
// //       .run();
// //   };

// //   const handleImage = () => {
// //     const url = window.prompt("Enter image URL", "https://");

// //     if (!url || !url.trim()) {
// //       return;
// //     }

// //     editor
// //       .chain()
// //       .focus()
// //       .setImage({
// //         src: url.trim(),
// //       })
// //       .run();
// //   };

// //   const insertCustomTable = () => {
// //     const rowsInput = window.prompt("Number of rows", "3");

// //     if (rowsInput === null) {
// //       return;
// //     }

// //     const colsInput = window.prompt("Number of columns", "3");

// //     if (colsInput === null) {
// //       return;
// //     }

// //     const rows = Math.min(Math.max(Number.parseInt(rowsInput, 10) || 1, 1), 20);

// //     const cols = Math.min(Math.max(Number.parseInt(colsInput, 10) || 1, 1), 20);

// //     editor
// //       .chain()
// //       .focus()
// //       .insertTable({
// //         rows,
// //         cols,
// //         withHeaderRow: true,
// //       })
// //       .run();
// //   };

// //   const tableItems = [
// //     {
// //       key: "insert",

// //       label: "Create Custom Table",

// //       icon: <TableOutlined />,

// //       onClick: insertCustomTable,
// //     },

// //     {
// //       key: "insert-3x3",

// //       label: "Insert 3 × 3 Table",

// //       onClick: () =>
// //         editor
// //           .chain()
// //           .focus()
// //           .insertTable({
// //             rows: 3,
// //             cols: 3,
// //             withHeaderRow: true,
// //           })
// //           .run(),
// //     },

// //     {
// //       key: "insert-4x4",

// //       label: "Insert 4 × 4 Table",

// //       onClick: () =>
// //         editor
// //           .chain()
// //           .focus()
// //           .insertTable({
// //             rows: 4,
// //             cols: 4,
// //             withHeaderRow: true,
// //           })
// //           .run(),
// //     },

// //     {
// //       type: "divider",
// //     },

// //     {
// //       key: "add-row-before",

// //       label: "Add Row Before",

// //       onClick: () => editor.chain().focus().addRowBefore().run(),
// //     },

// //     {
// //       key: "add-row-after",

// //       label: "Add Row After",

// //       onClick: () => editor.chain().focus().addRowAfter().run(),
// //     },

// //     {
// //       key: "delete-row",

// //       label: "Delete Current Row",

// //       icon: <DeleteOutlined />,

// //       danger: true,

// //       onClick: () => editor.chain().focus().deleteRow().run(),
// //     },

// //     {
// //       type: "divider",
// //     },

// //     {
// //       key: "add-column-before",

// //       label: "Add Column Before",

// //       onClick: () => editor.chain().focus().addColumnBefore().run(),
// //     },

// //     {
// //       key: "add-column-after",

// //       label: "Add Column After",

// //       onClick: () => editor.chain().focus().addColumnAfter().run(),
// //     },

// //     {
// //       key: "delete-column",

// //       label: "Delete Current Column",

// //       icon: <DeleteOutlined />,

// //       danger: true,

// //       onClick: () => editor.chain().focus().deleteColumn().run(),
// //     },

// //     {
// //       type: "divider",
// //     },

// //     {
// //       key: "merge",

// //       label: "Merge Cells",

// //       onClick: () => editor.chain().focus().mergeCells().run(),
// //     },

// //     {
// //       key: "split",

// //       label: "Split Cell",

// //       onClick: () => editor.chain().focus().splitCell().run(),
// //     },

// //     {
// //       key: "toggle-header",

// //       label: "Toggle Header Row",

// //       onClick: () => editor.chain().focus().toggleHeaderRow().run(),
// //     },

// //     {
// //       type: "divider",
// //     },

// //     {
// //       key: "delete-table",

// //       label: "Delete Table",

// //       danger: true,

// //       icon: <DeleteOutlined />,

// //       onClick: () => editor.chain().focus().deleteTable().run(),
// //     },
// //   ];

// //   /* =====================================================
// //      TEXT COLORS
// //   ===================================================== */

// //   const textColors = [
// //     ["black", "Black", "#000000"],
// //     ["red", "Red", "#ff4d4f"],
// //     ["orange", "Orange", "#fa8c16"],
// //     ["green", "Green", "#52c41a"],
// //     ["blue", "Blue", "#1677ff"],
// //     ["purple", "Purple", "#722ed1"],
// //   ];

// //   const textColorItems = [
// //     ...textColors.map(([key, label, color]) => ({
// //       key,

// //       label: (
// //         <span
// //           style={{
// //             color,
// //             fontWeight: 600,
// //           }}
// //         >
// //           {label}
// //         </span>
// //       ),

// //       onClick: () => editor.chain().focus().setColor(color).run(),
// //     })),

// //     {
// //       type: "divider",
// //     },

// //     {
// //       key: "remove-color",

// //       label: "Remove Color",

// //       onClick: () => editor.chain().focus().unsetColor().run(),
// //     },
// //   ];

// //   const highlightColors = [
// //     ["yellow", "Yellow", "#fff566"],
// //     ["green", "Green", "#b7eb8f"],
// //     ["blue", "Blue", "#91d5ff"],
// //     ["pink", "Pink", "#ffadd2"],
// //     ["orange", "Orange", "#ffd591"],
// //   ];

// //   const highlightItems = [
// //     ...highlightColors.map(([key, label, color]) => ({
// //       key,

// //       label: (
// //         <span
// //           style={{
// //             background: color,
// //             padding: "3px 8px",
// //             borderRadius: 4,
// //           }}
// //         >
// //           {label}
// //         </span>
// //       ),

// //       onClick: () =>
// //         editor
// //           .chain()
// //           .focus()
// //           .toggleHighlight({
// //             color,
// //           })
// //           .run(),
// //     })),

// //     {
// //       type: "divider",
// //     },

// //     {
// //       key: "remove-highlight",

// //       label: "Remove Highlight",

// //       onClick: () => editor.chain().focus().unsetHighlight().run(),
// //     },
// //   ];

// //   const canUndo = editor.can().chain().focus().undo().run();

// //   const canRedo = editor.can().chain().focus().redo().run();

// //   return (
// //     <Space
// //       wrap
// //       size={[6, 8]}
// //       style={{
// //         width: "100%",
// //       }}
// //     >
// //       {/* HEADING */}

// //       <Tooltip title="Paragraph / Heading">
// //         <Select
// //           value={getHeadingValue()}
// //           style={{
// //             width: 135,
// //           }}
// //           onChange={changeHeading}
// //           options={[
// //             {
// //               value: "p",
// //               label: "Paragraph",
// //             },
// //             {
// //               value: "h1",
// //               label: "Heading 1",
// //             },
// //             {
// //               value: "h2",
// //               label: "Heading 2",
// //             },
// //             {
// //               value: "h3",
// //               label: "Heading 3",
// //             },
// //             {
// //               value: "h4",
// //               label: "Heading 4",
// //             },
// //             {
// //               value: "h5",
// //               label: "Heading 5",
// //             },
// //             {
// //               value: "h6",
// //               label: "Heading 6",
// //             },
// //           ]}
// //         />
// //       </Tooltip>

// //       <Divider orientation="vertical" />

// //       {/* BOLD */}

// //       <Tooltip title="Bold">
// //         <Button
// //           type={editor.isActive("bold") ? "primary" : "default"}
// //           icon={<BoldOutlined />}
// //           onClick={() => editor.chain().focus().toggleBold().run()}
// //         />
// //       </Tooltip>

// //       {/* ITALIC */}

// //       <Tooltip title="Italic">
// //         <Button
// //           type={editor.isActive("italic") ? "primary" : "default"}
// //           icon={<ItalicOutlined />}
// //           onClick={() => editor.chain().focus().toggleItalic().run()}
// //         />
// //       </Tooltip>

// //       {/* UNDERLINE */}

// //       <Tooltip title="Underline">
// //         <Button
// //           type={editor.isActive("underline") ? "primary" : "default"}
// //           icon={<UnderlineOutlined />}
// //           onClick={() => editor.chain().focus().toggleUnderline().run()}
// //         />
// //       </Tooltip>

// //       {/* STRIKE */}

// //       <Tooltip title="Strikethrough">
// //         <Button
// //           type={editor.isActive("strike") ? "primary" : "default"}
// //           icon={<StrikethroughOutlined />}
// //           onClick={() => editor.chain().focus().toggleStrike().run()}
// //         />
// //       </Tooltip>

// //       <Divider orientation="vertical" />

// //       {/* COLOR */}

// //       <Dropdown
// //         trigger={["click"]}
// //         menu={{
// //           items: textColorItems,
// //         }}
// //       >
// //         <Tooltip title="Text Color">
// //           <Button icon={<FontColorsOutlined />} />
// //         </Tooltip>
// //       </Dropdown>

// //       {/* HIGHLIGHT */}

// //       <Dropdown
// //         trigger={["click"]}
// //         menu={{
// //           items: highlightItems,
// //         }}
// //       >
// //         <Tooltip title="Highlight">
// //           <Button icon={<HighlightOutlined />} />
// //         </Tooltip>
// //       </Dropdown>

// //       <Divider orientation="vertical" />

// //       {/* BULLET */}

// //       <Tooltip title="Bullet List">
// //         <Button
// //           type={editor.isActive("bulletList") ? "primary" : "default"}
// //           icon={<UnorderedListOutlined />}
// //           onClick={() => editor.chain().focus().toggleBulletList().run()}
// //         />
// //       </Tooltip>

// //       {/* ORDERED */}

// //       <Tooltip title="Numbered List">
// //         <Button
// //           type={editor.isActive("orderedList") ? "primary" : "default"}
// //           icon={<OrderedListOutlined />}
// //           onClick={() => editor.chain().focus().toggleOrderedList().run()}
// //         />
// //       </Tooltip>

// //       <Divider orientation="vertical" />

// //       {/* ALIGN LEFT */}

// //       <Tooltip title="Align Left">
// //         <Button
// //           type={
// //             editor.isActive({
// //               textAlign: "left",
// //             })
// //               ? "primary"
// //               : "default"
// //           }
// //           icon={<AlignLeftOutlined />}
// //           onClick={() => editor.chain().focus().setTextAlign("left").run()}
// //         />
// //       </Tooltip>

// //       {/* ALIGN CENTER */}

// //       <Tooltip title="Align Center">
// //         <Button
// //           type={
// //             editor.isActive({
// //               textAlign: "center",
// //             })
// //               ? "primary"
// //               : "default"
// //           }
// //           icon={<AlignCenterOutlined />}
// //           onClick={() => editor.chain().focus().setTextAlign("center").run()}
// //         />
// //       </Tooltip>

// //       {/* ALIGN RIGHT */}

// //       <Tooltip title="Align Right">
// //         <Button
// //           type={
// //             editor.isActive({
// //               textAlign: "right",
// //             })
// //               ? "primary"
// //               : "default"
// //           }
// //           icon={<AlignRightOutlined />}
// //           onClick={() => editor.chain().focus().setTextAlign("right").run()}
// //         />
// //       </Tooltip>

// //       {/* JUSTIFY */}

// //       <Tooltip title="Justify">
// //         <Button
// //           type={
// //             editor.isActive({
// //               textAlign: "justify",
// //             })
// //               ? "primary"
// //               : "default"
// //           }
// //           icon={
// //             <span
// //               style={{
// //                 fontSize: 18,
// //                 fontWeight: 700,
// //               }}
// //             >
// //               ≡
// //             </span>
// //           }
// //           onClick={() => editor.chain().focus().setTextAlign("justify").run()}
// //         />
// //       </Tooltip>

// //       <Divider orientation="vertical" />

// //       {/* BLOCKQUOTE */}

// //       <Tooltip title="Blockquote">
// //         <Button
// //           type={editor.isActive("blockquote") ? "primary" : "default"}
// //           icon={
// //             <span
// //               style={{
// //                 fontSize: 18,
// //                 fontWeight: 700,
// //               }}
// //             >
// //               "
// //             </span>
// //           }
// //           onClick={() => editor.chain().focus().toggleBlockquote().run()}
// //         />
// //       </Tooltip>

// //       {/* INLINE CODE */}

// //       <Tooltip title="Inline Code">
// //         <Button
// //           type={editor.isActive("code") ? "primary" : "default"}
// //           icon={<CodeOutlined />}
// //           onClick={() => editor.chain().focus().toggleCode().run()}
// //         />
// //       </Tooltip>

// //       {/* CODE BLOCK */}

// //       <Tooltip title="Code Block">
// //         <Button
// //           type={editor.isActive("codeBlock") ? "primary" : "default"}
// //           icon={
// //             <span
// //               style={{
// //                 fontSize: 12,
// //                 fontWeight: 700,
// //               }}
// //             >
// //               {"</>"}
// //             </span>
// //           }
// //           onClick={() => editor.chain().focus().toggleCodeBlock().run()}
// //         />
// //       </Tooltip>

// //       {/* HR */}

// //       <Tooltip title="Horizontal Rule">
// //         <Button
// //           icon={<MinusOutlined />}
// //           onClick={() => editor.chain().focus().setHorizontalRule().run()}
// //         />
// //       </Tooltip>

// //       <Divider orientation="vertical" />

// //       {/* LINK */}

// //       <Tooltip title="Insert Link">
// //         <Button
// //           type={editor.isActive("link") ? "primary" : "default"}
// //           icon={<LinkOutlined />}
// //           onClick={handleLink}
// //         />
// //       </Tooltip>

// //       {/* IMAGE */}

// //       <Tooltip title="Insert Image">
// //         <Button icon={<PictureOutlined />} onClick={handleImage} />
// //       </Tooltip>

// //       {/* TABLE */}

// //       <Dropdown
// //         trigger={["click"]}
// //         menu={{
// //           items: tableItems,
// //         }}
// //       >
// //         <Tooltip title="Table">
// //           <Button
// //             type={editor.isActive("table") ? "primary" : "default"}
// //             icon={<TableOutlined />}
// //           />
// //         </Tooltip>
// //       </Dropdown>

// //       <Divider orientation="vertical" />

// //       {/* CLEAR */}

// //       <Tooltip title="Clear Formatting">
// //         <Button
// //           icon={<ClearOutlined />}
// //           onClick={() =>
// //             editor.chain().focus().unsetAllMarks().clearNodes().run()
// //           }
// //         />
// //       </Tooltip>

// //       {/* UNDO */}

// //       <Tooltip title="Undo">
// //         <Button
// //           disabled={!canUndo}
// //           icon={<UndoOutlined />}
// //           onClick={() => editor.chain().focus().undo().run()}
// //         />
// //       </Tooltip>

// //       {/* REDO */}

// //       <Tooltip title="Redo">
// //         <Button
// //           disabled={!canRedo}
// //           icon={<RedoOutlined />}
// //           onClick={() => editor.chain().focus().redo().run()}
// //         />
// //       </Tooltip>

// //       <Divider orientation="vertical" />

// //       {/* FULLSCREEN */}

// //       <Tooltip title="Fullscreen">
// //         <Button icon={<FullscreenOutlined />} onClick={onFullscreen} />
// //       </Tooltip>
// //     </Space>
// //   );
// // }

// "use client";

// import {
//   AlignCenterOutlined,
//   AlignLeftOutlined,
//   AlignRightOutlined,
//   ClearOutlined,
//   CodeOutlined,
//   FontColorsOutlined,
//   FullscreenOutlined,
//   HighlightOutlined,
//   LinkOutlined,
//   MinusOutlined,
//   OrderedListOutlined,
//   PictureOutlined,
//   RedoOutlined,
//   StrikethroughOutlined,
//   TableOutlined,
//   UnderlineOutlined,
//   UndoOutlined,
//   UnorderedListOutlined,
// } from "@ant-design/icons";

// import { Button, Divider, Dropdown, Select, Space, Tooltip } from "antd";

// export default function TiptapToolbar({
//   editor,
//   htmlMode = false,
//   onToggleHtml,
//   onFullscreen,
// }) {
//   if (!editor) {
//     return null;
//   }

//   /*
//    * =====================================================
//    * HEADING
//    * =====================================================
//    */

//   const getHeading = () => {
//     for (let i = 1; i <= 6; i++) {
//       if (
//         editor.isActive("heading", {
//           level: i,
//         })
//       ) {
//         return `h${i}`;
//       }
//     }

//     return "p";
//   };

//   const setHeading = (value) => {
//     if (value === "p") {
//       editor.chain().focus().setParagraph().run();

//       return;
//     }

//     editor
//       .chain()
//       .focus()
//       .toggleHeading({
//         level: Number(value.replace("h", "")),
//       })
//       .run();
//   };

//   /*
//    * =====================================================
//    * FONT FAMILY
//    * =====================================================
//    */

//   const fontFamilies = [
//     {
//       value: "Arial",
//       label: "Arial",
//     },
//     {
//       value: "Helvetica",
//       label: "Helvetica",
//     },
//     {
//       value: "Georgia",
//       label: "Georgia",
//     },
//     {
//       value: "Times New Roman",
//       label: "Times New Roman",
//     },
//     {
//       value: "Verdana",
//       label: "Verdana",
//     },
//     {
//       value: "Tahoma",
//       label: "Tahoma",
//     },
//     {
//       value: "Courier New",
//       label: "Courier New",
//     },
//   ];

//   /*
//    * =====================================================
//    * FONT SIZE
//    * =====================================================
//    */

//   const fontSizes = [
//     "10px",
//     "11px",
//     "12px",
//     "13px",
//     "14px",
//     "16px",
//     "18px",
//     "20px",
//     "24px",
//     "28px",
//     "32px",
//     "36px",
//     "48px",
//   ].map((size) => ({
//     value: size,
//     label: size,
//   }));

//   /*
//    * =====================================================
//    * COLORS
//    * =====================================================
//    */

//   const colors = [
//     "#000000",
//     "#ffffff",
//     "#ff4d4f",
//     "#fa8c16",
//     "#fadb14",
//     "#52c41a",
//     "#13c2c2",
//     "#1677ff",
//     "#722ed1",
//     "#eb2f96",
//     "#8c8c8c",
//   ];

//   const colorItems = colors.map((color) => ({
//     key: color,

//     label: (
//       <div
//         style={{
//           width: 18,
//           height: 18,
//           borderRadius: 4,
//           background: color,
//           border: color === "#ffffff" ? "1px solid #999" : "none",
//         }}
//       />
//     ),

//     onClick: () => editor.chain().focus().setColor(color).run(),
//   }));

//   colorItems.push({
//     key: "unset",

//     label: "Remove Color",

//     onClick: () => editor.chain().focus().unsetColor().run(),
//   });

//   /*
//    * =====================================================
//    * HIGHLIGHT
//    * =====================================================
//    */

//   const highlightColors = [
//     "#fff566",
//     "#ffd591",
//     "#b7eb8f",
//     "#87e8de",
//     "#91d5ff",
//     "#adc6ff",
//     "#d3adf7",
//     "#ffadd2",
//   ];

//   const highlightItems = highlightColors.map((color) => ({
//     key: color,

//     label: (
//       <div
//         style={{
//           width: 20,
//           height: 20,
//           borderRadius: 4,
//           background: color,
//         }}
//       />
//     ),

//     onClick: () =>
//       editor
//         .chain()
//         .focus()
//         .toggleHighlight({
//           color,
//         })
//         .run(),
//   }));

//   highlightItems.push({
//     key: "remove",

//     label: "Remove Highlight",

//     onClick: () => editor.chain().focus().unsetHighlight().run(),
//   });

//   /*
//    * =====================================================
//    * TABLE
//    * =====================================================
//    */

//   const tableMenu = {
//     items: [
//       {
//         key: "3x3",
//         label: "Insert 3 × 3",
//       },
//       {
//         key: "4x4",
//         label: "Insert 4 × 4",
//       },
//       {
//         key: "5x5",
//         label: "Insert 5 × 5",
//       },

//       {
//         type: "divider",
//       },

//       {
//         key: "rowBefore",
//         label: "Add Row Before",
//       },
//       {
//         key: "rowAfter",
//         label: "Add Row After",
//       },
//       {
//         key: "deleteRow",
//         label: "Delete Row",
//         danger: true,
//       },

//       {
//         type: "divider",
//       },

//       {
//         key: "columnBefore",
//         label: "Add Column Before",
//       },
//       {
//         key: "columnAfter",
//         label: "Add Column After",
//       },
//       {
//         key: "deleteColumn",
//         label: "Delete Column",
//         danger: true,
//       },

//       {
//         type: "divider",
//       },

//       {
//         key: "merge",
//         label: "Merge Cells",
//       },
//       {
//         key: "split",
//         label: "Split Cell",
//       },
//       {
//         key: "header",
//         label: "Toggle Header Row",
//       },

//       {
//         type: "divider",
//       },

//       {
//         key: "deleteTable",
//         label: "Delete Table",
//         danger: true,
//       },
//     ],

//     onClick: ({ key }) => {
//       const chain = editor.chain().focus();

//       switch (key) {
//         case "3x3":
//           chain
//             .insertTable({
//               rows: 3,
//               cols: 3,
//               withHeaderRow: true,
//             })
//             .run();
//           break;

//         case "4x4":
//           chain
//             .insertTable({
//               rows: 4,
//               cols: 4,
//               withHeaderRow: true,
//             })
//             .run();
//           break;

//         case "5x5":
//           chain
//             .insertTable({
//               rows: 5,
//               cols: 5,
//               withHeaderRow: true,
//             })
//             .run();
//           break;

//         case "rowBefore":
//           chain.addRowBefore().run();
//           break;

//         case "rowAfter":
//           chain.addRowAfter().run();
//           break;

//         case "deleteRow":
//           chain.deleteRow().run();
//           break;

//         case "columnBefore":
//           chain.addColumnBefore().run();
//           break;

//         case "columnAfter":
//           chain.addColumnAfter().run();
//           break;

//         case "deleteColumn":
//           chain.deleteColumn().run();
//           break;

//         case "merge":
//           chain.mergeCells().run();
//           break;

//         case "split":
//           chain.splitCell().run();
//           break;

//         case "header":
//           chain.toggleHeaderRow().run();
//           break;

//         case "deleteTable":
//           chain.deleteTable().run();
//           break;

//         default:
//           break;
//       }
//     },
//   };

//   /*
//    * =====================================================
//    * LINK
//    * =====================================================
//    */

//   const addLink = () => {
//     const current = editor.getAttributes("link")?.href || "";

//     const url = window.prompt("Enter URL", current || "https://");

//     if (url === null) {
//       return;
//     }

//     if (!url.trim()) {
//       editor.chain().focus().unsetLink().run();

//       return;
//     }

//     editor
//       .chain()
//       .focus()
//       .extendMarkRange("link")
//       .setLink({
//         href: url.trim(),
//         target: "_blank",
//         rel: "noopener noreferrer",
//       })
//       .run();
//   };

//   /*
//    * =====================================================
//    * IMAGE
//    * =====================================================
//    */

//   const addImage = () => {
//     const url = window.prompt("Image URL", "https://");

//     if (!url) {
//       return;
//     }

//     editor
//       .chain()
//       .focus()
//       .setImage({
//         src: url.trim(),
//       })
//       .run();
//   };

//   /*
//    * =====================================================
//    * CLIPBOARD
//    * =====================================================
//    */

//   const copyContent = async () => {
//     editor.commands.focus();

//     document.execCommand("copy");
//   };

//   const cutContent = async () => {
//     editor.commands.focus();

//     document.execCommand("cut");
//   };

//   const pasteContent = async () => {
//     try {
//       const text = await navigator.clipboard.readText();

//       editor.chain().focus().insertContent(text).run();
//     } catch (error) {
//       console.error("Paste failed:", error);
//     }
//   };

//   const selectAll = () => {
//     editor.chain().focus().selectAll().run();
//   };

//   /*
//    * =====================================================
//    * RETURN
//    * =====================================================
//    */

//   return (
//     <Space
//       wrap
//       size={[6, 6]}
//       style={{
//         width: "100%",
//       }}
//     >
//       {/* =================================================
//           PARAGRAPH
//       ================================================= */}

//       <Tooltip title="Paragraph / Heading">
//         <Select
//           value={getHeading()}
//           onChange={setHeading}
//           style={{
//             width: 135,
//           }}
//           options={[
//             {
//               value: "p",
//               label: "Paragraph",
//             },
//             {
//               value: "h1",
//               label: "Heading 1",
//             },
//             {
//               value: "h2",
//               label: "Heading 2",
//             },
//             {
//               value: "h3",
//               label: "Heading 3",
//             },
//             {
//               value: "h4",
//               label: "Heading 4",
//             },
//             {
//               value: "h5",
//               label: "Heading 5",
//             },
//             {
//               value: "h6",
//               label: "Heading 6",
//             },
//           ]}
//         />
//       </Tooltip>

//       <Divider orientation="vertical" />

//       {/* =================================================
//           FONT FAMILY
//       ================================================= */}

//       <Tooltip title="Font Family">
//         <Select
//           placeholder="Font"
//           style={{
//             width: 125,
//           }}
//           options={fontFamilies}
//           onChange={(value) =>
//             editor.chain().focus().setFontFamily(value).run()
//           }
//         />
//       </Tooltip>

//       {/* =================================================
//           FONT SIZE
//       ================================================= */}

//       <Tooltip title="Font Size">
//         <Select
//           placeholder="Size"
//           style={{
//             width: 75,
//           }}
//           options={fontSizes}
//           onChange={(value) => editor.chain().focus().setFontSize(value).run()}
//         />
//       </Tooltip>

//       <Divider orientation="vertical" />

//       {/* =================================================
//           BOLD
//       ================================================= */}

//       <Tooltip title="Bold">
//         <Button
//           type={editor.isActive("bold") ? "primary" : "default"}
//           onClick={() => editor.chain().focus().toggleBold().run()}
//         >
//           <b>B</b>
//         </Button>
//       </Tooltip>

//       {/* ITALIC */}

//       <Tooltip title="Italic">
//         <Button
//           type={editor.isActive("italic") ? "primary" : "default"}
//           onClick={() => editor.chain().focus().toggleItalic().run()}
//         >
//           <i>I</i>
//         </Button>
//       </Tooltip>

//       {/* UNDERLINE */}

//       <Tooltip title="Underline">
//         <Button
//           type={editor.isActive("underline") ? "primary" : "default"}
//           icon={<UnderlineOutlined />}
//           onClick={() => editor.chain().focus().toggleUnderline().run()}
//         />
//       </Tooltip>

//       {/* STRIKE */}

//       <Tooltip title="Strike">
//         <Button
//           type={editor.isActive("strike") ? "primary" : "default"}
//           icon={<StrikethroughOutlined />}
//           onClick={() => editor.chain().focus().toggleStrike().run()}
//         />
//       </Tooltip>

//       {/* SUPERSCRIPT */}

//       <Tooltip title="Superscript">
//         <Button
//           type={editor.isActive("superscript") ? "primary" : "default"}
//           onClick={() => editor.chain().focus().toggleSuperscript().run()}
//         >
//           X<sup>2</sup>
//         </Button>
//       </Tooltip>

//       {/* SUBSCRIPT */}

//       <Tooltip title="Subscript">
//         <Button
//           type={editor.isActive("subscript") ? "primary" : "default"}
//           onClick={() => editor.chain().focus().toggleSubscript().run()}
//         >
//           X<sub>2</sub>
//         </Button>
//       </Tooltip>

//       <Divider orientation="vertical" />

//       {/* =================================================
//           TEXT COLOR
//       ================================================= */}

//       <Tooltip title="Text Color">
//         <Dropdown
//           menu={{
//             items: colorItems,
//           }}
//           trigger={["click"]}
//         >
//           <Button icon={<FontColorsOutlined />} />
//         </Dropdown>
//       </Tooltip>

//       {/* HIGHLIGHT */}

//       <Tooltip title="Highlight">
//         <Dropdown
//           menu={{
//             items: highlightItems,
//           }}
//           trigger={["click"]}
//         >
//           <Button icon={<HighlightOutlined />} />
//         </Dropdown>
//       </Tooltip>

//       <Divider orientation="vertical" />

//       {/* =================================================
//           BULLET
//       ================================================= */}

//       <Tooltip title="Bullet List">
//         <Button
//           type={editor.isActive("bulletList") ? "primary" : "default"}
//           icon={<UnorderedListOutlined />}
//           onClick={() => editor.chain().focus().toggleBulletList().run()}
//         />
//       </Tooltip>

//       {/* ORDERED */}

//       <Tooltip title="Numbered List">
//         <Button
//           type={editor.isActive("orderedList") ? "primary" : "default"}
//           icon={<OrderedListOutlined />}
//           onClick={() => editor.chain().focus().toggleOrderedList().run()}
//         />
//       </Tooltip>

//       <Divider orientation="vertical" />

//       {/* =================================================
//           ALIGN LEFT
//       ================================================= */}

//       <Tooltip title="Align Left">
//         <Button
//           type={
//             editor.isActive({
//               textAlign: "left",
//             })
//               ? "primary"
//               : "default"
//           }
//           icon={<AlignLeftOutlined />}
//           onClick={() => editor.chain().focus().setTextAlign("left").run()}
//         />
//       </Tooltip>

//       {/* CENTER */}

//       <Tooltip title="Align Center">
//         <Button
//           type={
//             editor.isActive({
//               textAlign: "center",
//             })
//               ? "primary"
//               : "default"
//           }
//           icon={<AlignCenterOutlined />}
//           onClick={() => editor.chain().focus().setTextAlign("center").run()}
//         />
//       </Tooltip>

//       {/* RIGHT */}

//       <Tooltip title="Align Right">
//         <Button
//           type={
//             editor.isActive({
//               textAlign: "right",
//             })
//               ? "primary"
//               : "default"
//           }
//           icon={<AlignRightOutlined />}
//           onClick={() => editor.chain().focus().setTextAlign("right").run()}
//         />
//       </Tooltip>

//       {/* JUSTIFY */}

//       <Tooltip title="Justify">
//         <Button
//           type={
//             editor.isActive({
//               textAlign: "justify",
//             })
//               ? "primary"
//               : "default"
//           }
//           onClick={() => editor.chain().focus().setTextAlign("justify").run()}
//         >
//           ≡
//         </Button>
//       </Tooltip>

//       <Divider orientation="vertical" />

//       {/* =================================================
//           BLOCKQUOTE
//       ================================================= */}

//       <Tooltip title="Blockquote">
//         <Button
//           type={editor.isActive("blockquote") ? "primary" : "default"}
//           onClick={() => editor.chain().focus().toggleBlockquote().run()}
//         >
//           "
//         </Button>
//       </Tooltip>

//       {/* INLINE CODE */}

//       <Tooltip title="Inline Code">
//         <Button
//           type={editor.isActive("code") ? "primary" : "default"}
//           icon={<CodeOutlined />}
//           onClick={() => editor.chain().focus().toggleCode().run()}
//         />
//       </Tooltip>

//       {/* CODE BLOCK */}

//       <Tooltip title="Code Block">
//         <Button onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
//           {"</>"}
//         </Button>
//       </Tooltip>

//       {/* HR */}

//       <Tooltip title="Horizontal Rule">
//         <Button
//           icon={<MinusOutlined />}
//           onClick={() => editor.chain().focus().setHorizontalRule().run()}
//         />
//       </Tooltip>

//       <Divider orientation="vertical" />

//       {/* =================================================
//           LINK
//       ================================================= */}

//       <Tooltip title="Link">
//         <Button
//           type={editor.isActive("link") ? "primary" : "default"}
//           icon={<LinkOutlined />}
//           onClick={addLink}
//         />
//       </Tooltip>

//       {/* IMAGE */}

//       <Tooltip title="Image">
//         <Button icon={<PictureOutlined />} onClick={addImage} />
//       </Tooltip>

//       {/* TABLE */}

//       <Tooltip title="Table">
//         <Dropdown menu={tableMenu} trigger={["click"]}>
//           <Button
//             type={editor.isActive("table") ? "primary" : "default"}
//             icon={<TableOutlined />}
//           />
//         </Dropdown>
//       </Tooltip>

//       <Divider orientation="vertical" />

//       {/* =================================================
//           COPY
//       ================================================= */}

//       <Tooltip title="Copy">
//         <Button onClick={copyContent}>Copy</Button>
//       </Tooltip>

//       {/* CUT */}

//       <Tooltip title="Cut">
//         <Button onClick={cutContent}>Cut</Button>
//       </Tooltip>

//       {/* PASTE */}

//       <Tooltip title="Paste">
//         <Button onClick={pasteContent}>Paste</Button>
//       </Tooltip>

//       {/* SELECT ALL */}

//       <Tooltip title="Select All">
//         <Button onClick={selectAll}>Select</Button>
//       </Tooltip>

//       {/* CLEAR */}

//       <Tooltip title="Clear Formatting">
//         <Button
//           icon={<ClearOutlined />}
//           onClick={() =>
//             editor.chain().focus().unsetAllMarks().clearNodes().run()
//           }
//         />
//       </Tooltip>

//       <Divider orientation="vertical" />

//       {/* =================================================
//           UNDO
//       ================================================= */}

//       <Tooltip title="Undo">
//         <Button
//           icon={<UndoOutlined />}
//           disabled={!editor.can().undo()}
//           onClick={() => editor.chain().focus().undo().run()}
//         />
//       </Tooltip>

//       {/* REDO */}

//       <Tooltip title="Redo">
//         <Button
//           icon={<RedoOutlined />}
//           disabled={!editor.can().redo()}
//           onClick={() => editor.chain().focus().redo().run()}
//         />
//       </Tooltip>

//       <Divider orientation="vertical" />

//       {/* =================================================
//           HTML SOURCE
//       ================================================= */}

//       <Tooltip title={htmlMode ? "Visual Editor" : "HTML Source"}>
//         <Button type={htmlMode ? "primary" : "default"} onClick={onToggleHtml}>
//           {"</>"}
//         </Button>
//       </Tooltip>

//       {/* =================================================
//           FULLSCREEN
//       ================================================= */}

//       <Tooltip title="Fullscreen">
//         <Button icon={<FullscreenOutlined />} onClick={onFullscreen} />
//       </Tooltip>
//     </Space>
//   );
// }

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

import { Button, Divider, Dropdown, Select, Space, Tooltip } from "antd";

export default function TiptapToolbar({
  editor,
  htmlMode = false,
  onToggleHtml,
  onFullscreen,
}) {
  if (!editor) {
    return null;
  }

  /*
   * =====================================================
   * HEADING
   * =====================================================
   */

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

  /*
   * =====================================================
   * FONT
   * =====================================================
   */

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

  /*
   * =====================================================
   * COLORS
   * =====================================================
   */

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

  /*
   * =====================================================
   * HIGHLIGHT
   * =====================================================
   */

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

  /*
   * =====================================================
   * TABLE
   * =====================================================
   */

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

  /*
   * =====================================================
   * LINK
   * =====================================================
   */

  const addLink = () => {
    const current = editor.getAttributes("link")?.href || "";

    const url = window.prompt("Enter URL", current || "https://");

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

  /*
   * =====================================================
   * IMAGE
   * =====================================================
   */

  const addImage = () => {
    const url = window.prompt("Image URL", "https://");

    if (!url) {
      return;
    }

    editor
      .chain()
      .focus()
      .setImage({
        src: url.trim(),
      })
      .run();
  };

  /*
   * =====================================================
   * RETURN
   * =====================================================
   */

  return (
    <Space
      wrap
      size={[6, 6]}
      style={{
        width: "100%",
      }}
    >
      {/* ================================================
          HEADINGS
      ================================================ */}

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

      {/* ================================================
          FONT FAMILY
      ================================================ */}

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

      {/* ================================================
          FONT SIZE
      ================================================ */}

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

      {/* ================================================
          BOLD
      ================================================ */}

      <Tooltip title="Bold">
        <Button
          type={editor.isActive("bold") ? "primary" : "default"}
          icon={<BoldOutlined />}
          onClick={() => editor.chain().focus().toggleBold().run()}
        />
      </Tooltip>

      {/* ITALIC */}

      <Tooltip title="Italic">
        <Button
          type={editor.isActive("italic") ? "primary" : "default"}
          icon={<ItalicOutlined />}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        />
      </Tooltip>

      {/* UNDERLINE */}

      <Tooltip title="Underline">
        <Button
          type={editor.isActive("underline") ? "primary" : "default"}
          icon={<UnderlineOutlined />}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        />
      </Tooltip>

      {/* STRIKE */}

      <Tooltip title="Strikethrough">
        <Button
          type={editor.isActive("strike") ? "primary" : "default"}
          icon={<StrikethroughOutlined />}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        />
      </Tooltip>

      {/* SUPERSCRIPT */}

      <Tooltip title="Superscript">
        <Button
          type={editor.isActive("superscript") ? "primary" : "default"}
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
        >
          X<sup>2</sup>
        </Button>
      </Tooltip>

      {/* SUBSCRIPT */}

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
          "
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

      <Tooltip title="Image URL">
        <Button icon={<PictureOutlined />} onClick={addImage} />
      </Tooltip>

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
