"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { cn } from "@/lib/utils";

export function Markdown({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "space-y-4 text-sm leading-relaxed text-slate-300",
        "[&_h2]:mt-6 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-slate-100",
        "[&_h3]:mt-5 [&_h3]:font-bold [&_h3]:text-slate-100",
        "[&_p]:text-slate-300",
        "[&_a]:text-emerald-400 [&_a]:underline",
        "[&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5",
        "[&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-5",
        "[&_li]:text-slate-300",
        "[&_strong]:text-slate-100",
        "[&_code:not(pre_code)]:rounded [&_code:not(pre_code)]:bg-slate-800 [&_code:not(pre_code)]:px-1.5 [&_code:not(pre_code)]:py-0.5 [&_code:not(pre_code)]:font-mono [&_code:not(pre_code)]:text-[0.85em] [&_code:not(pre_code)]:text-emerald-300",
        "[&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-slate-800 [&_pre]:bg-slate-950 [&_pre]:p-4 [&_pre]:text-xs",
        "[&_blockquote]:border-l-2 [&_blockquote]:border-emerald-500/50 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-400",
        "[&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-slate-800 [&_th]:p-2 [&_th]:text-left [&_td]:border [&_td]:border-slate-800 [&_td]:p-2",
        className
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}