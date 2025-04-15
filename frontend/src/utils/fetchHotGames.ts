// src/utils/fetchHotGames.ts

export const fetchHotGames = async () => {
  try {
    console.log("🔥 Fetching hot games...");
    const response = await fetch("https://www.boardgamegeek.com/xmlapi2/hot?type=boardgame");
    if (!response.ok) {
      throw new Error("Failed to fetch hot games");
    }

    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");
    const items = Array.from(xmlDoc.getElementsByTagName("item"));

    // Dummy filters to keep consistency across all game objects
    const playersOptions = ["2", "3-4", "5+"];
    const complexityOptions = ["easy", "medium", "hard"];
    const playtimeOptions = ["short", "medium", "long"];
    const genreOptions = ["strategy", "party", "family"];
    const ageOptions = ["kids", "teen", "adult"];
    const themeOptions = ["fantasy", "sci-fi", "horror", "historical"];
    const getRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

    const games = items.map((item) => {
      const id = item.getAttribute("id") || "";
      const title = item.getElementsByTagName("name")[0]?.getAttribute("value") || "Unknown Game";
      const thumbnail = item.getElementsByTagName("thumbnail")[0]?.textContent || "/default-game-thumbnail.jpg";

      return {
        id,
        title,
        thumbnail,
        players: getRandom(playersOptions),
        complexity: getRandom(complexityOptions),
        playtime: getRandom(playtimeOptions),
        genre: getRandom(genreOptions),
        age: getRandom(ageOptions),
        theme: getRandom(themeOptions),
      };
    });

    console.log("✅ Hot games fetched:", games);
    return games;
  } catch (error) {
    console.error("❌ Error fetching hot games:", error);
    return [];
  }
};
