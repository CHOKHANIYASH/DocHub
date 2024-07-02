"use client";
import { Hub } from "aws-amplify/utils";
import { useEffect } from "react";
import { getCurrentUser } from "aws-amplify/auth";
import "aws-amplify/auth/enable-oauth-listener";
import { useRouter } from "next/navigation";
export default function OAuthResponse() {
  const router = useRouter();
  useEffect(() => {
    getCurrentUser().then((user) => {
      console.log("Oauth", user);
    });
  }, []);

  router.push("/");

  return null;
}
