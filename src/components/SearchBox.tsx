import { cn } from "@/util/cn";
import React from "react";
import { IoSearch } from "react-icons/io5";

type Props = {
  className?: string;
  //ref: React.RefObject<HTMLInputElement>;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
  onSubmit: React.FormEventHandler<HTMLFormElement> | undefined;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

function SearchBox(props: Props, ref: React.ForwardedRef<HTMLInputElement>) {
  return (
    <form onSubmit={props.onSubmit} className={cn("flex relative items-center justify-center h-10", props.className)}>
      <input
        type="text"
        value={props.value}
        onChange={props.onChange}
        placeholder="Search location..."
        ref={ref}
        autoFocus
        className="px-4 py-2 w-[210px] border border-gray-300 rounded-l-md focus:outline-none focus:border-blue-500 h-full"
      />
      <button className="px-4 py-[9px] bg-blue-500 text-white rounded-r-md focus:outline-none focus:bg-blue-600 h-full">
        <IoSearch />
      </button>
    </form>
  );
}

export default React.forwardRef(SearchBox);
