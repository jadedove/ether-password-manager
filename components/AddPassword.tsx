"use client";

import { cn } from "@/lib/utils";
import { Frame, Password } from "./assets/Homepage";
import { useState, useContext } from "react";
import LoopAnimation from "@/lib/loop-animation";

import Checkmark from "../public/icons/checkmark.json";
import Refresh from "../public/icons/refresh.json";
import Error from "../public/icons/error.json";
import Copy from "../public/icons/copy.json";
import imageIcon from "../public/imageIcon.svg"
import successSymb from "../public/smbSuccess.png"
import symbol from '../public/symbol.svg'
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

import { Input } from "./ui/input";
import { toast } from "./ui/use-toast";

import { ProviderContext } from "./provider";

const FormSchema = z
  .object({
    website: z.string().url({ message: "Invalid website URL" }),
    username: z.string().min(2, { message: "Username is required" }).optional(),
    email: z.string().email({ message: "Invalid email address" }).optional(),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" }),
  })
  .refine((data) => data.username || data.email, {
    message: "Either username or email must be provided",
    path: ["username"], // or "email" or an empty array if you don't want the error to be associated with a specific field
  });

export default function AddPassword({ classes }: { classes: string }) {
  const { addPsw } = useContext(ProviderContext);
  const [successData, setSuccessData] = useState<any>();
  const [modal, setModal] = useState(false)
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      website: "",
      username: "",
      password: "",
      email: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    let username = data.username ? data.username : data.email!;
    //  await addPsw(data.website, username, data.password);
    setSuccessData(data);
    setModal(true)
  }

  const handleModalClose = () => {
    setModal(false)
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className={cn("p-0 rounded-[12px]", classes)}>
          <AddPasswordButton classes={classes} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-full modal modal-dialog">
        {
          !modal ? (<Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
              <AlertDialogHeader >
                <Image src={symbol} alt="image icon" className="absolute right-0" />
                <div className="flex flex-col items-center justify-center pt-2 pb-2">
                  <AlertDialogTitle>Add New Password</AlertDialogTitle>
                  <div className="flex items-center justify-between w-full">
                    <div className="h-[1px] w-[80px] bg-[white] opacity-30  mt-4"></div>
                    <AlertDialogDescription className="pt-4 flex items-center justify-center">
                      Website Details
                    </AlertDialogDescription>
                    <div className="h-[1px] w-[80px] bg-[white] opacity-30  mt-4"></div>
                  </div>
                  
                </div>

              </AlertDialogHeader>
              <div className="grid space-y-4 mt-4 mb-6">
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between">
                        <FormLabel>Website address</FormLabel>
                        <FormLabel className="text-[#7FC6A4]">*Required</FormLabel>
                      </div>
                      <FormControl>
                        <Input placeholder="Add url" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="websitename"
                  render={({ field }) => (
                    <FormItem className="flex gap-2">
                      <Image src={imageIcon} alt="image-icon" width={44} height={44}/>
                      
                      <FormControl className="pt-7 w-full">
                        <div className="flex flex-col justify-between items-left space-y-5">
                          <Input placeholder="website name" {...field} />
                          <div className="flex justify-center items-center w-full h-4"></div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center justify-between ">
                  <div className="h-[1px] w-[80px] md:w-[150px] bg-[white] opacity-30"></div>
                  <FormLabel className="flex items-center justify-center">Login Details</FormLabel>
                  <div className="h-[1px] w-[80px] md:w-[150px] bg-[white] opacity-30"></div>
                </div>
                
              </div>
              <div className="grid space-y-4 mt-4 mb-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="login email address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormLabel className="text-[#7FC6A4]">or</FormLabel>
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Add username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between">
                        <FormLabel>Password</FormLabel>
                        <FormLabel className="text-[#8783D1] flex gap-1"><Password className="w-[16px] h-[16px]" />Generate Password</FormLabel>
                      </div>

                      <FormControl>
                        <div className="flex flex-col justify-center items-left space-y-5">
                          <Input placeholder="Add password" {...field} />
                          <div className="flex justify-center items-center w-full h-4"></div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <AlertDialogFooter className="md:block flex gap-2">
                <AlertDialogCancel className="pl-2 border border-[#FFFFFF12] text-[#CDE2DB] bg-[#303C4E] hover:text-[white] w-full">
                  Cancel
                </AlertDialogCancel>
                <button type="submit" className="pl-2 bg-[#17191F] border border-[#FFFFFF12] text-[#CDE2DB] hover:bg-[#6F58C9] hover:text-[white] rounded-[6px] text-center w-full">
                  Add new password
                </button>
              </AlertDialogFooter>
            </form>
          </Form>) : (<div className="flex flex-col w-full relative">
            <div className="flex justify-between">
              <div></div>
            <AlertDialogCancel className="flex flex-row-reverse right-4 text-white text-[16px] text-[#CDE2DB] font-cursive font-bold border-none bg-transparent w-[15px] h-[15px]" onClick={handleModalClose}> X </AlertDialogCancel>
            </div>
             <div className="flex flex-col items-center justify-center mt-8">
              <Image src="/smbSuccess.png" alt="unknown" width={80} height={80}/>
              <p className="text-[white] text-[24px] font-weight-500 text-center md:pt-6 pt-8">Password added Successfuly</p>
            </div>
            <div className="md:pt-12 pt-6 flex items-center justify-center">
              <pre className="mt-2 w-[400px] rounded-md bg-slate-950 p-4 flex justify-center items-start flex-col space-y-2">
                <div>
                  <span className="font-extrabold">Website:</span> {successData ? successData.website : ''}
                </div>
                <div>
                  <span className="font-extrabold">Username:</span> {successData ? successData.username : ''}
                </div>
                <div>
                  <span className="font-extrabold">Password:</span> {successData ? successData.password : ''}
                </div>
              </pre>
            </div>
          </div>)
        }
      </AlertDialogContent>

    </AlertDialog>
  );
}

export function AddPasswordButton({ classes }: { classes: string }) {
  return (
    <div
      className={cn(
        "items-center gap-2 rounded-[12px] border-[2px] border-[rgba(255,255,255,0.07)] bg-[#6F58C9] backdrop-filter backdrop-blur-[10px] py-3 px-6 cursor-pointer",
        classes
      )}
    >
      <p>Add New Password</p>
      <Password />
    </div>
  );
}
