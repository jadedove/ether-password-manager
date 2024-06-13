"use client";

import NoteRegister from "@/app/note/note-register";
import { useEffect, useState } from "react";
import NoteDisplay from "@/app/note/note-display";
import { useAccount } from "wagmi";
import axios from "axios";
import { decryptFunc } from "@/components/encryptDecrypt";
import { NoteInterface } from "@/components/provider";
import { set } from "react-hook-form";

/* 
 Note on this page
  @dev: This page is a work in progress. It is not currently functional.
  @issue: The data is not being decrypted.
  @solution: We get back note as an encrypted text, there should be a button that you click to reveal the content of each note
*/

const MyPage = () => {
  const [notes, setNotes] = useState<NoteInterface[]>();
  const [loading, setLoading] = useState(false);
  const { address } = useAccount();
  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      if (address) {
        const res = await axios.get(`/api/${address}/note`);
        setNotes(res.data);
      }
      setLoading(false);
    };

    fetchNotes();
  }, [address]);

  const deleteRow = async (cid: number) => {
    setLoading(true);
    const res = await axios.delete(`/api/${cid}/note`);
    setNotes(res.data);
    setLoading(false);
  };
  return (
    <main className="flex flex-col w-full h-[93vh] p-6">
      <div className="">
        <NoteRegister setNotes={setNotes} />
      </div>
      <NoteDisplay notes={notes} loading={loading} deleteRow={deleteRow} />
    </main>
  );
};

export default MyPage;
