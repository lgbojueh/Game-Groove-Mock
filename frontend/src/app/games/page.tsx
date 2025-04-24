import { Suspense } from "react";
import GamesClient from "./GamesClient";

export const dynamic = "force-dynamic";

export default function GamesPage() {
  return (
    <Suspense fallback={<div>Loading…</div>}>
      <GamesClient />
    </Suspense>
  );
}