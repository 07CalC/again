import type { MDXComponents as MDXComponentType } from "mdx/types";
import CopyButton from "@/components/CopyButton";
import BlogFooter from "@/content/BlogFooter";

/** Pull the language tag (e.g. "rust") out of a hljs className. */
function langOf(children: unknown): string | null {
  const first = Array.isArray(children) ? children[0] : children;
  const className = (first as { props?: { className?: string } })?.props?.className ?? "";
  return /language-([\w-]+)/.exec(className)?.[1] ?? null;
}

export const MDXComponents: MDXComponentType = {
  pre: (props) => {
    const lang = langOf(props.children);
    return (
      <div className="code-block">
        {lang && <span className="lang-tag">{lang}</span>}
        <pre>{props.children}</pre>
        <CopyButton text={props.children} />
      </div>
    );
  },
  a: (props) => (
    <a
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  img: (props) => (
    <span className="block my-8">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt={props.alt ?? ""} src={props.src} loading="lazy" decoding="async" />
      {props.alt && (
        <span className="mt-3 block text-center voice-meta text-xs">{props.alt}</span>
      )}
    </span>
  ),
  BlogFooter,
  // The author's inline emphasis tag used across posts.
  H: (props) => <strong className="font-medium">{props.children}</strong>,
};
