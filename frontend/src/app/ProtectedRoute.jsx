import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks/index";
import { toast } from "react-toastify";
export default function ProtectedRoute(Component) {
  return function ProtectedRoute(props) {
    const router = useRouter();
    const isAuthenticated = useAppSelector((state) => state.isAuthenticated);
    useEffect(() => {
      if (!isAuthenticated) {
        toast.error("Please SignIn first", { toastId: "uniqueToastProtected" });
        router.push("/signin");
      }
    }, []);
    return <>{isAuthenticated && <Component {...props} />}</>;
  };
}
