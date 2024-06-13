import { bufferToHex } from "ethereumjs-util";
import { encrypt } from "@metamask/eth-sig-util";

declare global {
  interface Window {
    ethereum: any;
  }
}

const getPublicKey = async (address: string) => {
  try {
    const publicKey = await window.ethereum.request({
      method: "eth_getEncryptionPublicKey",
      params: [address], // you must have access to the specified account
    });
    return publicKey;
  } catch (error) {
    console.error("Error fetching public key:", error);
  }
};

export const encryptFunc = async (address: string, text: string) => {
  const publicKey = await getPublicKey(address);
  if (publicKey) {
    const encryptedMessage = bufferToHex(
      Buffer.from(
        JSON.stringify(
          encrypt({
            publicKey: publicKey,
            data: text,
            version: "x25519-xsalsa20-poly1305",
          })
        ),
        "utf8"
      )
    );

    return encryptedMessage;
  }
  return null;
};

export const decryptFunc = async (
  address: string,
  encryptedMessage: any
): Promise<string> => {
  const decryptedMessage = await window.ethereum.request({
    method: "eth_decrypt",
    params: [encryptedMessage, address],
  });

  return decryptedMessage;
};
