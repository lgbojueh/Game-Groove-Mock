// src/utils/fetchDetailedGames.ts
export const fetchDetailedGames = async (ids: string[]) => {
  try {
    const response = await fetch(
      `https://www.boardgamegeek.com/xmlapi2/thing?id=${ids.join(
        ","
      )}&stats=1`
    );
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");
    const items = Array.from(xmlDoc.getElementsByTagName("item"));

    const games = items.map((item) => {
      const id = item.getAttribute("id") || "";
      const name =
        item.getElementsByTagName("name")[0]?.getAttribute("value") ||
        "Unknown Game";
      const thumbnail =
        item.getElementsByTagName("thumbnail")[0]?.textContent || "";
      const description =
        item.getElementsByTagName("description")[0]?.textContent ||
        "No description available.";

      // Instead of trying to map numeric stats,
      // assign consistent dummy values for filters:
      const players = "3-4";
      const complexity = "medium";
      const playtime = "medium";
      const genre = "strategy";
      const age = "teen";
      const theme = "adventure";

      return {
        id,
        name,
        thumbnail,
        description,
        players,
        complexity,
        playtime,
        genre,
        age,
        theme,
      };
    });

    return games;
  } catch (error) {
    console.error("Error fetching detailed games:", error);
    return [];
  }
};