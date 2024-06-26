"use client";

import React, { useState } from "react";
import { HoveredLink, Menu, MenuItem } from "@/components/ui/navbar-menu";
import { cn } from "@/utils/cn";
import Link from "next/link";

function Navbar({ className }) {
  const [active, setActive] = useState(null);
  return (
    <div className={cn("inset-x-0  mx-auto max-md:m-4 ", className)}>
      <Menu setActive={setActive}>
        <Link href={"/"}>
          <MenuItem
            setActive={setActive}
            active={active}
            item="Home"
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
        <Link href={"/login"}>
          <MenuItem
            setActive={setActive}
            active={active}
            item="Login"
          ></MenuItem>
        </Link>
        <Link href={"/signup"}>
          <MenuItem
            setActive={setActive}
            active={active}
            item="Signup"
          ></MenuItem>
        </Link>
        <Link href={"/logout"}>
          <MenuItem
            setActive={setActive}
            active={active}
            item="Logout"
          ></MenuItem>
        </Link>
        <Link href={"/contact"}>
          <MenuItem setActive={setActive} active={active} item="AI"></MenuItem>
        </Link>
      </Menu>
    </div>
  );
}

export default Navbar;
