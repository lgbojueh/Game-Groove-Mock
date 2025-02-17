export const fetchGames = async (query: string) => {
  try {
    const response = await fetch(`https://www.boardgamegeek.com/xmlapi2/search?query=${query}&type=boardgame`);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const xmlText = await response.text();
    console.log("📜 API Response XML:", xmlText); // ✅ Debugging

    // Convert XML to JSON (since BGG API returns XML)
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");

    const items = Array.from(xmlDoc.getElementsByTagName("item"));
    
    return items.map((item) => ({
      id: item.getAttribute("id"),
      name: item.getElementsByTagName("name")[0]?.getAttribute("value") || "Unknown Game",
      thumbnail: `https://cf.geekdo-images.com/${item.getAttribute("id")}/img`,
    }));

  } catch (error) {
    console.error("❌ API Error:", error);
    return [];
  }
};