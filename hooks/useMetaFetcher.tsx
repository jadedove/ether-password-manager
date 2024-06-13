"use client";

import { useState, useEffect } from "react";
import axios from "axios";

interface Metadata {
  title: string;
  image: string | undefined;
  logo: string;
}

// Define a generic type parameter T
const useMetaFetcher = (url: string) => {
  const [data, setData] = useState<Metadata>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(`api/meta?url=${url}`);
        if (result.status === 200) {
          setData(result.data);
        } else {
          setError(true);
        }
      } catch (error) {
        let err = error as Error;
        console.log(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [url]);

  return { data, loading, error };
};

export default useMetaFetcher;
