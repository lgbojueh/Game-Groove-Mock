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
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");
    const items = Array.from(xmlDoc.getElementsByTagName("item"));

    // Dummy filter value pools
    const playersOptions = ["2", "3-4", "5+"];
    const complexityOptions = ["easy", "medium", "hard"];
    const playtimeOptions = ["short", "medium", "long"];
    const genreOptions = ["strategy", "party", "family", "abstract"];
    const ageOptions = ["kids", "teen", "adult"];
    const themeOptions = ["historical", "fantasy", "sci-fi", "horror", "adventure"];
    const getRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

    const games = items.map((item) => {
      const id = item.getAttribute("id");
      const title =
        item.getElementsByTagName("name")[0]?.getAttribute("value") ||
        "Unknown Game";

      return {
        id,
        title, // aligned with schema
        thumbnail: "/default-game-thumbnail.jpg", // will be updated with detailed fetch
        complexity: getRandom(complexityOptions),
        players: getRandom(playersOptions),
        playtime: getRandom(playtimeOptions),
        genre: getRandom(genreOptions),
        age: getRandom(ageOptions),
        theme: getRandom(themeOptions),
      };
    });

    console.log("✅ Parsed Games:", games);
    return games;
  } catch (error) {
    console.error("❌ API Error:", error);
    return [];
  }
};
