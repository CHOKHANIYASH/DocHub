"use client";
import "aws-amplify/auth/enable-oauth-listener";
import GridBackground from "./GridBackground";
export default function Home() {
  return (
    <>
      <GridBackground>
        Welcome to DocHub <br /> A perfect place to create and share documents{" "}
        <br />
        <h2 className="text-xl">
          Test User(username = testUser, password = Test#123)
        </h2>
      </GridBackground>
    </>
  );
}
