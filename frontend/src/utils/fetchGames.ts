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

    // Convert XML to JSON (since BGG API returns XML)
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");
    const items = Array.from(xmlDoc.getElementsByTagName("item"));

    const games = items.map((item) => {
      const id = item.getAttribute("id");
      const name =
        item.getElementsByTagName("name")[0]?.getAttribute("value") ||
        "Unknown Game";
      const thumbnail =
        item.getElementsByTagName("thumbnail")[0]?.textContent || "";
      // Use static default values instead of random ones:
      const complexity = "medium";
      const players = "3-4";
      const theme = "adventure";
      return { id, name, thumbnail, complexity, players, theme };
    });

    console.log("✅ Parsed Games:", games);
    return games;
  } catch (error) {
    console.error("❌ API Error:", error);
    return [];
  }
};