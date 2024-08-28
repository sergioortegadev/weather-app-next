import { cn } from "@/util/cn";
import React from "react";

export default function Container(props: React.HTMLProps<HTMLDivElement>) {
  return <div {...props} className={cn("flex py-4 w-full bg-white border rounded-xl shadow-sm", props.className)} />;
}
