import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Provider from "@/components/provider";
import Web3Providers from "@/components/web3.provider";
import { Toaster } from "@/components/ui/toaster";
import "@rainbow-me/rainbowkit/styles.css";
import Navbar from "@/components/Navbar";
import NavProviders from "@/components/NavProviders";
import Sidebar from "@/components/Sidebar";
// import { AddPasswordModal } from "@/components/AddPassword";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ether-password-manager",
  description: "A one stop solution for all your sensitive data",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} relative`}>
        <Web3Providers>
          <Provider>
            <NavProviders>
              {/* <AddPasswordModal /> */}
              <Navbar />
              <div className="flex w-full relative">
                <Sidebar />
                <main className="bg-[#17191F] w-full">{children}</main>
              </div>
              <Toaster />
            </NavProviders>
          </Provider>
        </Web3Providers>
      </body>
    </html>
  );
}
