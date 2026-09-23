"use client";

import GlobalLoader from "@/components/common/GlobalLoader";
import { useLoaderStore } from "@/store/loader.store";

export default function LoaderWrapper() {
  const { loading } = useLoaderStore();

  if (!loading) return null;

  return <GlobalLoader />;
}