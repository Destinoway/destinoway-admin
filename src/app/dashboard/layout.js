"use client";

import { useAuthStore } from "@/modules/auth/store/auth.store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import MainLayout from "../../components/layout/MainLayout";

export default function DashboardLayout({ children }) {
console.log("Dashboard Layout Render");
  const { isAuthenticated, isLoading } = useAuthStore();
  console.log({
  isAuthenticated,
  isLoading,
});
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) return <div>Checking auth...</div>;



  if (!isAuthenticated) return null;
  return <MainLayout>{children}</MainLayout>;
}
