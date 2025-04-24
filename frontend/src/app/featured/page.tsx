import { Suspense } from "react";
import FeaturedClient from "./FeaturedClient";

export const dynamic = "force-dynamic";

export default function FeaturedPage() {
  return (
    <Suspense fallback={<div>Loading…</div>}>
      <FeaturedClient />
    </Suspense>
  );
}