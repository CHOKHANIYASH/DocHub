"use client";
import { signOut } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
export default function SignOut() {
  const router = useRouter();
  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signout successful", { toastId: "uniqueToastSignout" });
    } catch (err) {
      toast.error(err.message, { toastId: "uniqueToastSignout" });
      console.log(err);
    }
    router.push("/login");
  };
  handleSignOut();
  return null;
}
