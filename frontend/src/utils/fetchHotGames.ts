// src/utils/fetchHotGames.ts

export interface HotGame {
  id: string;
  name: string;
  thumbnail: string; // low-res placeholder
  image: string;     // high-res cover art
}

export const fetchHotGames = async (): Promise<HotGame[]> => {
  try {
    console.log("📡 Fetching hot games...");
    const res = await fetch(
      "https://www.boardgamegeek.com/xmlapi2/hot?type=boardgame"
    );
    if (!res.ok) {
      throw new Error(`API request failed: ${res.statusText}`);
    }

    const xmlText = await res.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");
    const items = Array.from(xmlDoc.getElementsByTagName("item"));

    const games: HotGame[] = items.map((item) => {
      const id = item.getAttribute("id") ?? "";

      // Display name
      const name =
        item.getElementsByTagName("name")[0]?.getAttribute("value") ??
        "Unknown Game";

      // Low-res thumbnail
      const thumbnail =
        item.getElementsByTagName("thumbnail")[0]?.textContent ?? "";

      // High-res cover art
      const image = item.getElementsByTagName("image")[0]?.textContent ?? "";

      return { id, name, thumbnail, image };
    });

    console.log("✅ Hot games fetched:", games);
    return games;
  } catch (error) {
    console.error("❌ Error fetching hot games:", error);
    return [];
  }
};
