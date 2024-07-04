"use client";
import { signOut } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { setIsAuthenticated } from "@/redux/slices/isAuthenticatedSlice";
import { useAppDispatch } from "@/redux/hooks/index";

export default function SignOut() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const handleSignOut = async () => {
    try {
      await signOut();
      dispatch(setIsAuthenticated(false));
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
