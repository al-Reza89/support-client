"use client";

import React, { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import ReactMarkdown from "react-markdown";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link as LinkIcon,
} from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import "./markdown-editor.css";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  height?: string;
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Type here...",
  className,
  height = "min-h-[200px]",
}: MarkdownEditorProps) {
  const [editorText, setEditorText] = useState(value);
  const [showPreview, setShowPreview] = useState(false);
  const [textareaRef, setTextareaRef] = useState<HTMLTextAreaElement | null>(
    null
  );

  // Sync external value changes
  useEffect(() => {
    if (value !== editorText) {
      setEditorText(value);
    }
  }, [value]);

  // Sync internal text to onChange
  const handleTextChange = (newText: string) => {
    setEditorText(newText);
    onChange(newText);
  };

  const insertMarkdown = (markdownSymbols: string) => {
    if (!textareaRef) return;

    const start = textareaRef.selectionStart;
    const end = textareaRef.selectionEnd;
    const text = editorText;

    if (start === end) {
      // No text selected, just insert the symbols
      const newText = `${text.slice(
        0,
        start
      )}${markdownSymbols}${markdownSymbols}${text.slice(end)}`;
      handleTextChange(newText);

      // Set cursor position between the symbols
      setTimeout(() => {
        if (textareaRef) {
          textareaRef.focus();
          textareaRef.selectionStart = start + markdownSymbols.length;
          textareaRef.selectionEnd = start + markdownSymbols.length;
        }
      }, 0);
    } else {
      // Text selected, wrap it with the symbols
      const selectedText = text.slice(start, end);
      const newText = `${text.slice(
        0,
        start
      )}${markdownSymbols}${selectedText}${markdownSymbols}${text.slice(end)}`;
      handleTextChange(newText);

      // Set cursor position after the wrapped text
      setTimeout(() => {
        if (textareaRef) {
          textareaRef.focus();
          const newPosition = end + markdownSymbols.length * 2;
          textareaRef.selectionStart = newPosition;
          textareaRef.selectionEnd = newPosition;
        }
      }, 0);
    }
  };

  const insertList = (ordered: boolean) => {
    if (!textareaRef) return;

    const start = textareaRef.selectionStart;
    const text = editorText;
    const prefix = ordered ? "1. " : "- ";
    const newText = `${text.slice(0, start)}${prefix}${text.slice(start)}`;

    handleTextChange(newText);
    setTimeout(() => {
      if (textareaRef) {
        textareaRef.focus();
        const newPosition = start + prefix.length;
        textareaRef.selectionStart = newPosition;
        textareaRef.selectionEnd = newPosition;
      }
    }, 0);
  };

  const insertLink = () => {
    if (!textareaRef) return;

    const start = textareaRef.selectionStart;
    const end = textareaRef.selectionEnd;
    const text = editorText;
    const linkTemplate = "[link text](https://example.com)";

    if (start === end) {
      // No text selected, insert template
      const newText = `${text.slice(0, start)}${linkTemplate}${text.slice(
        end
      )}`;
      handleTextChange(newText);

      // Set cursor at "link text" position for editing
      setTimeout(() => {
        if (textareaRef) {
          textareaRef.focus();
          textareaRef.selectionStart = start + 1;
          textareaRef.selectionEnd = start + 10; // "link text" length + 1 for [
        }
      }, 0);
    } else {
      // Text selected, use it as link text
      const selectedText = text.slice(start, end);
      const newText = `${text.slice(
        0,
        start
      )}[${selectedText}](https://example.com)${text.slice(end)}`;
      handleTextChange(newText);

      // Set cursor at the URL position for editing
      setTimeout(() => {
        if (textareaRef) {
          textareaRef.focus();
          textareaRef.selectionStart = start + selectedText.length + 3; // [selected text]( -> +3 for [](
          textareaRef.selectionEnd = start + selectedText.length + 20; // https://example.com length
        }
      }, 0);
    }
  };

  return (
    <div className={cn("rounded-md border border-input", className)}>
      <div className="flex justify-between p-2 bg-muted/30 border-b">
        <div className="flex gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => insertMarkdown("**")}
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => insertMarkdown("*")}
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => insertList(false)}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => insertList(true)}
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={insertLink}
            title="Insert Link"
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowPreview(!showPreview)}
          className="text-xs"
        >
          {showPreview ? "Edit" : "Full Preview"}
        </Button>
      </div>

      {showPreview ? (
        <div
          className={cn(
            "prose prose-stone dark:prose-invert max-w-none p-3",
            height,
            "overflow-auto"
          )}
        >
          <ReactMarkdown>{editorText}</ReactMarkdown>
        </div>
      ) : (
        <div className="relative">
          <Textarea
            ref={setTextareaRef}
            value={editorText}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder={placeholder}
            className={cn(
              "resize-none border-0 focus-visible:ring-0 rounded-none p-3",
              height,
              "font-mono"
            )}
            style={{
              lineHeight: "1.75",
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
              overflowWrap: "break-word",
            }}
          />
          <div
            className={cn(
              "markdown-overlay absolute top-0 left-0 p-3 pointer-events-none",
              height,
              "overflow-hidden w-full"
            )}
          >
            <ReactMarkdown>{editorText}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
