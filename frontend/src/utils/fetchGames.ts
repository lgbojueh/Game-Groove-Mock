import { stdout } from "process";
import { config } from "next/dist/build/templates/pages";




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

    // Dummy filter values for demonstration:
    const complexityLevels = ["easy", "medium", "hard"];
    const playerOptions = ["2", "3-4", "5+"];
    const themes = ["fantasy", "sci-fi", "horror", "historical", "adventure"];

    const games = items.map((item) => {
      const id = item.getAttribute("id");
      const name =
        item.getElementsByTagName("name")[0]?.getAttribute("value") ||
        "Unknown Game";
      const thumbnail =
        item.getElementsByTagName("thumbnail")[0]?.textContent || "";
      // Add dummy filtering attributes
      const complexity =
        complexityLevels[Math.floor(Math.random() * complexityLevels.length)];
      const players =
        playerOptions[Math.floor(Math.random() * playerOptions.length)];
      const theme = themes[Math.floor(Math.random() * themes.length)];
      return { id, name, thumbnail, complexity, players, theme };
    });

    console.log("✅ Parsed Games:", games);
    return games;
  } catch (error) {
    console.error("❌ API Error:", error);
    return [];
  }
};