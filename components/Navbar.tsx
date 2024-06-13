"use client";

import useMediaQuery from "@/hooks/useMediaQuery";
import Logo from "./assets/Logo";
import { CloseMenu, Menu } from "./assets/Hamburger";
import { useContext } from "react";
import { NavProviderContext } from "./NavProviders";
import SearchBar from "./Searchbar";
import { cn } from "@/lib/utils";
import { ConnectButtonCustom } from "./ConnectButton";

export default function Navbar() {
  const isMobile = useMediaQuery("(max-width: 810px)");
  const isTablet = useMediaQuery("(min-width: 1200px)");
  const { mobileNavbarOpen, sidebarOpen } = useContext(NavProviderContext);

  const dynamicWidth = sidebarOpen
    ? `w-[calc(100% - 250px)]`
    : `w-[calc(100% - 96px)]`;

  return (
    <nav>
      {isMobile ? (
        <div className="flex justify-between items-center p-4 text-white w-full nav">
          <div className="flex gap-2 items-center">
            <Logo />
            <h1 className="text-white text-base">ETH Password Encrypt</h1>
          </div>
          <div className="flex p-4 items-center justify-center rounded-[14px] border-[1px] border-[solid] border-[#303C4E] bg-[linear-gradient(180deg,_#17191F_0%,_#21232B_100%)]">
            {mobileNavbarOpen ? <CloseMenu /> : <Menu />}
          </div>
        </div>
      ) : (
        <aside className="flex w-full">
          <div
            className={cn(
              "flex items-center p-4 text-white w-fit bg-[#121419] border-r-[rgba(48,_60,_78,_0.50)] border-r justify-center"
              // sidebarOpen ? "w-[250px]" : "w-[96px]"
            )}
            style={{
              width: sidebarOpen || isTablet ? "250px" : "96px",
            }}
          >
            <div className="flex gap-2 items-center">
              <Logo />
              {(isTablet || sidebarOpen) && (
                <h1 className="text-white text-base">ETH Password Encrypt</h1>
              )}{" "}
            </div>
          </div>
          <div
            className={cn(
              "flex justify-between items-center p-4 mr-auto nav transition-all"
              // dynamicWidth,
              // isTablet && "w-[calc(100% - 250px)]"
            )}
            style={{
              width:
                sidebarOpen || isTablet
                  ? "calc(100% - 250px)"
                  : "calc(100% - 96px)",
            }}
          >
            <SearchBar />
            <div>
              <ConnectButtonCustom />
            </div>
          </div>
        </aside>
      )}
    </nav>
  );
}
