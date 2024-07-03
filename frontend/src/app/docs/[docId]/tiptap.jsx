"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import Toolbar from "./toolbar";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePen } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
const Tiptap = ({ userId, accessToken, content, documentName }) => {
  const editor = useEditor({
    extensions: [StarterKit, Image, Underline],
    content:
      content ||
      "<p>Start joining your innovative dots ....................</p>",
    editorProps: {
      attributes: {
        class: "focus:outline-none",
      },
    },
  });

  useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  return (
    <>
      <div>
        <Toolbar editor={editor} userId={userId} accessToken={accessToken} />
        <h1 className="mt-2 text-4xl font-bold text-center text-gray-700">
          {documentName}
        </h1>
        <div className="w-full text-3xl font-bold text-right text-gray-700 mt-[-2rem]">
          <Link href={`${window.location.href}/details/update`}>
            <FontAwesomeIcon
              icon={faFilePen}
              className="text-gray-700 cursor-pointer hover:text-sky-400"
              title="Edit Document Details"
            />
          </Link>
        </div>
        <EditorContent
          className="p-10 m-10 font-mono text-xl prose-lg [&_ol]:list-decimal [&_ul]:list-disc text-black bg-white border-2 border-gray-400 rounded-lg shadow-md focus:outline-none"
          editor={editor}
        />
      </div>
    </>
  );
};

export default Tiptap;
