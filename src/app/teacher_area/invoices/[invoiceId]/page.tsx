"use client";

import Invoice from "@/app/components/Invoice";

export default function SingleRequestPage({
  params,
}: {
  params: { invoiceId: number };
}) {
  return <Invoice invoiceId={params.invoiceId} />;
}
