"use client";
import React from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useState, useEffect } from "react";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { cn } from "../../utils/cn";
import Loader from "react-js-loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faGithub } from "@fortawesome/free-brands-svg-icons";
import { toast } from "react-toastify";
import { signIn, signInWithRedirect, getCurrentUser } from "@aws-amplify/auth";
import "aws-amplify/auth/enable-oauth-listener";
export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const url = process.env.NEXT_PUBLIC_SERVER_DEV_URL;
  const handleGoogleSigIn = async () => {
    try {
      const response = await signInWithRedirect({
        provider: "Google",
      });
    } catch (err) {
      toast.error(err.message, { toastId: "uniqueToastLogin" });
      console.log(err);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await signIn({ username, password });
      const user = await getCurrentUser();
      setLoading(false);
      toast.success("Login successful", { toastId: "uniqueToastLogin" });
      router.push(`/dashboard/${user.userId}`);
    } catch (err) {
      console.log(err);
      toast.error(err.message, { toastId: "uniqueToastLogin" });
      setLoading(false);
    }
  };
  return (
    <div className="max-w-md p-4 m-10 mx-auto bg-white md:w-full max-md:m-5 rounded-2xl md:p-8 shadow-input">
      <h2 className="text-xl font-bold text-neutral-800">Welcome</h2>
      <form className="my-8" onSubmit={handleSubmit}>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="username">Username </Label>
          <Input
            id="username"
            value={username}
            placeholder="user1"
            type="username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input
            value={password}
            id="password"
            placeholder="••••••••"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </LabelInputContainer>
        {!loading ? (
          <button
            className="bg-gradient-to-br relative group/btn from-black  to-neutral-600 block d w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset]"
            type="submit"
          >
            Login &rarr;
            <BottomGradient />
          </button>
        ) : (
          <Loader type="spinner-circle" bgColor={"#000000"} size={50} />
        )}
        <div className="bg-gradient-to-r from-transparent via-neutral-300  to-transparent my-8 h-[1px] w-full" />
      </form>
      <div className="flex flex-col mb-8 space-y-4">
        <button
          className="relative flex items-center justify-start w-full h-10 px-4 space-x-2 font-medium text-black rounded-md group/btn shadow-input bg-gray-50"
          //   type="submit"
          onClick={handleGoogleSigIn}
        >
          <FontAwesomeIcon
            icon={faGoogle}
            className="w-4 h-4 text-neutral-800"
          />
          <span className="text-sm text-neutral-700">Google</span>
          <BottomGradient />
        </button>
      </div>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 block w-full h-px transition duration-500 opacity-0 group-hover/btn:opacity-100 -bottom-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="absolute block w-1/2 h-px mx-auto transition duration-500 opacity-0 group-hover/btn:opacity-100 blur-sm -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
