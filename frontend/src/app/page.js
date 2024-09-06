"use client";
import "aws-amplify/auth/enable-oauth-listener";
import GridBackground from "./GridBackground";
import Image from "next/image";
export default function Home() {
  return (
    <>
      <GridBackground>
        <Image
          className="mb-10 ml-auto mr-auto text-center"
          src="/icon1.png"
          width={200}
          height={200}
        />
        Welcome to DocHub <br /> A perfect place to create and share documents{" "}
        <br />
      </GridBackground>
    </>
  );
}
