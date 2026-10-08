import Link from "next/link";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-8 flex items-center justify-center gap-2 text-slate-300 hover:text-white"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-lg font-black text-slate-950">
            C+
          </span>
          <span className="text-xl font-black tracking-tight">C-PAGE</span>
        </Link>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl backdrop-blur sm:p-8">
          <h1 className="text-2xl font-black text-slate-50">{title}</h1>
          <p className="mt-1.5 text-sm text-slate-400">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </div>
        <div className="mt-6 text-center text-sm text-slate-400">{footer}</div>
      </div>
    </div>
  );
}