"use client";
import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useAccount } from "wagmi";
import { encryptFunc } from "./encryptDecrypt";

export interface PasswordInterface {
  id: number;
  url: string;
  username: string;
  ciphertext: string;
  type: "PASSWORD" | "NOTE";
  timestamp: string;
}
export interface NoteInterface {
  id: number;
  title: string;
  ciphertext: string;
  type: "PASSWORD" | "NOTE";
  timestamp: string;
}

interface User {
  address: string;
  id?: number;
  createdAt?: Date;
}
interface ProviderContextProps {
  user: User;
  psws: PasswordInterface[];
  addUser: (address: string) => Promise<void>;
  addPsw: (url: string, username: string, password: string) => Promise<void>;
  deletePsw: (pswId: number) => Promise<void>;
  editPsw: (
    pswId: number,
    url: string,
    username: string,
    password: string
  ) => Promise<void>;
  userData: UserData;
}

export const ProviderContext = createContext<ProviderContextProps>(
  {} as ProviderContextProps
);

export default function Provider({ children }: { children: React.ReactNode }) {
  const { address } = useAccount();
  const [psws, setPsws] = useState<PasswordInterface[]>([]);
  const [userData, setUserData] = useState<UserData>(new NullUserData());
  const [user, setUser] = useState<User>({ address: address || "" });

  //Getters functions
  const pswds = async (): Promise<PasswordInterface[]> => {
    try {
      if (!address) return [];

      const response = await axios.get(`/api/${address}/psw`);
      if (response.status === 200) {
        const passwords = response.data;
        return passwords;
      } else return [];
    } catch (error) {
      console.error("Error fetching passwords:", error);
      return [];
    }
  };

  const userDetails = async (): Promise<User> => {
    try {
      const response = await axios.get(`/api/${address}/user`);
      if (response.status === 200) {
        const user = response.data;
        return user;
      } else return { address: "" };
    } catch (error) {
      console.error("Error fetching details:", error);
      return { address: "" };
    }
  };

  const getUserData = async () => {
    try {
      const response = await axios.patch(`/api/${address}/user`);
      if (response.status === 200) {
        const data = response.data;
        const userData = new UserData(data);
        setUserData(userData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchData = async () => {
    if (address) {
      try {
        const userData = await userDetails();
        setUser(userData);
        const data = await pswds();
        setPsws(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  useEffect(() => {
    fetchData();
    getUserData();
  }, [address]);

  //Post functions
  const addUser = async (_address: string) => {
    const userDetail = await userDetails();
    if (userDetail.id) {
      setUser(userDetail);
      return;
    }

    await axios.post(`/api/${address}/user`).then((response) => {
      const newData = response.data;
      setUser(newData);
    });
  };

  const addPsw = async (_url: string, _username: string, _password: string) => {
    const ciphertext = await encryptFunc(address!, _password);
    const pswData = {
      url: _url,
      username: _username,
      ciphertext: ciphertext,
      userAddress: address,
    };

    await axios
      .post(`/api/${address}/psw`, pswData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const newData = response.data;
        setPsws(newData);
      });
  };

  const deletePsw = async (pswId: number) => {
    await axios.delete(`/api/${pswId}/psw`);
    await fetchData();
  };

  const editPsw = async (
    pswId: number,
    _url: string,
    _username: string,
    _password: string
  ) => {
    const ciphertext = await encryptFunc(address!, _password);
    await axios.put(`/api/${pswId}/psw`, {
      url: _url,
      username: _username,
      ciphertext: ciphertext,
    });
  };

  return (
    <ProviderContext.Provider
      value={{
        user,
        psws,
        addUser,
        addPsw,
        deletePsw,
        editPsw,
        userData,
      }}
    >
      {children}
    </ProviderContext.Provider>
  );
}

class UserData {
  data: PasswordInterface[] | NoteInterface[];
  constructor(data: PasswordInterface[] | NoteInterface[]) {
    this.data = data;
  }

  getCounts() {
    const [passwords, notes] = this.data.reduce(
      (acc, curr) => {
        if (curr.type === "PASSWORD") {
          acc[0]++;
        } else {
          acc[1]++;
        }
        return acc;
      },
      [0, 0]
    );
    return { passwords, notes };
  }

  filterDataByPeriod(period: string) {
    const pastDate = calculatePastDate(period);
    return this.data.filter((item) => new Date(item.timestamp) >= pastDate);
  }

  getCountsByPeriod(period: string) {
    const data = this.filterDataByPeriod(period);
    const [passwords, notes] = data.reduce(
      (acc, curr) => {
        if (curr.type === "PASSWORD") {
          acc[0]++;
        } else {
          acc[1]++;
        }
        return acc;
      },
      [0, 0]
    );
    return { passwords, notes };
  }

  getPasswordsByPeriod(period: string) {
    const data = this.filterDataByPeriod(period);
    return data.filter(
      (item) => item.type === "PASSWORD"
    ) as PasswordInterface[];
  }
}
class NullUserData {
  data: PasswordInterface[] | NoteInterface[];
  constructor() {
    this.data = [];
  }
  getCounts() {
    return { passwords: 0, notes: 0 };
  }

  filterDataByPeriod(period: string) {
    return [];
  }

  getCountsByPeriod(period: string) {
    return { passwords: 0, notes: 0 };
  }

  getPasswordsByPeriod(period: string) {
    return [];
  }
}

function calculatePastDate(period: string) {
  const now = new Date();
  const value = parseInt(period.slice(0, -1));
  const unit = period.slice(-1);

  switch (unit) {
    case "h":
      now.setHours(now.getHours() - value);
      break;
    case "d":
      now.setDate(now.getDate() - value);
      break;
    case "w":
      now.setDate(now.getDate() - value * 7);
      break;
    case "m":
      now.setMonth(now.getMonth() - value);
      break;
    case "y":
      now.setFullYear(now.getFullYear() - value);
      break;
    default:
      throw new Error("Invalid period unit");
  }
  return now;
}
