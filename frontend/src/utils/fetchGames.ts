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
    console.log("📜 API Response XML:", xmlText); // Debug API response

    // Convert XML to JSON (since BGG API returns XML)
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");

    const items = Array.from(xmlDoc.getElementsByTagName("item"));

    const games = items.map((item) => ({
      id: item.getAttribute("id"),
      name: item.getElementsByTagName("name")[0]?.getAttribute("value") ||
        "Unknown Game",
      thumbnail: `https://cf.geekdo-images.com/${item.getAttribute("id")}/img`,
    }));

    console.log("✅ Parsed Games:", games); // Debug parsed results
    return games;
  } catch (error) {
    console.error("❌ API Error:", error);
    return [];
  }
};