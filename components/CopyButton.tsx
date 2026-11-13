"use client";

import { useState } from "react";

/**
 * Recursively extract plain text from React children produced by
 * rehype-highlight (strings nested inside <span> elements).
 */
function extractText(node: unknown): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (
    node &&
    typeof node === "object" &&
    "props" in node &&
    (node as { props?: { children?: unknown } }).props
  ) {
    return extractText((node as { props: { children?: unknown } }).props.children);
  }
  return "";
}

export default function CopyButton({ text }: { text: unknown }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(extractText(text));
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard unavailable — ignore
    }
  };

  return (
    <button type="button" onClick={copy} className="copy-btn" aria-label="Copy code">
      {copied ? "copied" : "copy"}
    </button>
  );
}
