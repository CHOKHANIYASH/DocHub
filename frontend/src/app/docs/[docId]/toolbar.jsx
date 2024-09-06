"use client";

import React, { useCallback } from "react";
import {
  faStrikethrough,
  faBold,
  faItalic,
  faList,
  faListOl,
  faHeading,
  faUnderline,
  faQuoteLeft,
  faUndo,
  faRedo,
  faCode,
  faImage,
  faSave,
  faCopy,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { toast } from "react-toastify";
const Toolbar = ({ editor, content, userId, accessToken, email }) => {
  const url = process.env.NEXT_PUBLIC_SERVER_URL;
  const copyTextToClipboard = async (text) => {
    if ("clipboard" in navigator) {
      await navigator.clipboard.writeText(text);
      toast.success("Url copied", {
        toastId: "uniqueToastDocs",
      });
    }
  };
  const handleSave = () => {
    const docId = window.location.pathname.split("/")[2];
    const json = editor.getJSON();
    axios
      .post(
        `${url}/docs/${docId}/update`,
        {
          document: {
            document: json,
          },
          userId,
          email,
        },
        { headers: { access_token: accessToken } }
      )
      .then((response) => {
        toast.success("Document saved successfully", {
          toastId: "uniqueToastDocs",
        });
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message, {
          toastId: "uniqueToastDocs",
        });
      });
  };
  const addImage = () => {
    const url = window.prompt("URL");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="sticky flex flex-wrap items-start justify-between gap-5 px-4 py-3 bg-white rounded-md">
      <div className="flex flex-wrap items-center justify-start w-full gap-5 lg:w-10/12 ">
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBold().run();
          }}
          className={"text-sky-400"}
        >
          <FontAwesomeIcon icon={faBold} className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleItalic().run();
          }}
          className={"text-sky-400"}
        >
          <FontAwesomeIcon icon={faItalic} className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleUnderline().run();
          }}
          className={"text-sky-400"}
        >
          <FontAwesomeIcon icon={faUnderline} className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleStrike().run();
          }}
          className={"text-sky-400"}
        >
          <FontAwesomeIcon icon={faStrikethrough} className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleHeading({ level: 1 }).run();
          }}
          className={"text-sky-400"}
        >
          <FontAwesomeIcon icon={faHeading} className="w-5 h-5" />1
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleHeading({ level: 2 }).run();
          }}
          className={"text-sky-400"}
        >
          <FontAwesomeIcon icon={faHeading} className="w-5 h-5" />2
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleHeading({ level: 3 }).run();
          }}
          className={"text-sky-400"}
        >
          <FontAwesomeIcon icon={faHeading} className="w-5 h-5" />3
        </button>

        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBulletList().run();
          }}
          className={"text-sky-400"}
        >
          <FontAwesomeIcon icon={faList} className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleOrderedList().run();
          }}
          className={"text-sky-400"}
        >
          <FontAwesomeIcon icon={faListOl} className="w-5 h-5" />
        </button>
        {/* <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().setCodeBlock().run();
          }}
          className={"text-sky-400"}
        >
          <FontAwesomeIcon icon={faCode} className="w-5 h-5" />
        </button> */}
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().undo().run();
          }}
          className={
            "text-sky-400 hover:bg-sky-700 hover:text-white p-1 hover:rounded-lg"
          }
        >
          <FontAwesomeIcon icon={faUndo} className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().redo().run();
          }}
          className={
            "text-sky-400 hover:bg-sky-700 hover:text-white p-1 hover:rounded-lg"
          }
        >
          <FontAwesomeIcon icon={faRedo} className="w-5 h-5" />
        </button>
        <button
          onClick={addImage}
          className={
            "text-sky-400 hover:bg-sky-700 hover:text-white p-1 hover:rounded-lg"
          }
        >
          <FontAwesomeIcon icon={faImage} className="w-5 h-5" />
        </button>
        <button
          onClick={handleSave}
          className={
            "text-sky-400 hover:bg-sky-700 hover:text-white p-1 hover:rounded-lg"
          }
        >
          <p className="inline font-semibold">Save</p>{" "}
          <FontAwesomeIcon icon={faSave} className="w-5 h-5" />
        </button>
        <button
          onClick={() => copyTextToClipboard(window.location.href)}
          className={
            "text-sky-400 hover:bg-sky-700 hover:text-white p-1 hover:rounded-lg"
          }
        >
          <p className="inline font-semibold">CopyUrl</p>{" "}
          <FontAwesomeIcon icon={faCopy} className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
