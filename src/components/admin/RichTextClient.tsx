"use client";

// Bọc CKEditor 5 (ClassicEditor) — client-only, dùng license 'GPL'.
// Upload ảnh trong bài đi qua uploadImageAction (Vercel Blob).
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  Essentials,
  Paragraph,
  Heading,
  Bold,
  Italic,
  Underline,
  Link,
  List,
  BlockQuote,
  Image,
  ImageToolbar,
  ImageCaption,
  ImageStyle,
  ImageResize,
  ImageUpload,
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";
import { uploadImageAction } from "@/lib/content/actions";

/* eslint-disable @typescript-eslint/no-explicit-any */

// Adapter tải ảnh: nhận file từ CKEditor -> gọi server action -> trả URL.
class BlobUploadAdapter {
  loader: any;
  folder: string;
  constructor(loader: any, folder: string) {
    this.loader = loader;
    this.folder = folder;
  }
  upload(): Promise<{ default: string }> {
    return this.loader.file.then(
      (file: File) =>
        new Promise<{ default: string }>((resolve, reject) => {
          const fd = new FormData();
          fd.append("file", file);
          fd.append("folder", this.folder);
          uploadImageAction(fd)
            .then((res) => {
              if (res.ok && res.data) resolve({ default: res.data });
              else reject(res.error || "Tải ảnh thất bại");
            })
            .catch(() => reject("Tải ảnh thất bại"));
        })
    );
  }
  abort() {}
}

function makeUploadPlugin(folder: string) {
  return function UploadPlugin(editor: any) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader: any) =>
      new BlobUploadAdapter(loader, folder);
  };
}

export default function RichTextClient({
  value,
  onChange,
  folder = "content",
}: {
  value: string;
  onChange: (html: string) => void;
  folder?: string;
}) {
  return (
    <CKEditor
      editor={ClassicEditor}
      data={value}
      config={{
        licenseKey: "GPL",
        plugins: [
          Essentials,
          Paragraph,
          Heading,
          Bold,
          Italic,
          Underline,
          Link,
          List,
          BlockQuote,
          Image,
          ImageToolbar,
          ImageCaption,
          ImageStyle,
          ImageResize,
          ImageUpload,
        ],
        extraPlugins: [makeUploadPlugin(folder)],
        toolbar: [
          "heading",
          "|",
          "bold",
          "italic",
          "underline",
          "link",
          "bulletedList",
          "numberedList",
          "blockQuote",
          "|",
          "uploadImage",
          "|",
          "undo",
          "redo",
        ],
      }}
      onChange={(_evt: any, editor: any) => {
        onChange(editor.getData());
      }}
    />
  );
}
