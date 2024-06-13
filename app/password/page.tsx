"use client";
import { useContext } from "react";
import { ProviderContext } from "@/components/provider";
import { PswRegister } from "@/app/password/psw-register";
import PswDisplay from "@/app/password/psw-display";
import { Lock } from "@/components/assets/Homepage";
import AddPassword from "@/components/AddPassword";

const MyPage = () => {
  const { psws } = useContext(ProviderContext);
  return (
    <main className="flex flex-col w-full h-[93vh] p-6">
      <aside className="w-full p-6 flex flex-col gap-4 relative">
        <div className="flex items-center gap-3">
          <span className="p-2 rounded-[40px] bg-[linear-gradient(180deg,_#17191F_0%,_#21232B_100%)]">
            <Lock />
          </span>
          <p className="text-[#CDE2DB] text-[14px] font-medium">
            No. of Passwords
          </p>
        </div>
        <div className="w-full flex min-[650px]:items-center justify-between flex-col min-[650px]:flex-row gap-2">
          <div className="flex items-baseline gap-3">
            <h1 className="text-[#F1FBF8] text-5xl tracking-[0.096px] font-medium">
              {psws.length}
            </h1>
            <span className="text-[#8783D1] text-sm font-medium">
              Passwords
            </span>
          </div>
          <AddPassword classes="w-[250px] max-w-full flex" />
        </div>
      </aside>
      <PswDisplay psws={psws} />
      <div className="">
        <PswRegister />
      </div>
    </main>
  );
};

export default MyPage;
