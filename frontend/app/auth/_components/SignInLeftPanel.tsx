import { Printer } from "lucide-react";
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
        </span>
      </Link>


    </aside>
  );
}
