"use client";

import { createContext, useState } from "react";

interface NavProviderContextProps {
  mobileNavbarOpen: boolean;
  setMobileNavbarOpen: (open: boolean) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const NavProviderContext = createContext({} as NavProviderContextProps);

export default function NavProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileNavbarOpen, setMobileNavbarOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <NavProviderContext.Provider
      value={{
        mobileNavbarOpen,
        setMobileNavbarOpen,
        sidebarOpen,
        setSidebarOpen,
      }}
    >
      {children}
    </NavProviderContext.Provider>
  );
}
