"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import type { BeforeMount } from "@monaco-editor/react";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-slate-950">
      <Skeleton className="h-4/5 w-4/5" />
    </div>
  ),
});

const handleBeforeMount: BeforeMount = (monaco) => {
  monaco.editor.defineTheme("cpage", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "64748b", fontStyle: "italic" },
      { token: "keyword", foreground: "34d399" },
      { token: "string", foreground: "fbbf24" },
      { token: "number", foreground: "f472b6" },
      { token: "type", foreground: "60a5fa" },
    ],
    colors: {
      "editor.background": "#020617",
      "editor.lineHighlightBackground": "#0f172a",
      "editorLineNumber.foreground": "#334155",
      "editorCursor.foreground": "#34d399",
      "editor.selectionBackground": "#134e4a",
    },
  });
};

export function CodeEditor({
  value,
  onChange,
  readOnly = false,
  height = "360px",
}: {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  height?: string;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-800">
      <MonacoEditor
        height={height}
        language="cpp"
        theme="cpage"
        value={value}
        beforeMount={handleBeforeMount}
        onChange={(next) => onChange?.(next ?? "")}
        options={{
          readOnly,
          fontSize: 13.5,
          fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          padding: { top: 14, bottom: 14 },
          lineNumbersMinChars: 3,
          tabSize: 4,
          automaticLayout: true,
          smoothScrolling: true,
          renderLineHighlight: "all",
          cursorBlinking: "smooth",
          roundedSelection: true,
        }}
      />
    </div>
  );
}