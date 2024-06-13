"use client";

import { useContext, useEffect, useState } from "react";
import { ProviderContext } from "@/components/provider";
import { useAccount } from "wagmi";
import { Separator } from "@/components/ui/separator";
import { Frame, Generate, Lock, ShieldKey } from "@/components/assets/Homepage";
import { cn, generatePassword } from "@/lib/utils";
import Copy from "../public/icons/copy.json";
import LottieAnimation from "@/lib/hoover-animation";
import { toast } from "@/components/ui/use-toast";
import PswDisplay from "./password/psw-display";
import AddPassword, { AddPasswordButton } from "@/components/AddPassword";

const MyPage = () => {
  const [timestamp, setTimestamp] = useState("1y");
  const { isConnected, address } = useAccount();
  const { user, addUser, userData } = useContext(ProviderContext);

  useEffect(() => {
    const fetchData = async () => {
      if (address && isConnected) {
        try {
          if (user.id === undefined) {
            await addUser(address);
          }
          // router.push("/password");
        } catch (error) {
          console.error("Error adding user:", error);
        }
      }
    };
    fetchData();
  }, [isConnected, address]);

  return (
    <div className="px-4 py-6 flex flex-col gap-5">
      <aside className="flex flex-col gap-4 md:flex-row">
        <OverviewCard timestamp={timestamp} setTimestamp={setTimestamp} />
        <GeneratePasswordCard />
      </aside>
      <PswDisplay psws={userData.getPasswordsByPeriod(timestamp)} />
    </div>
  );
};

const timestamps = ["24h", "3d", "1w", "1m", "3m", "1y"];
function OverviewCard({
  timestamp,
  setTimestamp,
}: {
  timestamp: string;
  setTimestamp: (ts: string) => void;
}) {
  const { userData } = useContext(ProviderContext);

  return (
    <div className="rounded-[12px] bg-[#121419] w-full">
      <aside className="w-full p-6 flex flex-col gap-4 relative">
        <div className="flex items-center gap-3">
          <span className="p-2 rounded-[40px] bg-[linear-gradient(180deg,_#17191F_0%,_#21232B_100%)]">
            <Lock />
          </span>
          <p className="text-[#CDE2DB] text-[14px] font-medium">
            No. of Passwords/Notes
          </p>
        </div>
        <div className="w-full flex items-center gap-5">
          <div className="flex items-baseline gap-3">
            <h1 className="text-[#F1FBF8] text-5xl tracking-[0.096px] font-medium">
              {userData.getCounts().passwords}
            </h1>
            <span className="text-[#8783D1] text-sm font-medium">
              Passwords
            </span>
          </div>
          <span className="text-[#F1FBF8] font-medium">/</span>
          <div className="flex items-baseline gap-3">
            <h1 className="text-[#F1FBF8] text-5xl tracking-[0.096px] font-medium">
              {userData.getCounts().notes}
            </h1>
            <span className="text-[#8783D1] text-sm font-medium">Notes</span>
          </div>
        </div>
        <AddPassword classes="absolute top-6 right-6 hidden sm:flex" />
      </aside>
      <Separator />
      <aside className="flex gap-4 flex-col lg:flex-row w-full p-6 lg:items-center lg:justify-between">
        <div className="flex items-center gap-2 flex-wrap transition-all">
          <p className="text-white text-nowrap">Recently added in</p>{" "}
          {timestamps.map((ts) => (
            <span
              className={cn(
                "bg-[#17191F] px-2 py-1 w-12 rounded-[13px] text-center transition-all cursor-pointer hover:bg-[#8783D1] text-[#757575]",
                timestamp === ts && "bg-[#8783D1] text-[#F1FBF8]"
              )}
              onClick={() => setTimestamp(ts)}
            >
              {ts}
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <p>{userData.getCountsByPeriod(timestamp).passwords} Passwords</p>
          <p>{userData.getCountsByPeriod(timestamp).notes} Notes</p>
        </div>
        <AddPassword classes="flex sm:hidden w-[min(250px,100%)] m-auto sm:m-0" />
      </aside>
    </div>
  );
}

function GeneratePasswordCard() {
  const { address } = useAccount();
  const [generatedPassword, setGeneratedPassword] = useState(
    generatePassword()
  );

  async function copyTextToClipboard() {
    try {
      if (navigator.clipboard) {
        document.body.focus();
        await navigator.clipboard.writeText(generatedPassword);
      }
    } catch (error) {
      const readOnlyTextArea = document.createElement("textarea");
      readOnlyTextArea.value = generatedPassword;
      readOnlyTextArea.setAttribute("readonly", "true");
      readOnlyTextArea.style.position = "absolute";
      readOnlyTextArea.style.left = "-9001px";
      document.body.appendChild(readOnlyTextArea);
      readOnlyTextArea.select();
      document.execCommand("copy");
      document.body.removeChild(readOnlyTextArea);
    } finally {
      toast({
        title: `Copied ${generatedPassword} to clipboard`,
      });
    }
  }
  return (
    <div className="genPassCard w-full">
      <section className="flex flex-col gap-4 p-6 relative">
        <h2 className="text-[#F1FBF8] opacity-80 text-lg font-medium">
          Generate Password
        </h2>
        <Frame className="absolute top-0 right-2" />
        <div className="bg-[#121419] rounded-[8px] py-8 px-5 flex items-center justify-center">
          {address ? (
            <span>{generatedPassword}</span>
          ) : (
            <p className="text-[#8783D1] text-xl font-medium">Connect Wallet</p>
          )}
        </div>
        {address && generatedPassword ? (
          <aside className="flex justify-between min-[500px]:items-center flex-col min-[500px]:flex-row gap-3">
            <div className="text-[#7FC6A4] text-sm font-medium flex items-center gap-2">
              <ShieldKey /> Strong Password
            </div>

            <section className="flex gap-2">
              <div className="bg-[#17191F] px-3 py-2 rounded-[13px] text-center transition-all cursor-pointer hover:bg-[#8783D1] text-[#F1FBF8] flex gap-2 items-center">
                Copy{" "}
                <LottieAnimation
                  animationData={Copy}
                  className="ml-2 h-6 w-6 cursor-pointer"
                  onClick={async () => await copyTextToClipboard()}
                />
              </div>
              <div
                onClick={() => setGeneratedPassword(generatePassword())}
                className="bg-[#17191F] px-3 py-2 rounded-[13px] text-center transition-all cursor-pointer hover:bg-[#8783D1] text-[#F1FBF8] flex gap-2 items-center"
              >
                Generate <Generate />
              </div>
            </section>
          </aside>
        ) : (
          <></>
        )}
      </section>
    </div>
  );
}

export default MyPage;
