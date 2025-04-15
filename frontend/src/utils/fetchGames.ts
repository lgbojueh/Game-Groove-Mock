// src/utils/fetchGames.ts
export const fetchGames = async (query: string) => {
  try {
    console.log("📡 Fetching games for query:", query);
    const response = await fetch(
      `https://www.boardgamegeek.com/xmlapi2/search?query=${query}&type=boardgame`
    );
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    const xmlText = await response.text();
    console.log("📜 API Response XML:", xmlText);

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");
    const items = Array.from(xmlDoc.getElementsByTagName("item"));

    const games = items.map((item) => {
      const id = item.getAttribute("id");

      const nameElements = item.getElementsByTagName("name");
      let title = "Unknown Game";
      for (let i = 0; i < nameElements.length; i++) {
        if (nameElements[i].getAttribute("type") === "primary") {
          title = nameElements[i].getAttribute("value") || "Unknown Game";
          break;
        }
      }

      const thumbnail = item.getElementsByTagName("thumbnail")[0]?.textContent || "";

      const complexity = "medium";
      const players = "3-4";
      const theme = "adventure";
      const playtime = "medium";
      const genre = "strategy";
      const age = "teen";

      return { id, name: title, thumbnail, complexity, players, theme, playtime, genre, age };
    });

    console.log("✅ Parsed Games:", games);
    return games;
  } catch (error) {
    console.error("❌ API Error:", error);
    return [];
  }
};
