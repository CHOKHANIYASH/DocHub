"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { fetchAuthSession } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
// import { CardBody, CardContainer, CardItem } from "../../../components/ui/card";
// import Link from "next/link";
// import { calsans } from "@/fonts/calsans";
// import Image from "next/image";
// import { twMerge } from "tailwind-merge";
// import { TracingBeam } from "../../../components/ui/tracing-beam";
// import { toast } from "react-toastify";
import Tiptap from "./tiptap";

export default function Document() {
  const router = useRouter();
  const url = process.env.NEXT_PUBLIC_SERVER_URL;
  const [userId, setUserId] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [document, setDocument] = useState({});
  useEffect(() => {
    fetchAuthSession()
      .then((session) => {
        setUserId(session.userSub);
        setAccessToken(session.accessToken);
        const docId = window.location.pathname.split("/")[2];
        const response = axios
          .get(`${url}/docs/${docId}`, {
            headers: {
              access_token: session.accessToken,
            },
          })
          .then((response) => {
            setDocument(response.data.data);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  console.log("Document Component");
  return (
    <>
      <Tiptap
        userId={userId}
        accessToken={accessToken}
        content={document.document}
        documentName={document.name}
      />
    </>
  );
}
