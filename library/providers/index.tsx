"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

import ConnectKitProvider from "./connectkit";
import DatabaseProvider from "./db";
import WagmiProvider from "./wagmi";

const queryClient = new QueryClient();

const RootProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <DatabaseProvider>
      <WagmiProvider>
        <QueryClientProvider client={queryClient}>
          <ConnectKitProvider>{children}</ConnectKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </DatabaseProvider>
  );
};

export default RootProvider;
