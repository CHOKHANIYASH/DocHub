"use client";
import "react-toastify/dist/ReactToastify.css";
import React, { useState, useEffect } from "react";
import { HoveredLink, Menu, MenuItem } from "@/components/ui/navbar-menu";
import { cn } from "@/utils/cn";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import { useAppSelector } from "@/redux/hooks/index";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth";
import { usePathname } from "next/navigation";

function Navbar({ className }) {
  const [active, setActive] = useState(null);
  const isAuthenticated = useAppSelector((state) => state.isAuthenticated);
  const username = useAppSelector((state) => state.username);
  const [userId, setUserId] = useState("");
  const path = usePathname();
  useEffect(() => {
    fetchAuthSession()
      .then((session) => {
        setUserId(session.userSub);
      })
      .catch((err) => {
        console.log(err);
      });
  });
  return (
    <>
      <div className={cn("inset-x-0 ", className)}>
        <Menu setActive={setActive}>
          <Link href={"/"}>
            <MenuItem
              setActive={setActive}
              active={active}
              item="Home"
            ></MenuItem>
          </Link>
          <Link href={`/dashboard/${userId}`}>
            <MenuItem
              setActive={setActive}
              active={active}
              item="Dashboard"
            ></MenuItem>
          </Link>
          {/* <MenuItem setActive={setActive} active={active} item="Docs">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/courses">All Courses</HoveredLink>
            <HoveredLink href="/courses">Basic Music Theory</HoveredLink>
            <HoveredLink href="/courses">Advanced Composition</HoveredLink>
            <HoveredLink href="/courses">Songwriting</HoveredLink>
            <HoveredLink href="/courses">Music Production</HoveredLink>
          </div>
        </MenuItem> */}
          {!isAuthenticated ? (
            <>
              {" "}
              <Link href={"/signin"}>
                <MenuItem
                  setActive={setActive}
                  active={active}
                  item="Signin"
                ></MenuItem>
              </Link>
              <Link href={"/signup"}>
                <MenuItem
                  setActive={setActive}
                  active={active}
                  item="Signup"
                ></MenuItem>
              </Link>
            </>
          ) : (
            <Link href={"/signout"}>
              <MenuItem
                setActive={setActive}
                active={active}
                item="Signout"
              ></MenuItem>
            </Link>
          )}
          {/* <Link href={"/contact"}>
            <MenuItem
              setActive={setActive}
              active={active}
              item="AI"
            ></MenuItem>
          </Link> */}
        </Menu>
        {username && path !== "/" && !path.startsWith("/docs/") && (
          <div className="flex justify-end ">
            <p className="inline mr-4 text-lg font-bold text-gray-500">
              {username}
            </p>
          </div>
        )}
      </div>
      <ToastContainer autoClose={2000} />
    </>
  );
}

export default Navbar;
