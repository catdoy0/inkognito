import { ArrowUpRight, Printer, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";

export default function SignInLeftPanel() {
  return (
    <aside className="relative hidden min-h-screen w-1/2 flex-col justify-between overflow-hidden bg-[#0b1a2e] px-12 py-10 text-white lg:flex xl:px-16">
      <div className="absolute -right-28 top-1/4 size-96 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute -bottom-32 -left-28 size-96 rounded-full bg-cyan-400/10 blur-3xl" />

      <Link href="/" className="relative z-10 flex w-fit items-center gap-3" aria-label="Inkognito home">
        <span className="grid size-11 place-items-center rounded-xl bg-blue-500 text-white shadow-lg shadow-blue-950/40">
          <Printer size={22} strokeWidth={2.2} />
        </span>
        <span>
          <span className="block text-sm font-bold tracking-[0.2em]">INKOGNITO</span>
          <span className="block text-xs text-slate-400">Self-service printing</span>
        </span>
      </Link>

      <div className="relative z-10 max-w-lg py-16">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-blue-300/10 px-3 py-1.5 text-xs font-medium text-blue-200">
          <Sparkles size={14} /> Print with ease
        </div>
        <h1 className="text-4xl font-bold leading-tight tracking-tight xl:text-5xl">
          Your documents, ready when you are.
        </h1>
        <p className="mt-5 max-w-md text-base leading-7 text-slate-300">
          Upload, manage, and print your documents from one simple account.
        </p>
        <div className="mt-10 flex items-center gap-3 text-sm text-slate-300">
          <ShieldCheck className="text-emerald-300" size={19} />
          Your account and documents stay protected.
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-between border-t border-slate-700/80 pt-5 text-xs text-slate-400">
        <span>Inkognito self-service printing</span>
        <Link href="/" className="inline-flex items-center gap-1 transition-colors hover:text-white">
          Learn more <ArrowUpRight size={14} />
        </Link>
      </div>
    </aside>
  );
}
