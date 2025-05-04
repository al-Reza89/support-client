import React from "react";
import { cn } from "@/lib/utils";

interface HtmlContentProps {
  content: string;
  className?: string;
}

const HtmlContent: React.FC<HtmlContentProps> = ({ content, className }) => {
  if (!content) return null;

  return (
    <div
      className={cn("prose prose-sm max-w-none dark:prose-invert", className)}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default HtmlContent;
