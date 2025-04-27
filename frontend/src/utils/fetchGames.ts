// src/utils/fetchGames.ts
export interface GameSummary {
  id: string;
  name: string;
  thumbnail: string; // low-res (blur placeholder)
  image: string;     // high-res cover art
  complexity: string;
  players: string;
  theme: string;
  playtime: string;
  genre: string;
  age: string;
}

export const fetchGames = async (query: string): Promise<GameSummary[]> => {
  try {
    console.log("📡 Fetching games for query:", query);
    const res = await fetch(
      `https://www.boardgamegeek.com/xmlapi2/search?query=${encodeURIComponent(
        query
      )}&type=boardgame`
    );
    if (!res.ok) {
      throw new Error(`API request failed: ${res.statusText}`);
    }
    const xmlText = await res.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");
    const items = Array.from(xmlDoc.getElementsByTagName("item"));

    const games: GameSummary[] = items.map((item) => {
      const id = item.getAttribute("id") || "";

      // Name (primary)
      const nameElems = Array.from(item.getElementsByTagName("name"));
      const name =
        nameElems.find((n) => n.getAttribute("type") === "primary")
          ?.getAttribute("value") || "Unknown Game";

      // Low-res thumbnail
      const thumbnail =
        item.getElementsByTagName("thumbnail")[0]?.textContent || "";

      // High-res cover art
      const image = item.getElementsByTagName("image")[0]?.textContent || "";

      // Dummy metadata (you may override with real stats later)
      const complexity = "medium";
      const players = "3-4";
      const theme = "adventure";
      const playtime = "medium";
      const genre = "strategy";
      const age = "teen";

      return {
        id,
        name,
        thumbnail,
        image,
        complexity,
        players,
        theme,
        playtime,
        genre,
        age,
      };
    });

    console.log("✅ Parsed Games:", games);
    return games;
  } catch (error) {
    console.error("❌ API Error:", error);
    return [];
  }
};
