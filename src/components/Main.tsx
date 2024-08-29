"use client";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "@/components/App";

export default function Main() {
  const queryClient = new QueryClient();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </>
  );
}
