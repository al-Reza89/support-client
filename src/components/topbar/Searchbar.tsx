import { cn } from "@/lib/utils";
import React from "react";

interface SearchBarProps {
  className?: string;
}

const Searchbar = ({ className }: SearchBarProps) => {
  return (
    <div className="w-[80%]">
      <input
        type="text"
        placeholder="Search"
        className={cn(
          "w-full px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-300 dark:focus:ring-blue-500",
          className
        )}
      />
    </div>
  );
};

export default Searchbar;
