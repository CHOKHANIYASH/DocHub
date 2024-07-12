"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { cn } from "../../utils/cn";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faGithub } from "@fortawesome/free-brands-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import { useState } from "react";
import axios from "axios";
import Loader from "react-js-loader";
import { v4 as uuidv4 } from "uuid";
import {
  signUp,
  confirmSignUp,
  autoSignIn,
  signInWithRedirect,
} from "aws-amplify/auth";
import { setIsAuthenticated } from "@/redux/slices/isAuthenticatedSlice";
import { useAppDispatch } from "@/redux/hooks/index";

export default function Signup() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [signUpConfirm, setSignUpConfirm] = useState(false);
  const [code, setCode] = useState();
  const [userId, setUserId] = useState("");
  const [uid, setUid] = useState("");
  const url = process.env.NEXT_PUBLIC_SERVER_URL;
  const handleGoogleSignup = async () => {
    try {
      const response = await signInWithRedirect({
        provider: "Google",
        customState: "SignUp",
      });
      console.log(response);
    } catch (err) {
      toast.error(err.message, { toastId: "uniqueToastSignup" });
      console.log(err);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // setUid(uuidv4());
      const response = await signUp({
        username,
        password,
        options: {
          userAttributes: {
            email,
            // preferred_username: username,
          },
          autoSignIn: true,
        },
      });
      console.log(response);
      setUserId(response.userId);
      setSignUpConfirm(true);
      setLoading(false);
      toast.info("Check your email for the confirmation code", {
        toastId: "uniqueToastSignup",
      });
    } catch (err) {
      toast.error(err.message, { toastId: "uniqueToastSignup" });
      setLoading(false);
      console.log(err);
    }
  };
  const handleConfirmSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await confirmSignUp({
        confirmationCode: code,
        username,
      });
      await saveUser({
        firstName,
        lastName,
        email,
        username,
        userId,
      });
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error(err.message, { toastId: "uniqueToastSignup" });
      console.log(err);
    }
  };
  const saveUser = async ({ firstName, lastName, email, username, userId }) => {
    try {
      const response = await axios.post(`${url}/user/signup`, {
        firstName,
        lastName,
        email,
        username,
        userId,
      });
      dispatch(setIsAuthenticated(true));
      await autoSignIn();
      router.push(`/dashboard/${userId}`);
      toast.success("User created successfully", {
        toastId: "uniqueToastSignup",
      });
    } catch (err) {
      toast.error(err.message, { toastId: "uniqueToastSignup" });
      console.log(err);
    }
  };
  return (
    <>
      <div className="max-w-md p-4 m-10 mx-auto bg-white md:w-full max-md:m-5 rounded-2xl md:p-8 shadow-input">
        {!signUpConfirm ? (
          <>
            <h2 className="text-xl font-bold text-neutral-800">Welcome</h2>
            <form className="my-8" onSubmit={handleSubmit}>
              <div className="flex flex-col mb-4 space-y-2 md:flex-row md:space-y-0 md:space-x-2">
                <LabelInputContainer>
                  <Label htmlFor="firstName">First name</Label>
                  <Input
                    value={firstName}
                    id="firstName"
                    placeholder="Tyler"
                    type="text"
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </LabelInputContainer>
                <LabelInputContainer>
                  <Label htmlFor="lastName">Last name</Label>
                  <Input
                    value={lastName}
                    id="lastName"
                    placeholder="Durden"
                    type="text"
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </LabelInputContainer>
              </div>
              <LabelInputContainer className="mb-4">
                <Label htmlFor="username">username</Label>
                <Input
                  value={username}
                  id="username"
                  placeholder="user1"
                  type="text"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </LabelInputContainer>
              <LabelInputContainer className="mb-4">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  value={email}
                  id="email"
                  placeholder="projectmayhem@fc.com"
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
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
                  Sign up &rarr;
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
                type="submit"
                onClick={handleGoogleSignup}
              >
                <FontAwesomeIcon
                  icon={faGoogle}
                  className="w-4 h-4 text-neutral-800"
                />
                <span className="text-sm text-neutral-700">Google</span>
                <BottomGradient />
              </button>
            </div>
          </>
        ) : (
          <>
            <form on onSubmit={handleConfirmSignUp}>
              <LabelInputContainer className="mb-4">
                <Label htmlFor="Signup-Code">Signup Code</Label>
                <Input
                  value={code}
                  id="Signup-Code"
                  placeholder="••••••••"
                  type="number"
                  onChange={(e) => setCode(e.target.value)}
                />
              </LabelInputContainer>
              {!loading ? (
                <button
                  className="bg-gradient-to-br relative group/btn from-black  to-neutral-600 block d w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset]"
                  type="submit"
                >
                  Confirm Sign up &rarr;
                  <BottomGradient />
                </button>
              ) : (
                <Loader type="spinner-circle" bgColor={"#000000"} size={50} />
              )}
            </form>
          </>
        )}
      </div>
    </>
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
