"use client";
import { useState, useContext } from "react";
import LoopAnimation from "../../lib/loop-animation";

import Checkmark from "../../public/icons/checkmark.json";
import Refresh from "../../public/icons/refresh.json";
import Error from "../../public/icons/error.json";
import Copy from "../../public/icons/copy.json";

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
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
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
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PlusIcon, CheckIcon } from "@radix-ui/react-icons";
import { toast } from "@/components/ui/use-toast";

import { ProviderContext } from "@/components/provider";

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

export function PswRegister() {
  const { addPsw } = useContext(ProviderContext);
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
    await addPsw(data.website, username, data.password);
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4 flex justify-center items-start flex-col space-y-2">
          <div>
            <span className="font-extrabold">Website:</span> {data.website}
          </div>
          <div>
            <span className="font-extrabold">Username:</span> {data.username}
          </div>
          <div>
            <span className="font-extrabold">Password:</span> {data.password}
          </div>
        </pre>
      ),
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Password
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <AlertDialogHeader>
              <AlertDialogTitle>Enter your password</AlertDialogTitle>
              <AlertDialogDescription>
                Input your information
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="grid space-y-4 mt-4 mb-6">
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Web Site</FormLabel>
                    <FormControl>
                      <Input placeholder="Add url" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                    <FormLabel>Password</FormLabel>
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
            <AlertDialogFooter>
              <AlertDialogCancel className="pl-2">
                <LoopAnimation animationData={Error} className="mr-1 h-6 w-6" />
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction type="submit" className="pl-2">
                <LoopAnimation
                  animationData={Checkmark}
                  className="mr-1 h-6 w-6"
                />
                Save changes
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
