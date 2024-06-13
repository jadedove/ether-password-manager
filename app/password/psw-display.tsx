"use client";
import { PasswordInterface } from "@/components/provider";
import HooverAnimation from "../../lib/hoover-animation";
import Copy from "../../public/icons/copy.json";

import { useAccount } from "wagmi";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Drawer } from "@/components/ui/drawer";
import { toast } from "@/components/ui/use-toast";
import { decryptFunc } from "@/components/encryptDecrypt";
import MorePopover from "./More";
import Image from "next/image";
import useMetaFetcher from "@/hooks/useMetaFetcher";
import Link from "next/link";
import NoCell from "./NoCell";
import AddPassword from "@/components/AddPassword";

const PswDisplay = ({ psws }: { psws: PasswordInterface[] }) => {
  const { address } = useAccount();

  async function copyTextToClipboard(text: string) {
    const password = await decryptFunc(address!, text);

    try {
      if (navigator.clipboard) {
        document.body.focus();
        await navigator.clipboard.writeText(password);
      }
    } catch (error) {
      const readOnlyTextArea = document.createElement("textarea");
      readOnlyTextArea.value = password;
      readOnlyTextArea.setAttribute("readonly", "true");
      readOnlyTextArea.style.position = "absolute";
      readOnlyTextArea.style.left = "-9001px";
      document.body.appendChild(readOnlyTextArea);
      readOnlyTextArea.select();
      document.execCommand("copy");
      document.body.removeChild(readOnlyTextArea);
    } finally {
      toast({
        title: "Copied password to clipboard",
      });
    }
  }

  return (
    <div className="flex">
      <Table className="overflow-hidden rounded-[8px]">
        <TableCaption>
          {psws.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-6 w-full gap-4">
              <NoCell />
              <h3>No Passwords</h3>
              <AddPassword classes="text-white flex" />
            </div>
          ) : (
            "All your passwords"
          )}
        </TableCaption>
        <TableHeader className="bg-[#0C0D10]">
          <TableRow>
            <TableHead>App</TableHead>
            <TableHead>Username/Email</TableHead>
            <TableHead>Password</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {psws.map((psw, index) => (
            <Drawer key={index}>
              <TableRow>
                <TableCell>
                  <WebView url={psw.url} />
                </TableCell>
                <TableCell>
                  <div className="flex justify-start items-center">
                    {psw.username}
                    <HooverAnimation
                      animationData={Copy}
                      className="ml-2 h-6 w-6 cursor-pointer"
                      onClick={() => {
                        navigator.clipboard.writeText(psw.username);
                        toast({
                          title: "Copied username to clipboard",
                        });
                      }}
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex justify-start items-center">
                    <span className="mx-2 pt-2">
                      <h1> *********** </h1>
                    </span>
                    <HooverAnimation
                      animationData={Copy}
                      className="ml-2 h-6 w-6 cursor-pointer"
                      onClick={async () =>
                        await copyTextToClipboard(psw.ciphertext)
                      }
                    />
                  </div>
                </TableCell>
                <TableCell className="flex items-center justify-end p-0">
                  {/* */}
                  <MorePopover id={psw.id} />
                </TableCell>
              </TableRow>
            </Drawer>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PswDisplay;

interface WebViewProps {
  url: string;
}

const WebView: React.FC<WebViewProps> = ({ url }) => {
  const { loading, data, error } = useMetaFetcher(url);

  if (loading) {
    return (
      <Link className="flex items-center justify-center w-full" href={url}>
        <Image
          src="/loading.svg"
          alt="loading"
          layout="fill"
          objectFit="contain"
        />
        <p>{url}</p>
      </Link>
    );
  }

  if (error || !data) {
    return (
      <Link href={url} className="flex items-center justify-center w-full">
        <Image src="/Logo.svg" alt="unknown" width={25} height={25} />
        <div className="flex flex-col gap-1">
          <h2>Unknown</h2>
          <p>{url}</p>
        </div>
      </Link>
    );
  }

  const imageSrc = data.image ?? data.logo ?? "../../public/Logo.svg";

  return (
    <Link href={url} className="flex items-center gap-2">
      <img
        src={imageSrc}
        alt={data.title}
        width={25}
        height={25}
        className="rounded-full object-cover"
      />
      <div>
        <h2>{data.title}</h2>
        <p>{url}</p>
      </div>
    </Link>
  );
};
