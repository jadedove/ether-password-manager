"use client";
import { useEffect } from "react";
import { useAccount } from "wagmi";

// const result = await metaFetcher("https://hoppscotch.io/");

const MyPage = () => {
  const { isConnected, address } = useAccount();

  useEffect(() => {
    const fetchData = async () => {};
    fetchData();
  }, [isConnected, address]);

  return (
    <main className="flex flex-col items-center justify-center w-full h-[93vh] p-6">
      {isConnected ? (
        <h1>Loading...</h1>
      ) : (
        <>
          <h1 className="mb-6">Please connect your wallet!</h1>
        </>
      )}
    </main>
  );
};

export default MyPage;
