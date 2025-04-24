import { Suspense } from "react";
import GameDetailsClient from "./GameDetailsClient";

export const dynamic = "force-dynamic";

export default function GameDetailsPage() {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <GameDetailsClient />
    </Suspense>
  );
}