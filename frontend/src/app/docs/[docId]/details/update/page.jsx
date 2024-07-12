"use client";
import React from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { fetchAuthSession, fetchUserAttributes } from "aws-amplify/auth";
import { useState, useEffect } from "react";
import { Label } from "../../../../../components/ui/label";
import { Input, Select } from "../../../../../components/ui/input";
import { cn } from "../../../../../utils/cn";
import Loader from "react-js-loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
export default function DocumentDetailsUpdate() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [accessType, setAccessType] = useState("");
  const [allowedUsers, setAllowedUsers] = useState([]);
  const [addUser, setAddUser] = useState({ email: "", permission: "view" });
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const url = process.env.NEXT_PUBLIC_SERVER_URL;
  const [userId, setUserId] = useState(null);
  const [accessToken, setAccessToken] = useState("");
  const [email, setEmail] = useState("");
  useEffect(() => {
    fetchAuthSession()
      .then((session) => {
        let accessTokenString = "";
        let tempEmail = "";
        if (session.userSub !== undefined) {
          setUserId(session.userSub);
          accessTokenString = session.tokens.accessToken.toString();
          setAccessToken(accessTokenString);
          const docId = window.location.pathname.split("/")[2];
          fetchUserAttributes().then((user) => {
            tempEmail = user.email;
            setEmail(user.email);
            const response = axios
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
                setName(response.data.data.name);
                setAccessType(response.data.data.accessType);
                if (response.data.data.accessType === "restricted")
                  setAllowedUsers(response.data.data.allowedUsers);
              })
              .catch((err) => {
                console.log(err);
                toast.error(
                  "You are not allowed to view this Document Details",
                  {
                    toastId: "uniqueDocumentToast",
                  }
                );
              });
          });
        } else {
          const response = axios
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
              setName(response.data.data.name);
              setAccessType(response.data.data.accessType);
              if (response.data.data.accessType === "restricted")
                setAllowedUsers(response.data.data.allowedUsers);
            })
            .catch((err) => {
              console.log(err);
              toast.error("You are not allowed to view this Document Details", {
                toastId: "uniqueDocumentToast",
              });
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const handleAddUser = async (e) => {
    e.preventDefault();
    if (
      addUser !== null &&
      !allowedUsers.some((user) => user.email === addUser.email)
    )
      setAllowedUsers([...allowedUsers, addUser]);
  };
  const handleRemoveUser = async (user) => {
    const newAllowedUsers = allowedUsers.filter((allowedUser) => {
      return allowedUser !== user;
    });
    setAllowedUsers(newAllowedUsers);
  };
  const handlePemissionChange = (e, email) => {
    const newAllowedUsers = allowedUsers.map((user) => {
      if (user.email === email) {
        return { ...user, permission: e.target.value };
      }
      return user;
    });
    setAllowedUsers(newAllowedUsers);
  };
  const handleAccessListSubmit = async (e) => {
    e.preventDefault();
    setLoading2(true);
    const docId = window.location.pathname.split("/")[2];
    await axios
      .post(
        `${url}/docs/${docId}/update/accesslist`,
        { accessType, allowedUsers, userId },
        { headers: { access_token: accessToken } }
      )
      .then((response) => {
        toast.success("AccessList updated successfully", {
          toastId: "uniqueToastDocs",
        });
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message, { toastId: "uniqueToastDocs" });
      });
    setLoading2(false);
  };
  const handleNameSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const docId = window.location.pathname.split("/")[2];
    axios
      .post(
        `${url}/docs/${docId}/update`,
        { document: { name }, userId, email },
        { headers: { access_token: accessToken } }
      )
      .then((response) => {
        toast.success("Name Changed successfully", {
          toastId: "uniqueToastDocs",
        });
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message, { toastId: "uniqueToastDocs" });
      });
    setLoading(false);
  };
  return (
    <div className="max-w-md p-4 m-10 mx-auto bg-white md:w-full max-md:m-5 rounded-2xl md:p-8 shadow-input">
      <h2 className="text-xl font-bold text-neutral-800">
        Update Document Details
      </h2>
      <form className="my-8 " onSubmit={handleNameSubmit}>
        <div className="">
          <LabelInputContainer className="mb-4">
            <Label htmlFor="name">Name </Label>
            <Input
              id="name"
              value={name}
              placeholder="document"
              type="text"
              onChange={(e) => setName(e.target.value)}
            />
          </LabelInputContainer>
        </div>
        {!loading ? (
          <button
            className="bg-gradient-to-br relative group/btn from-black  to-neutral-600 block d w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset]"
            type="submit"
          >
            Update name &rarr;
            <BottomGradient />
          </button>
        ) : (
          <Loader type="spinner-circle" bgColor={"#000000"} size={50} />
        )}
      </form>
      <form className="my-8 " onSubmit={handleAccessListSubmit}>
        <div className="">
          <h1 className="text-xl text-center"> AccessList</h1>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="username">Access Type </Label>
            <Select
              onChange={(e) => setAccessType(e.target.value)}
              accessType={accessType}
            />
          </LabelInputContainer>
          {accessType === "restricted" && (
            <LabelInputContainer className="mb-4">
              <Label htmlFor="allowedUsers"> Add allowed Users Email ID </Label>
              <Input
                id="allowedUsers"
                placeholder="user1@gmail.com"
                type="username"
                onChange={(e) =>
                  setAddUser((prev) => ({ ...prev, email: e.target.value }))
                }
              />
              <button
                className="px-4 py-2 rounded-xl w-1/3 text-gray-100  border mt-2 ml-auto border-black bg-blue-500 text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
                onClick={handleAddUser}
              >
                Add User
              </button>

              {allowedUsers.map((user, i) => {
                return (
                  <div key={i} className="grid grid-flow-col">
                    <p className="px-4 py-2 w-fit bg-gray-200 text-black backdrop-blur-sm border border-black rounded-md hover:shadow-[0px_0px_4px_4px_rgba(0,0,0,0.1)] bg-white/[0.2] text-sm transition duration-200">
                      {user.email}

                      <FontAwesomeIcon
                        icon={faXmark}
                        className="ml-2 text-red-500 cursor-pointer"
                        onClick={() => handleRemoveUser(user)}
                      />
                    </p>
                    <select
                      value={user.permission}
                      onChange={(e) => handlePemissionChange(e, user.email)}
                      className="text-sm transition duration-200 rounded-md outline-none"
                    >
                      <option value="view">View only</option>
                      <option value="fullAccess">Full Access</option>
                    </select>
                  </div>
                );
              })}
            </LabelInputContainer>
          )}
        </div>
        {!loading2 ? (
          <button
            className="bg-gradient-to-br relative group/btn from-black  to-neutral-600 block d w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset]"
            type="submit"
          >
            Update Access List &rarr;
            <BottomGradient />
          </button>
        ) : (
          <Loader type="spinner-circle" bgColor={"#000000"} size={50} />
        )}
      </form>
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
