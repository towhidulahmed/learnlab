import { notFound } from "next/navigation";
import { Suspense } from "react";
import { MAX_MOCK_TESTS } from "@/lib/constants";
import { ResultView } from "@/components/result-view";

export const dynamicParams = false;

export function generateStaticParams() {
  return Array.from({ length: MAX_MOCK_TESTS }, (_, index) => ({
    id: String(index + 1),
  }));
}

export default async function StaticResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const testId = Number(id);

  if (!Number.isInteger(testId) || testId < 1 || testId > MAX_MOCK_TESTS) {
    notFound();
  }

  return (
    <Suspense fallback={<p className="text-zinc-400">Loading result...</p>}>
      <ResultView testId={testId} />
    </Suspense>
  );
}
