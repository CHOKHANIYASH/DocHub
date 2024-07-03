"use client";
import { useState, useEffect } from "react";
import { getCurrentUser } from "aws-amplify/auth";
import "aws-amplify/auth/enable-oauth-listener";
import { useRouter } from "next/navigation";
export default function OAuthResponse() {
  const router = useRouter();
  useEffect(() => {
    getCurrentUser().then((user) => {
      router.push(`/dashboard/${user.userId}`);
      console.log("Oauth", user);
    });
  }, []);

  return null;
}
