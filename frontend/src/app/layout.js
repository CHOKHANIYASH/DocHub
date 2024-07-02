import AmplifyConfig from "./Amplify";
import { ToastContainer } from "react-toastify";
import { Inter } from "next/font/google";
import "./globals.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import Navbar from "./Navbar";
config.autoAddCss = false;
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-cyan-400`}>
        <AmplifyConfig />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
