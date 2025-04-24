import { Suspense } from "react";
import FavoritesClient from "./FavoritesClient";

export const dynamic = "force-dynamic";

export default function FavoriteGamesPage() {
  return (
    <Suspense fallback={<div>Loading favorites…</div>}>
      <FavoritesClient />
    </Suspense>
  );
}