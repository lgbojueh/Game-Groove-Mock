import axios from "axios";

export async function fetchGames(searchQuery: string) {
  try {
    console.log("Fetching games for query:", searchQuery);  // ✅ Debugging Log

    const response = await axios.get(
      `https://boardgamegeek.com/xmlapi2/search?query=${searchQuery}&type=boardgame`
    );

    console.log("API Response:", response.data);  // ✅ Check API Response

    if (response.data) {
      return response.data.items?.item || []; // ✅ Ensure correct structure
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching games:", error);
    return [];
  }
}