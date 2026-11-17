import { Suspense } from "react";
import { notFound } from "next/navigation";

interface UnknownDashboardPageProps {
  params: Promise<{ slug: string[] }>;
}

export default function UnknownDashboardPage({ params }: UnknownDashboardPageProps) {
  return (
    <Suspense fallback={<div className="min-h-[50vh]" aria-busy="true" />}>
      <ResolveUnknownDashboardPage params={params} />
    </Suspense>
  );
}

async function ResolveUnknownDashboardPage({ params }: UnknownDashboardPageProps): Promise<never> {
  await params;
  notFound();
}
