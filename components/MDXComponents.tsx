import type { MDXComponents as MDXComponentType } from 'mdx/types';
import { CopyButton } from './CopyButton';
import BlogFooter from '../content/BlogFooter';

export const MDXComponents: MDXComponentType = {
  h1: (props) => (
    <h1
      className="text-3xl sm:text-4xl font-serif font-normal tracking-tight text-gray-900 dark:text-gray-100 mt-10 mb-4"
      {...props}
    />
  ),
  h2: (props) => (
    <h2
      className="text-2xl sm:text-3xl font-serif font-normal tracking-tight text-gray-900 dark:text-gray-100 mt-8 mb-3"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="text-xl sm:text-2xl font-serif font-normal tracking-tight text-gray-900 dark:text-gray-100 mt-6 mb-2"
      {...props}
    />
  ),
  p: (props) => (
    <p className="text-base font-mono text-zinc-600 dark:text-zinc-300 my-3 leading-7 break-words overflow-wrap-anywhere" style={{ overflowWrap: 'anywhere' }} {...props} />
  ),
  H: (props) => (
    <span className="text-base font-mono text-purple-600 dark:text-purple-400" {...props} />
  ),
  ul: (props) => (
    <ul className="list-disc pl-6 text-base font-mono text-zinc-600 dark:text-zinc-300 my-3 space-y-1" {...props} />
  ),
  ol: (props) => (
    <ol className="list-decimal pl-6 text-base font-mono text-zinc-600 dark:text-zinc-300 my-3 space-y-1" {...props} />
  ),
  li: (props) => (
    <li className="text-base font-mono leading-7 break-words" style={{ overflowWrap: 'anywhere' }} {...props} />
  ),
  blockquote: (props) => (
    <blockquote
      className="border-l-4 border-purple-400/50 dark:border-purple-500/50 pl-5 italic text-sm font-mono text-gray-500 dark:text-gray-400 my-6"
      {...props}
    />
  ),
  code: (props) => {
    if (!props.className?.includes('language-')) {
      return (
        <code
          className="px-1.5 py-0.5 rounded-md bg-gray-200/60 dark:bg-white/5 text-gray-800 dark:text-gray-200 text-[13px] font-mono"
          {...props}
        />
      );
    }
    const codeText = typeof props.children === 'string'
      ? props.children
      : Array.isArray(props.children)
        ? props.children.join('')
        : '';
    return (
      <div className="relative my-6 group w-full max-w-full">
        <code
          className="block p-4 overflow-x-auto rounded-2xl border border-gray-200/60 dark:border-white/10 bg-gray-100/50 dark:bg-white/[0.03] backdrop-blur-xl text-sm sm:text-base"
          {...props}
        />
        <CopyButton
          text={codeText}
          className="absolute top-2 right-3 opacity-0 group-hover:opacity-100 transition-opacity rounded text-sm font-mono px-2 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-900"
        />
      </div>
    );
  },
  pre: (props) => (
    <pre
      className="max-w-full overflow-hidden text-sm md:text-base"
      {...props}
    />
  ),
  a: (props) => (
    <a
      className="text-blue-500 dark:text-blue-400 underline underline-offset-2 decoration-blue-300 dark:decoration-blue-600 transition-colors break-words"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  img: (props) => (
    <div className="flex flex-col items-center w-full my-8">
      <img
        alt={props.alt}
        src={props.src}
        className="rounded-xl max-w-full h-auto"
      />
      {props.alt && (
        <p className="text-xs font-mono text-gray-500 dark:text-gray-400 mt-3 text-center">
          {props.alt}
        </p>
      )}
    </div>
  ),
  hr: () => (
    <hr className="my-10 border-gray-200/60 dark:border-white/10" />
  ),
  table: (props) => (
    <div className="overflow-x-auto my-6 rounded-2xl border border-gray-200/60 dark:border-white/10 bg-gray-100/50 dark:bg-white/[0.03] backdrop-blur-xl">
      <table className="min-w-full text-sm font-mono text-zinc-600 dark:text-zinc-300" {...props} />
    </div>
  ),
  th: (props) => (
    <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200/60 dark:border-white/10" {...props} />
  ),
  td: (props) => (
    <td className="px-4 py-3 border-b border-gray-200/60 dark:border-white/10" {...props} />
  ),
  strong: (props) => (
    <strong className="font-semibold text-gray-900 dark:text-gray-100" {...props} />
  ),
  em: (props) => (
    <em className="italic text-gray-700 dark:text-gray-300" {...props} />
  ),
  BlogFooter: () => (
    <BlogFooter />
  ),
};
