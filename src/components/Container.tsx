import { cn } from "@/util/cn";
import React from "react";

export default function Container(props: React.HTMLProps<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        "flex py-4 w-full bg-slate-600/90 text-white border-transparent rounded-xl shadow-md",
        props.className
      )}
    />
  );
}
