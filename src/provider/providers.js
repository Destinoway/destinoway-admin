"use client";

import { ThemeProviderCustom } from "@/context/ThemeContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App as AntdApp } from "antd"; // ⭐ ADD
import { useState } from "react";
import MessageProvider from "./MessageProvider";

export default function Providers({ children }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ThemeProviderCustom>
      <QueryClientProvider client={queryClient}>
        <AntdApp>
          {" "}
          {/* ⭐ IMPORTANT */}
          <MessageProvider>{children}</MessageProvider>
        </AntdApp>
      </QueryClientProvider>
    </ThemeProviderCustom>
  );
}
