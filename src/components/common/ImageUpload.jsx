// "use client";

// import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
// import { App, Image, Upload } from "antd";
// import { useState } from "react";

// import { uploadMediaApi } from "@/modules/cms/api/cms.service";

// export default function ImageUpload({
//   value,
//   onChange,
//   folder = "common",
//   label = "Upload Image",
// }) {
//   const { message } = App.useApp();

//   const [uploading, setUploading] = useState(false);

//   const [previewOpen, setPreviewOpen] = useState(false);

//   const fileList = value
//     ? [
//         {
//           uid: "-1",
//           name: "image",
//           status: "done",
//           url: encodeURI(value),
//         },
//       ]
//     : [];

//   const handleUpload = async ({ file, onSuccess, onError }) => {
//     try {
//       setUploading(true);

//       const formData = new FormData();

//       formData.append("file", file);

//       formData.append("folder", folder);

//       const res = await uploadMediaApi(formData);

//       const imageUrl = res?.data?.url || res?.url;

//       if (!imageUrl) {
//         throw new Error("Upload failed");
//       }

//       onChange?.(imageUrl);

//       message.success("Image uploaded");

//       onSuccess("ok");
//     } catch (err) {
//       console.error(err);

//       message.error("Upload failed");

//       onError(err);
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <>
//       <Upload
//         listType="picture-card"
//         customRequest={handleUpload}
//         fileList={fileList}
//         maxCount={1}
//         accept="image/*"
//         onRemove={() => {
//           onChange?.("");

//           return true;
//         }}
//         onPreview={() => setPreviewOpen(true)}
//       >
//         {!value && (
//           <div>
//             {uploading ? <LoadingOutlined /> : <PlusOutlined />}

//             <div style={{ marginTop: 8 }}>
//               {uploading ? "Uploading..." : label}
//             </div>
//           </div>
//         )}
//       </Upload>

//       {value && (
//         <Image
//           style={{
//             display: "none",
//           }}
//           preview={{
//             open: previewOpen,
//             src: encodeURI(value),
//             onOpenChange: setPreviewOpen,
//           }}
//         />
//       )}
//     </>
//   );
// }
