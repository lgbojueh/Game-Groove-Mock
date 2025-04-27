// src/utils/fetchDetailedGames.ts

export interface DetailedGame {
  id: string;
  name: string;
  thumbnail: string; // low-res placeholder
  image: string;     // high-res cover art
  description: string;
  players: string;
  complexity: string;
  playtime: string;
  age: string;
  genre: string;
  theme: string;
}

export const fetchDetailedGames = async (
  ids: string[]
): Promise<DetailedGame[]> => {
  try {
    const url = `https://www.boardgamegeek.com/xmlapi2/thing?id=${encodeURIComponent(
      ids.join(",")
    )}&stats=1`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`API request failed: ${res.statusText}`);
    }
    const xmlText = await res.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");
    const items = Array.from(xmlDoc.getElementsByTagName("item"));

    // These are just dummy pick-from arrays; swap in real stats if you have them
    const playersOptions = ["2", "3-4", "5+"];
    const complexityOptions = ["easy", "medium", "hard"];
    const playtimeOptions = ["short", "medium", "long"];
    const ageOptions = ["kids", "teen", "adult"];
    const possibleGenres = [
      "strategy",
      "party",
      "family",
      "abstract",
      "cooperative",
    ];
    const possibleThemes = [
      "historical",
      "fantasy",
      "sci-fi",
      "horror",
      "adventure",
    ];

    return items.map((item) => {
      const id = item.getAttribute("id") || "";

      // Primary name
      const name =
        Array.from(item.getElementsByTagName("name")).find(
          (n) => n.getAttribute("type") === "primary"
        )?.getAttribute("value") || "Unknown Game";

      // Low-res thumbnail
      const thumbnail =
        item.getElementsByTagName("thumbnail")[0]?.textContent || "";

      // High-res cover art
      const image = item.getElementsByTagName("image")[0]?.textContent || "";

      // Full description
      const description =
        item.getElementsByTagName("description")[0]?.textContent ||
        "No description available.";

      // Random dummy metadata
      const players =
        playersOptions[
          Math.floor(Math.random() * playersOptions.length)
        ];
      const complexity =
        complexityOptions[
          Math.floor(Math.random() * complexityOptions.length)
        ];
      const playtime =
        playtimeOptions[
          Math.floor(Math.random() * playtimeOptions.length)
        ];
      const age =
        ageOptions[Math.floor(Math.random() * ageOptions.length)];
      const genre =
        possibleGenres[
          Math.floor(Math.random() * possibleGenres.length)
        ];
      const theme =
        possibleThemes[
          Math.floor(Math.random() * possibleThemes.length)
        ];

      return {
        id,
        name,
        thumbnail,
        image,
        description,
        players,
        complexity,
        playtime,
        age,
        genre,
        theme,
      };
    });
  } catch (error) {
    console.error("❌ Error fetching detailed games:", error);
    return [];
  }
};
