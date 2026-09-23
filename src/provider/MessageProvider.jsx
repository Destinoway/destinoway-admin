"use client";

import { setMessageInstance } from "@/lib/antdMessage";
import { App } from "antd";
import { useEffect } from "react";

export default function MessageProvider({ children }) {
  const { message } = App.useApp();

  useEffect(() => {
    setMessageInstance(message);
  }, [message]);

  return children;
}
