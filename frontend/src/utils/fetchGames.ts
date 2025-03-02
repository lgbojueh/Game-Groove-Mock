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
      const name =
        item.getElementsByTagName("name")[0]?.getAttribute("value") ||
        "Unknown Game";
      const thumbnail =
        item.getElementsByTagName("thumbnail")[0]?.textContent || "";
      
      // Dummy/default filter values (adjust these as needed)
      const complexity = "medium";  // Options: "easy", "medium", "hard"
      const players = "3-4";          // Options: "2", "3-4", "5+"
      const theme = "adventure";      // Options: "adventure", "fantasy", etc.
      const playtime = "medium";      // Options: "short", "medium", "long"
      const genre = "strategy";       // Options: "strategy", "party", "family", etc.
      const age = "teen";             // Options: "kids", "teen", "adult"
      
      return { id, name, thumbnail, complexity, players, theme, playtime, genre, age };
    });

    console.log("✅ Parsed Games:", games);
    return games;
  } catch (error) {
    console.error("❌ API Error:", error);
    return [];
  }
};