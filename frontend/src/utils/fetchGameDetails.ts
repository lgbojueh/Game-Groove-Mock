// src/utils/fetchGameDetails.ts

export interface GameDetails {
  id: string | null;
  name: string;
  thumbnail: string; // low-res placeholder
  image: string;     // high-res cover art
  description: string;
  players: string;
  complexity: string;
  playtime: string;
  genre: string;
  age: string;
  theme: string;
}

export const fetchGameDetails = async (
  id: string
): Promise<GameDetails | null> => {
  try {
    console.log("📡 Fetching game details for id:", id);
    const res = await fetch(
      `https://www.boardgamegeek.com/xmlapi2/thing?id=${encodeURIComponent(
        id
      )}&stats=1`
    );
    if (!res.ok) {
      throw new Error(`API request failed: ${res.statusText}`);
    }

    const xmlText = await res.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");
    const item = xmlDoc.getElementsByTagName("item")[0];
    if (!item) {
      throw new Error("No game details found");
    }

    // Primary name
    const name = Array.from(item.getElementsByTagName("name"))
      .find((n) => n.getAttribute("type") === "primary")
      ?.getAttribute("value") || "Unknown Game";

    // IDs
    const idAttr = item.getAttribute("id") || null;

    // Low-res thumbnail
    const thumbnail =
      item.getElementsByTagName("thumbnail")[0]?.textContent || "";

    // High-res cover art
    const image = item.getElementsByTagName("image")[0]?.textContent || "";

    // Full description
    const description =
      item.getElementsByTagName("description")[0]?.textContent ||
      "No description available.";

    // (Dummy) metadata — replace with real stats if available
    const players = "3-4";
    const complexity = "medium";
    const playtime = "medium";
    const genre = "strategy";
    const age = "teen";
    const theme = "adventure";

    return {
      id: idAttr,
      name,
      thumbnail,
      image,
      description,
      players,
      complexity,
      playtime,
      genre,
      age,
      theme,
    };
  } catch (error) {
    console.error("❌ Error fetching game details:", error);
    return null;
  }
};
