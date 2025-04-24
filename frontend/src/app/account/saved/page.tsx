import { Suspense } from "react";
import SavedGamesClient from "./SavedGamesClient";

export const dynamic = "force-dynamic";

export default function SavedGamesPage() {
  return (
    <Suspense fallback={<div>Loading saved games…</div>}>
      <SavedGamesClient />
    </Suspense>
  );
}