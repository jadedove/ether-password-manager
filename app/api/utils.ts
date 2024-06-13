import { NoteInterface, PasswordInterface } from "@/components/provider";
import prisma from "@/lib/prisma";
import { IPFSType } from "@prisma/client";
import axios from "axios";

export const getPasswords = async (address: string) => {
  const passwordsWithCID = await prisma.iPFS.findMany({
    where: {
      userAddress: address,
      type: IPFSType.PASSWORD,
    },
  });
  const cids = passwordsWithCID.map(({ cid }) =>
    axios.get(`https://${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${cid}`)
  );

  const allUserPasswords = await Promise.all(cids).then((passwordsWithCID) => {
    return passwordsWithCID.map((res) => res.data);
  });

  const data: PasswordInterface[] = passwordsWithCID.map((row, index) => {
    return {
      ...allUserPasswords[index],
      id: row.id,
    };
  });
  return data;
};
export const getUserItems = async (address: string) => {
  const itemsWithCID = await prisma.iPFS.findMany({
    where: {
      userAddress: address,
    },
  });
  const cids = itemsWithCID.map(({ cid }) =>
    axios.get(`https://${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${cid}`)
  );

  const allUserItems = await Promise.all(cids).then((itemsWithCID) => {
    return itemsWithCID.map((res) => res.data);
  });

  const data: PasswordInterface[] = itemsWithCID.map((row, index) => {
    return {
      ...allUserItems[index],
      id: row.id,
      type: row.type,
      timestamp: row.createdAt,
    };
  });
  return data;
};
export const getNotes = async (address: string) => {
  const notesWithCID = await prisma.iPFS.findMany({
    where: {
      userAddress: address,
      type: IPFSType.NOTE,
    },
  });
  const cids = notesWithCID.map(({ cid }) =>
    axios.get(`https://${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${cid}`)
  );

  const allUserNotes = await Promise.all(cids).then((passwordsWithCID) => {
    return passwordsWithCID.map((res) => res.data);
  });
  const data: NoteInterface[] = notesWithCID.map((row, index) => {
    return {
      ...allUserNotes[index],
      id: row.id,
    };
  });
  return data;
};

export const getUser = async (address: string) => {
  const user = await prisma.user.findFirst({
    where: {
      address: address,
    },
  });
  return user;
};

export interface PasswordData {
  username?: string;
  ciphertext?: string;
  url?: string;
}

export interface NoteData {
  title?: string;
  ciphertext?: string;
}
export const pinToIPFS = async (
  data: PasswordData | NoteData
): Promise<string | null> => {
  try {
    const ifpsRes = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      data,
      {
        headers: {
          Authorization: `Bearer ${process.env.PINATA_JWT}`,
        },
      }
    );
    const { IpfsHash } = await ifpsRes.data;
    return IpfsHash;
  } catch (error) {
    console.error(error);
    return null;
  }
};
