"use client";

import { useRouter, usePathname } from "next/navigation";

import {
  Notes,
  Overview,
  Passkeys,
  Password,
  Settings,
} from "./assets/Sidebar";
import { useContext } from "react";
import { NavProviderContext } from "./NavProviders";
import useMediaQuery from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import SearchBar from "./Searchbar";
import { ConnectButtonCustom } from "./ConnectButton";
import Link from "next/link";

const paths = [
  {
    path: "/",
    icon: <Overview />,
    title: "Overview",
  },
  {
    path: "/password",
    icon: <Password />,
    title: "Passwords",
  },
  {
    path: "/passkeys",
    icon: <Passkeys />,
    title: "Passkeys",
  },
  {
    path: "/note",
    icon: <Notes />,
    title: "Secure Notes",
  },
  {
    path: "/settings",
    icon: <Settings />,
    title: "Settings",
  },
];

function MainSidebar() {
  const { sidebarOpen, setSidebarOpen } = useContext(NavProviderContext);
  const pathname = usePathname();
  const isTablet = useMediaQuery("(min-width: 1200px)");
  return (
    <aside
      className={cn(
        "min-h-screen p-4 bg-[#121419] border-r-[rgba(48,_60,_78,_0.50)] border-r transition-all",
        sidebarOpen ? "min-w-[250px]" : "min-w-[96px]",
        isTablet && "min-w-[250px]"
      )}
      onMouseEnter={() => setSidebarOpen(true)}
      onMouseLeave={() => setSidebarOpen(false)}
    >
      <div className="transition-all flex gap-5 flex-col items-center">
        {" "}
        {paths.map(({ path, icon, title }) => (
          <Link
            key={path}
            className={cn(
              "flex items-center gap-3 p-4 cursor-pointer transition-all",
              pathname === path
                ? "rounded-[12px] border border-[#303C4E] searchbar"
                : "",
              sidebarOpen ? "w-full" : "w-fit",
              isTablet && "w-full"
            )}
            href={path}
          >
            {icon}
            {(sidebarOpen || isTablet) && (
              <span className="text-white">{title}</span>
            )}
          </Link>
        ))}
      </div>
    </aside>
  );
}

function MobileSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <nav className="absolute w-screen h-screen top-0 z-10 left-0 right-0 bg-[#17191F] transition-all">
      <aside className="max-w-[360px] p-5 m-auto flex flex-col gap-6">
        <SearchBar />
        <ConnectButtonCustom />{" "}
        <div className="transition-all flex gap-5 flex-col items-center">
          {" "}
          {paths.map(({ path, icon, title }) => (
            <div
              key={path}
              className={cn(
                "flex items-center gap-3 p-4 cursor-pointer transition-all w-full",
                pathname === path
                  ? "rounded-[12px] border border-[#303C4E] searchbar"
                  : ""
              )}
              onClick={() => router.push(path)}
            >
              {icon}
              <span className="text-white">{title}</span>
            </div>
          ))}
        </div>
      </aside>
    </nav>
  );
}

export default function Sidebar() {
  const isMobile = useMediaQuery("(max-width: 810px)");
  const { mobileNavbarOpen } = useContext(NavProviderContext);
  return (
    <>
      {!isMobile ? (
        <MainSidebar />
      ) : mobileNavbarOpen ? (
        <MobileSidebar />
      ) : (
        <></>
      )}
    </>
  );
  // return isMobile && mobileNavbarOpen ? <MobileSidebar /> : <MainSidebar />;
}
