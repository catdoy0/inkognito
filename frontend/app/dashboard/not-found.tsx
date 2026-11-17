import Link from "next/link";

import { DASHBOARD_ROUTES } from "./routes";

export default function DashboardNotFound() {
  return (
    <section className="mx-auto flex min-h-[50vh] max-w-xl flex-col items-center justify-center text-center">
      <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">404</p>
      <h1 className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">
        Dashboard page not found
      </h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        This dashboard page does not exist yet.
      </p>
      <Link
        href={DASHBOARD_ROUTES.ROOT}
        className="mt-6 rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
      >
        Back to overview
      </Link>
    </section>
  );
}
