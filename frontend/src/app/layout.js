import AmplifyConfig from "./Amplify";
import { ToastContainer } from "react-toastify";
import { Inter } from "next/font/google";
import "./globals.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import Navbar from "./Navbar";
import ReduxProvider from "./ReduxProvider";
config.autoAddCss = false;
const inter = Inter({ subsets: ["latin"] });
export const metadata = {
  title: "DocHub",
  description: "A perfect place to create and share documents",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-100  bg-grid-black/[0.2]`}>
        <ReduxProvider>
          <AmplifyConfig />
          <Navbar />
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
