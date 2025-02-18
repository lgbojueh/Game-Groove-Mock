export const fetchGames = async (query: string) => {
  try {
    console.log("📡 Fetching games for query:", query);
    // Update the URL below to match the new API's endpoint and parameters.
    const response = await fetch(`https://api.boardgamesapi.com/games?search=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    // The new API returns JSON.
    const data = await response.json();
    console.log("✅ Fetched Games:", data);
    // Depending on the API response structure, you may need to adjust this.
    // For example, if the API returns an object with a "results" array:
    return data.results || data;
  } catch (error) {
    console.error("❌ API Error:", error);
    return [];
  }
};