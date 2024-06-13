"use client";
import LoopAnimation from "../../lib/loop-animation";

import Checkmark from "../../public/icons/checkmark.json";
import Error from "../../public/icons/error.json";

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
import { ProviderContext } from "@/components/provider";
import { useToast } from "@/components/ui/use-toast";

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
import axios from "axios";
import { useAccount } from "wagmi";

import { Textarea } from "@/components/ui/textarea";
import { encryptFunc } from "@/components/encryptDecrypt";

const FormSchema = z.object({
  name: z.string({ required_error: "Name is required" }),
  note: z
    .string({ required_error: "Note is required" })
    .max(2048, { message: "Note can't be over than 2048 characters" }),
});

interface NoteRegisterProps {
  setNotes: (decryptedDataArray: any) => void;
}

const NoteRegister: React.FC<NoteRegisterProps> = ({ setNotes }) => {
  const { toast } = useToast();
  const { address } = useAccount();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      note: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      toast({
        title: "Your note",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4 flex justify-center items-start flex-col space-y-2">
            <div>
              <span className="font-extrabold">Title:</span> {data.name}
            </div>
            <div>
              <span className="font-extrabold">Note:</span> {data.note}
            </div>
          </pre>
        ),
      });
      const ciphertext = await encryptFunc(address!, data.note);
      const res = await axios.post(`/api/${address}/note`, {
        title: data.name,
        ciphertext,
      });
      setNotes(res.data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Note
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <AlertDialogHeader>
              <AlertDialogTitle>Enter your note</AlertDialogTitle>
              <AlertDialogDescription>
                Input your informations
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="grid space-y-4 mt-4 mb-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Add a title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Add text" {...field} />
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
};

export default NoteRegister;
