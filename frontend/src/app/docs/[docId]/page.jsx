"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { fetchAuthSession, fetchUserAttributes } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import Tiptap from "./tiptap";
import { toast } from "react-toastify";
export default function Document() {
  const router = useRouter();
  const url = process.env.NEXT_PUBLIC_SERVER_URL;
  const [userId, setUserId] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [email, setEmail] = useState("");
  const [document, setDocument] = useState({});
  useEffect(() => {
    fetchAuthSession()
      .then((session) => {
        let accessTokenString = "";
        let tempEmail = "";
        const docId = window.location.pathname.split("/")[2];
        if (session.userSub !== undefined) {
          setUserId(session.userSub);
          accessTokenString = session.tokens.accessToken.toString();
          setAccessToken(accessTokenString);
          fetchUserAttributes().then((user) => {
            tempEmail = user.email;
            setEmail(user.email);
            axios
              .get(`${url}/docs/${docId}`, {
                headers: {
                  access_token: accessTokenString,
                },
                params: {
                  userId: session.userSub,
                  email: tempEmail,
                },
              })
              .then((response) => {
                setDocument(response.data.data);
              })
              .catch((err) => {
                toast.error(err.response.data.message, {
                  toastId: "uniqueDocumentToast",
                });
                setDocument((state) => {
                  return {
                    ...state,
                    document: {
                      type: "doc",
                      content: [],
                    },
                  };
                });
                console.log(err);
              });
          });
        } else {
          axios
            .get(`${url}/docs/${docId}`, {
              headers: {
                access_token: accessTokenString,
              },
              params: {
                userId: session.userSub,
                email: tempEmail,
              },
            })
            .then((response) => {
              setDocument(response.data.data);
            })
            .catch((err) => {
              toast.error(err.response.data.message, {
                toastId: "uniqueDocumentToast",
              });
              setDocument((state) => {
                return {
                  ...state,
                  document: {
                    type: "doc",
                    content: [],
                  },
                };
              });
              console.log(err);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  // console.log("Document Component");
  return (
    <>
      <Tiptap
        userId={userId}
        accessToken={accessToken}
        email={email}
        content={document.document}
        documentName={document.name}
      />
    </>
  );
}
