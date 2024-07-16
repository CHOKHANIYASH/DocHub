"use client";
import { Amplify } from "aws-amplify";
import awsExports from "../aws-exports";
import { Hub } from "aws-amplify/utils";
import { useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
// Amplify.configure(amplifyConfig);
// console.log("amplifyConfig", amplifyConfig);
// console.log("awsExports", awsExports);
Amplify.configure({ ...awsExports, ssr: true });
export default function AmplifyConfig() {
  // useEffect(() => {
  //   const unsubscribe = Hub.listen("auth", ({ payload }) => {
  //     console.log("A new auth event has happened: ", payload);
  //     switch (payload.event) {
  //       case "customOAuthState":
  //         if (payload.data === "SignUp") {
  //           console.log("Sign up with custom state");
  //         }
  //         break;
  //     }
  //   });
  //   return unsubscribe;
  // }, []);
  return null;
}
