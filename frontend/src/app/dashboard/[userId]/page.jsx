"use client";
// Protected route to be added
import "aws-amplify/auth/enable-oauth-listener";
import { useEffect, useState } from "react";
import axios from "axios";
import { fetchAuthSession } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { CardBody, CardContainer, CardItem } from "../../../components/ui/card";
import Link from "next/link";
import ProtectedRoute from "../../ProtectedRoute";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
function Dashboard() {
  const router = useRouter();
  const url = process.env.NEXT_PUBLIC_SERVER_URL;
  const [userId, setUserId] = useState(null);
  const [accessToken, setAccessToken] = useState("");
  const [documents, setDocuments] = useState([]);
  useEffect(() => {
    fetchAuthSession()
      .then((session) => {
        setUserId(session.userSub);
        const accessTokenString = session.tokens.accessToken.toString();
        setAccessToken(accessTokenString);
        const response = axios
          .get(`${url}/docs/user/${session.userSub}`, {
            headers: {
              access_token: accessTokenString,
            },
          })
          .then((response) => {
            setDocuments(response.data.data);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const handleAddDocument = async (e) => {
    try {
      const response = await axios.post(
        `${url}/docs/user/${userId}/create`,
        {},
        {
          headers: {
            access_token: accessToken,
          },
        }
      );
      toast.success("Document created Successfully", {
        toastId: "uniqueToastDashboard",
      });
      router.push(`/docs/${response.data.data.id}`);
    } catch (err) {
      console.log("err", err);
      toast.error("Cannot Add Document, please try again later", {
        toastId: "uniqueToastDashboard",
      });
    }
  };
  const handleDeleteDocument = async (docId) => {
    try {
      const response = await axios
        .post(
          `${url}/docs/${docId}/delete`,
          { userId },
          {
            headers: {
              access_token: accessToken,
            },
          }
        )
        .then(() => {
          const newDocuments = documents.filter((document) => {
            if (document.id !== docId) return document;
          });
          setDocuments(newDocuments);
        });
      toast.success("Document deleted Successfully", {
        toastId: "uniqueToastDashboard",
      });
    } catch (err) {
      console.log("err", err);
      toast.error("Cannot delete Document, please try again later", {
        toastId: "uniqueToastDashboard",
      });
    }
  };
  return (
    <>
      <button
        className="px-4 py-2 rounded-md border mt-2 ml-2 border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
        onClick={handleAddDocument}
      >
        Add Document
      </button>
      <div className="grid grid-cols-1 gap-4 m-6 md:grid-cols-4 md:gap-10 md:m-10">
        {documents.length !== 0 &&
          documents.map((item, i) => (
            <CardContainer key={i} className="mt-10 ml-5 inter-var">
              <CardBody className="bg-gray-50 relative group/card border-black/[0.1]  rounded-xl p-6 border  ">
                <CardItem
                  translateZ="50"
                  className="w-full font-bold text-right text-md text-neutral-600"
                >
                  <FontAwesomeIcon
                    icon={faTrashCan}
                    onClick={() => handleDeleteDocument(item.id)}
                    className="cursor-pointer"
                  />
                </CardItem>
                <CardItem
                  translateZ="50"
                  className="text-lg font-bold text-neutral-600"
                >
                  <p>{`${item.name}`}</p>
                </CardItem>
                {/* <CardItem translateZ="100" className="mt-4">
                  <Image
                    src={item}
                    height="250"
                    width="250"
                    className="object-cover rounded-xl group-hover/card:shadow-xl"
                    alt="thumbnail"
                  />
                </CardItem> */}
                <div className="flex flex-row items-center justify-between mt-10">
                  <Link
                    href={`/docs/${item.id}`}
                    className="px-4 py-2 rounded-md border border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
                  >
                    Open Document
                  </Link>
                </div>
              </CardBody>
            </CardContainer>
          ))}
        {documents.length === 0 && (
          <h1 className="text-2xl font-bold text-neutral-800">No Documents</h1>
        )}
      </div>
    </>
  );
}
export default ProtectedRoute(Dashboard);
