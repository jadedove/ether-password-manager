"use client";

import useMediaQuery from "@/hooks/useMediaQuery";
import SearchBarIcon from "./assets/Searchbar";
import { cn } from "@/lib/utils";

export default function SearchBar() {
  const isMobile = useMediaQuery("(max-width: 750px)");
  return (
    <div className={cn("relative h-fit w-fit", isMobile && "w-auto")}>
      <input
        type="text"
        placeholder="Search"
        className={cn(
          "rounded-[12px] border border-[#303C4E] flex w-[min(100%, 300px)] p-3 justify-between items-center searchbar placeholder:text-[#CDE2DB] text-white",
          isMobile && "w-full"
        )}
      />
      <SearchBarIcon className="absolute right-4 top-4" />
    </div>
  );
}
